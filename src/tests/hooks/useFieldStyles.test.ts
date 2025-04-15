import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useFieldStyles } from '../../hooks/useFieldStyles';

// Mock the FormContext
vi.mock('@/context', () => ({
    useFormContext: () => ({
        styleOptions: {
            field: {
                input: 'default-input-class',
                isValid: 'valid-class',
                isInvalid: 'invalid-class',
                isLoading: 'loading-class'
            }
        }
    })
}));

describe('useFieldStyles', () => {
    it('should return field classes and validation state functions', () => {
        const { result } = renderHook(() => useFieldStyles());

        expect(result.current).toHaveProperty('getFieldClasses');
        expect(result.current).toHaveProperty('setValidationState');
        expect(result.current).toHaveProperty('validationState');

        expect(typeof result.current.getFieldClasses).toBe('function');
        expect(typeof result.current.setValidationState).toBe('function');
    });

    it('should return correct classes for regular inputs', () => {
        const { result } = renderHook(() => useFieldStyles());

        const classes = result.current.getFieldClasses(false);
        expect(classes).toContain('default-input-class');
    });

    it('should return correct classes for checkbox inputs', () => {
        const { result } = renderHook(() => useFieldStyles());

        const classes = result.current.getFieldClasses(true);
        expect(classes).toContain('default-input-class');
    });

    it('should apply validation state classes', () => {
        const { result } = renderHook(() => useFieldStyles());

        // Set validation state to error
        act(() => {
            result.current.setValidationState({
                hasError: true,
                isValidating: false,
                error: 'Test error',
                validatingStarted: true
            });
        });

        const classes = result.current.getFieldClasses(false);
        waitFor(() => {
            expect(classes).toContain('invalid-class');
            expect(classes).not.toContain('valid-class');
            expect(classes).not.toContain('loading-class');
        });
    });

    it('should apply loading state classes', () => {
        const { result } = renderHook(() => useFieldStyles());

        // Set validation state to loading
        act(() => {
            result.current.setValidationState({
                hasError: false,
                isValidating: true,
                error: undefined,
                validatingStarted: true
            });
        });

        waitFor(() => {
            const classes = result.current.getFieldClasses(false);
            expect(classes).toContain('loading-class');
            expect(classes).not.toContain('invalid-class');
        });
    });

    it('should apply valid state classes', () => {
        const { result } = renderHook(() => useFieldStyles());

        // Set validation state to valid
        act(() => {
            result.current.setValidationState({
                hasError: false,
                isValidating: false,
                error: undefined,
                validatingStarted: true
            });
        });

        waitFor(() => {
            const classes = result.current.getFieldClasses(false);
            expect(classes).toContain('valid-class');
            expect(classes).not.toContain('invalid-class');
            expect(classes).not.toContain('loading-class');
        });
    });
});
