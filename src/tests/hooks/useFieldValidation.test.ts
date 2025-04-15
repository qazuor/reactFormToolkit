import * as contextModule from '@/context';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFieldValidation } from '../../hooks/useFieldValidation';
import type { AsyncValidationProps } from '../../types';

// Mock the shouldApplyInputStyles function
vi.mock('@/lib/ui-library', () => ({
    shouldApplyInputStyles: (uiLibrary) => !uiLibrary?.enabled
}));

// Mock the FormContext
vi.mock('@/context', () => ({
    useFormContext: () => ({
        registerAsyncValidation: vi.fn(),
        registerAsyncError: vi.fn(),
        uiLibrary: undefined
    })
}));

describe('useFieldValidation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return initial validation state', () => {
        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class',
                        isValid: 'valid-class',
                        isInvalid: 'invalid-class',
                        isLoading: 'loading-class'
                    }
                },
                hasError: false
            })
        );

        expect(result.current).toHaveProperty('className');
        expect(result.current).toHaveProperty('ariaInvalid');
        expect(result.current).toHaveProperty('ariaDescribedBy');
        expect(result.current).toHaveProperty('hasAsyncError');
        expect(result.current).toHaveProperty('asyncValidating');
        expect(result.current).toHaveProperty('asyncValidatingStarted');
        expect(result.current).toHaveProperty('asyncError');
        expect(result.current).toHaveProperty('validate');

        expect(result.current.hasAsyncError).toBe(false);
        expect(result.current.asyncValidating).toBe(false);
        expect(result.current.asyncValidatingStarted).toBe(false);
        expect(result.current.asyncError).toBeUndefined();
    });

    it('should apply correct classes based on validation state', () => {
        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class',
                        isValid: 'valid-class',
                        isInvalid: 'invalid-class',
                        isLoading: 'loading-class'
                    }
                },
                hasError: true
            })
        );

        expect(result.current.className).toContain('input-class');
        expect(result.current.className).toContain('invalid-class');
        expect(result.current.ariaInvalid).toBe(true);
    });

    it('should handle async validation', async () => {
        const asyncValidationFn = vi.fn().mockImplementation((value) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(value === 'valid' ? true : 'Invalid value');
                }, 100);
            });
        });

        const asyncValidation: AsyncValidationProps = {
            asyncValidationFn,
            asyncValidationDebounce: 50,
            showValidationIcons: true,
            showLoadingSpinner: true,
            textWhenValidating: 'Validating...',
            textWhenBeforeStartValidating: 'Will validate'
        };

        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class',
                        isValid: 'valid-class',
                        isInvalid: 'invalid-class',
                        isLoading: 'loading-class'
                    }
                },
                asyncValidation,
                hasError: false
            })
        );

        // Initial state
        expect(result.current.asyncValidating).toBe(false);
        expect(result.current.hasAsyncError).toBe(false);

        // Trigger validation with invalid value
        await act(async () => {
            await result.current.validate('invalid');
            // Fast-forward past the debounce time
            vi.advanceTimersByTime(50);
            // Fast-forward past the validation time
            vi.advanceTimersByTime(100);
        });

        // Should show error
        expect(result.current.hasAsyncError).toBe(true);
        expect(result.current.asyncError).toBe('Invalid value');
        expect(result.current.asyncValidating).toBe(false);
        expect(result.current.asyncValidatingStarted).toBe(true);

        // Trigger validation with valid value
        await act(async () => {
            await result.current.validate('valid');
            // Fast-forward past the debounce time
            vi.advanceTimersByTime(50);
            // Fast-forward past the validation time
            vi.advanceTimersByTime(100);
        });

        // Should clear error
        expect(result.current.hasAsyncError).toBe(false);
        expect(result.current.asyncError).toBeUndefined();
    });

    it('should handle validation errors', async () => {
        const asyncValidationFn = vi.fn().mockImplementation(() => {
            return Promise.reject(new Error('Validation failed'));
        });

        const asyncValidation: AsyncValidationProps = {
            asyncValidationFn,
            asyncValidationDebounce: 50
        };

        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class'
                    }
                },
                asyncValidation,
                hasError: false
            })
        );

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Trigger validation
        await act(async () => {
            await result.current.validate('test');
            // Fast-forward past the debounce time
            vi.advanceTimersByTime(50);
        });

        // Should handle error gracefully
        expect(result.current.hasAsyncError).toBe(true);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('should respect debounce settings', async () => {
        const asyncValidationFn = vi.fn().mockResolvedValue(true);

        const asyncValidation: AsyncValidationProps = {
            asyncValidationFn,
            asyncValidationDebounce: 200
        };

        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class'
                    }
                },
                asyncValidation,
                hasError: false
            })
        );

        // Trigger validation
        await act(async () => {
            await result.current.validate('test');
        });

        // Should be in validating state
        expect(result.current.asyncValidating).toBe(true);
        expect(asyncValidationFn).not.toHaveBeenCalled();

        // Fast-forward half the debounce time
        await act(async () => {
            vi.advanceTimersByTime(100);
        });

        // Should still be validating
        expect(result.current.asyncValidating).toBe(true);
        expect(asyncValidationFn).not.toHaveBeenCalled();

        // Fast-forward the rest of the debounce time
        await act(async () => {
            vi.advanceTimersByTime(100);
        });

        // Now the validation function should have been called
        expect(asyncValidationFn).toHaveBeenCalledWith('test');
    });

    it('should not validate if schema validation fails', async () => {
        const asyncValidationFn = vi.fn().mockResolvedValue(true);
        const schema = {
            safeParse: vi.fn().mockReturnValue({ success: false, error: { issues: [{ path: ['test'] }] } })
        };

        const asyncValidation: AsyncValidationProps = {
            asyncValidationFn,
            asyncValidationDebounce: 50
        };

        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class'
                    }
                },
                asyncValidation,
                schema: schema as any,
                hasError: false
            })
        );

        // Trigger validation
        await act(async () => {
            await result.current.validate('test');
            // Fast-forward past the debounce time
            vi.advanceTimersByTime(50);
        });

        // Async validation should not be called if schema validation fails
        expect(asyncValidationFn).not.toHaveBeenCalled();
    });

    it('should handle UI library integration', () => {
        // Create a mock implementation for useFormContext
        const mockUseFormContext = vi.fn().mockReturnValue({
            registerAsyncValidation: vi.fn(),
            registerAsyncError: vi.fn(),
            uiLibrary: { enabled: true, name: 'material-ui' }
        });

        // Override the FormContext mock for this specific test
        vi.spyOn(contextModule, 'useFormContext').mockImplementation(mockUseFormContext);

        const { result } = renderHook(() =>
            useFieldValidation({
                fieldPath: 'test',
                isCheckbox: false,
                mergedStyles: {
                    field: {
                        input: 'input-class',
                        isValid: 'valid-class',
                        isInvalid: 'invalid-class'
                    }
                },
                hasError: true
            })
        );

        // When UI library is enabled, validation classes should not be applied
        expect(result.current.className).toContain('input-class');
        expect(result.current.className).not.toContain('invalid-class');
    });
});
