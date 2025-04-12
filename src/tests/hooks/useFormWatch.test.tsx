import { renderHook } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { useState, act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormWatch } from '../../hooks/useFormWatch';

// Create a mock for useFormContext
const mockFormContext = {
    form: {
        watch: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        getValues: vi.fn()
    }
};

// Mock the module
vi.mock('@/context/FormContext', () => {
    return {
        useFormContext: vi.fn().mockImplementation(() => mockFormContext),
        FormContext: {
            Provider: ({ children }) => children
        }
    };
});

describe('useFormWatch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call onChange with initial value when executeOnMount is true', () => {
        const onChange = vi.fn();
        const mockGetValues = vi.fn().mockReturnValue('initialValue');
        const mockWatch = vi.fn().mockImplementation((callback) => {
            return { unsubscribe: vi.fn() };
        });

        // Override the mock for this test
        vi.mocked(mockFormContext.form.watch).mockImplementation(mockWatch);
        vi.mocked(mockFormContext.form.getValues).mockImplementation(mockGetValues);

        renderHook(() =>
            useFormWatch({
                name: 'testField',
                onChange,
                executeOnMount: true
            })
        );

        expect(mockGetValues).toHaveBeenCalledWith('testField');
        expect(onChange).toHaveBeenCalledWith('initialValue');
    });

    it('should not call onChange with initial value when executeOnMount is false', () => {
        const onChange = vi.fn();
        const mockGetValues = vi.fn().mockReturnValue('initialValue');
        const mockWatch = vi.fn().mockReturnValue({ unsubscribe: vi.fn() });

        // Override the mock for this test
        vi.mocked(mockFormContext.form.watch).mockImplementation(mockWatch);
        vi.mocked(mockFormContext.form.getValues).mockImplementation(mockGetValues);

        renderHook(() =>
            useFormWatch({
                name: 'testField',
                onChange,
                executeOnMount: false
            })
        );

        expect(mockGetValues).toHaveBeenCalledWith('testField');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('should set up watch subscription', () => {
        const onChange = vi.fn();
        const mockGetValues = vi.fn().mockReturnValue('initialValue');
        const unsubscribe = vi.fn();
        const mockWatch = vi.fn().mockReturnValue({ unsubscribe });

        // Override the mock for this test
        vi.mocked(mockFormContext.form.watch).mockImplementation(mockWatch);
        vi.mocked(mockFormContext.form.getValues).mockImplementation(mockGetValues);

        const { unmount } = renderHook(() =>
            useFormWatch({
                name: 'testField',
                onChange
            })
        );

        expect(mockWatch).toHaveBeenCalled();

        // Test cleanup
        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });

    it('should skip onChange if value is the same and skipIfSameValue is true', () => {
        const onChange = vi.fn();
        const mockGetValues = vi.fn().mockReturnValue('testValue');
        let watchCallback: (values: any, info: { name?: string }) => void;
        const mockWatch = vi.fn().mockImplementation((callback) => {
            watchCallback = callback;
            return { unsubscribe: vi.fn() };
        });

        // Override the mock for this test
        vi.mocked(mockFormContext.form.watch).mockImplementation(mockWatch);
        vi.mocked(mockFormContext.form.getValues).mockImplementation(mockGetValues);

        renderHook(() =>
            useFormWatch({
                name: 'testField',
                onChange,
                skipIfSameValue: true
            })
        );

        // First call (initial mount)
        expect(onChange).toHaveBeenCalledTimes(1);

        // Reset mock to test subsequent calls
        onChange.mockReset();

        // Simulate watch callback with same value
        act(() => {
            watchCallback({}, { name: 'testField' });
        });

        // Should not call onChange again with the same value
        expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange if value changes even if skipIfSameValue is true', () => {
        const onChange = vi.fn();
        const mockGetValues = vi.fn().mockReturnValue('initialValue'); // Always return initialValue for consistency

        let watchCallback: (values: any, info: { name?: string }) => void;
        const mockWatch = vi.fn().mockImplementation((callback) => {
            watchCallback = callback;
            return { unsubscribe: vi.fn() };
        });

        // Override the mock for this test
        vi.mocked(mockFormContext.form.watch).mockImplementation(mockWatch);
        vi.mocked(mockFormContext.form.getValues).mockImplementation(mockGetValues);

        renderHook(() =>
            useFormWatch({
                name: 'testField',
                onChange,
                skipIfSameValue: true
            })
        );

        // First call (initial mount)
        expect(onChange).toHaveBeenCalledWith('initialValue');

        // Reset mock to test subsequent calls
        onChange.mockReset();

        // Change the mock to return new value for the next call
        mockGetValues.mockReturnValue('newValue');

        // Simulate watch callback with different value
        act(() => {
            watchCallback({}, { name: 'testField' });
        });

        // Should call onChange with the new value
        expect(onChange).toHaveBeenCalledWith('newValue');
    });

    it('should always call onChange if skipIfSameValue is false', () => {
        const onChange = vi.fn();
        const mockGetValues = vi.fn().mockReturnValue('sameValue');
        let watchCallback: (values: any, info: { name?: string }) => void;
        const mockWatch = vi.fn().mockImplementation((callback) => {
            watchCallback = callback;
            return { unsubscribe: vi.fn() };
        });

        // Override the mock for this test
        vi.mocked(mockFormContext.form.watch).mockImplementation(mockWatch);
        vi.mocked(mockFormContext.form.getValues).mockImplementation(mockGetValues);

        renderHook(() =>
            useFormWatch({
                name: 'testField',
                onChange,
                skipIfSameValue: false
            })
        );

        // First call (initial mount)
        expect(onChange).toHaveBeenCalledTimes(1);

        // Reset mock to test subsequent calls
        onChange.mockReset();

        // Simulate watch callback with same value
        act(() => {
            watchCallback({}, { name: 'testField' });
        });

        // Should call onChange even with the same value
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
