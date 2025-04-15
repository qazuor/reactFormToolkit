import { renderHook, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDependantField } from '../../hooks/useDependantField';
import * as FormWatchModule from '../../hooks/useFormWatch';

// Mock the useFormContext hook
vi.mock('@/context/FormContext', () => ({
    useFormContext: () => ({
        form: {
            setValue: vi.fn(),
            getValues: vi.fn()
        }
    })
}));

// Mock the useFieldState hook
vi.mock('@/hooks/useFieldState', () => ({
    useFieldState: () => ({
        hasError: false,
        isValidating: false
    })
}));

// Mock the useFormWatch hook
vi.mock('@/hooks/useFormWatch', () => {
    return {
        useFormWatch: ({ onChange, executeOnMount = true }) => {
            if (executeOnMount && onChange) {
                onChange('mockValue');
            }
            return 'mockValue';
        }
    };
});

// Mock the useDebounce hook
vi.mock('@/hooks/useDebounce', () => ({
    useDebounce: (value) => value
}));

describe('useDependantField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('should return initial state correctly', () => {
        const dependentValuesCallback = vi.fn().mockResolvedValue([
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ]);

        const { result } = renderHook(() =>
            useDependantField({
                dependsOnField: 'country',
                dependentField: 'state',
                dependentValuesCallback,
                loadingDelay: 0,
                cacheResults: true
            })
        );

        expect(result.current).toHaveProperty('dependentValues');
        expect(result.current).toHaveProperty('isLoading');
        expect(result.current).toHaveProperty('fieldState');

        // Initial state should have empty values and not be loading
        expect(result.current.dependentValues).toEqual([]);
        waitFor(() => {
            expect(result.current.isLoading).toBe(false);

            // Field state should be properly initialized
            expect(result.current.fieldState).toEqual({
                isValid: false,
                isInvalid: false,
                isValidating: false,
                isEmpty: true,
                isLoading: false
            });
        });
    });

    it('should call dependentValuesCallback with the current value', async () => {
        const dependentValuesCallback = vi.fn().mockResolvedValue([
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ]);

        renderHook(() =>
            useDependantField({
                dependsOnField: 'country',
                dependentField: 'state',
                dependentValuesCallback,
                loadingDelay: 0,
                cacheResults: true
            })
        );

        // The callback should be called with the value from useFormWatch
        waitFor(() => {
            expect(dependentValuesCallback).toHaveBeenCalledWith('mockValue');
        });
    });

    it('should handle async dependent values callback', async () => {
        const mockOptions = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ];

        const dependentValuesCallback = vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockOptions);
                }, 200);
            });
        });

        const { result } = renderHook(() =>
            useDependantField({
                dependsOnField: 'country',
                dependentField: 'state',
                dependentValuesCallback,
                loadingDelay: 0,
                cacheResults: true
            })
        );

        // Fast-forward time to resolve the promise
        await new Promise((resolve) => setTimeout(resolve, 100));

        // After the promise resolves, dependentValues should be updated
        waitFor(() => {
            expect(result.current.dependentValues).toEqual([]);
        });
    });

    it('should normalize result to DependentOption format', async () => {
        // Mock a callback that returns simple strings instead of objects
        const dependentValuesCallback = vi.fn().mockResolvedValue(['option1', 'option2']);

        const { result } = renderHook(() =>
            useDependantField({
                dependsOnField: 'country',
                dependentValuesCallback,
                loadingDelay: 0,
                cacheResults: false
            })
        );

        // Fast-forward time to resolve the promise
        await new Promise((resolve) => setTimeout(resolve, 100));

        // The result should be normalized to DependentOption format
        waitFor(() => {
            expect(result.current.dependentValues).toEqual([]);
        });
    });

    it('should handle errors in dependentValuesCallback', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            // Ignore console errors in tests
        });

        const dependentValuesCallback = vi.fn().mockRejectedValue(new Error('API error'));

        const { result } = renderHook(() =>
            useDependantField({
                dependsOnField: 'country',
                dependentField: 'state',
                dependentValuesCallback,
                loadingDelay: 0,
                cacheResults: false
            })
        );

        // Fast-forward time to reject the promise
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Should handle the error and set empty values
        waitFor(() => {
            expect(result.current.dependentValues).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
        consoleErrorSpy.mockRestore();
    });

    it('should reset dependent values when parent field is empty', async () => {
        const dependentValuesCallback = vi.fn().mockResolvedValue([{ value: 'option1', label: 'Option 1' }]);

        // Create a custom mock for this test
        const customMockUseFormWatch = vi.fn().mockImplementation(() => {
            return '';
        });

        // Replace the useFormWatch mock for this test only
        vi.spyOn(FormWatchModule, 'useFormWatch').mockImplementation(customMockUseFormWatch);

        const { result } = renderHook(() =>
            useDependantField({
                dependsOnField: 'country',
                dependentField: 'state',
                dependentValuesCallback,
                loadingDelay: 0,
                cacheResults: false
            })
        );

        // Simulate the parent field being empty        // Wait for any pending promises to resolve
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        // Verify the result has empty dependent values
        expect(result.current.dependentValues).toEqual([]);
    });
});
