import { renderHook } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { act } from 'react-dom/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { useConditionalField, useConditionalFieldGroup } from '../../hooks/useConditionalField';

describe('useConditionalField', () => {
    const mockForm = {
        watch: vi.fn(),
        getValues: vi.fn(),
        unregister: vi.fn()
    };

    it('evaluates string condition correctly', () => {
        mockForm.getValues.mockReturnValue('A');

        const { result } = renderHook(() =>
            useConditionalField({
                form: mockForm as typeof mockForm,
                watchField: 'type',
                condition: 'A',
                content: <div>Test Content</div>
            })
        );

        expect(result.current.isConditionMet).toBe(true);
    });

    it('evaluates function condition correctly', () => {
        mockForm.getValues.mockReturnValue('A');

        const { result } = renderHook(() =>
            useConditionalField({
                form: mockForm as typeof mockForm,
                watchField: 'type',
                condition: (value) => value === 'A',
                content: <div>Test Content</div>
            })
        );

        expect(result.current.isConditionMet).toBe(true);
    });

    it('updates condition when watched field changes', () => {
        mockForm.getValues.mockReturnValue('A');
        let watchCallback: (values: any, info: { name?: string }) => void;
        mockForm.watch.mockImplementation((callback) => {
            watchCallback = callback;
            return { unsubscribe: vi.fn() };
        });

        const { result } = renderHook(() =>
            useConditionalField({
                form: mockForm as typeof mockForm,
                watchField: 'type',
                condition: 'A',
                content: <div>Test Content</div>
            })
        );

        expect(result.current.isConditionMet).toBe(true);

        // Simulate field value change
        mockForm.getValues.mockReturnValue('B');
        act(() => {
            watchCallback({}, { name: 'type' });
        });

        expect(result.current.isConditionMet).toBe(false);
    });
});

describe('useConditionalFieldGroup', () => {
    const mockForm = {
        watch: vi.fn(),
        getValues: vi.fn(),
        unregister: vi.fn()
    };

    it('returns correct content based on current value', () => {
        mockForm.getValues.mockReturnValue('A');

        const { result } = renderHook(() =>
            useConditionalFieldGroup({
                form: mockForm as typeof mockForm,
                watchField: 'type',
                conditions: {
                    A: <div>Content A</div>,
                    B: <div>Content B</div>
                }
            })
        );

        expect(result.current.currentValue).toBe('A');
    });

    it('updates content when watched field changes', () => {
        mockForm.getValues.mockReturnValue('A');
        let watchCallback: (values: any, info: { name?: string }) => void;
        mockForm.watch.mockImplementation((callback) => {
            watchCallback = callback;
            return { unsubscribe: vi.fn() };
        });

        const { result } = renderHook(() =>
            useConditionalFieldGroup({
                form: mockForm as typeof mockForm,
                watchField: 'type',
                conditions: {
                    A: <div>Content A</div>,
                    B: <div>Content B</div>
                }
            })
        );

        expect(result.current.currentValue).toBe('A');

        // Simulate field value change
        mockForm.getValues.mockReturnValue('B');
        act(() => {
            watchCallback({}, { name: 'type' });
        });

        expect(result.current.currentValue).toBe('B');
    });

    it('unregisters fields when keepRegistered is false', () => {
        mockForm.getValues.mockReturnValue('A');
        const unregisterSpy = vi.spyOn(mockForm, 'unregister');

        renderHook(() =>
            useConditionalFieldGroup({
                form: mockForm as typeof mockForm,
                watchField: 'type',
                conditions: {
                    A: <div>Content A</div>,
                    B: <div>Content B</div>
                },
                keepRegistered: false
            })
        );

        // Simulate field value change
        mockForm.getValues.mockReturnValue('B');
        act(() => {
            const watchCallback = mockForm.watch.mock.calls[0][0];
            watchCallback({}, { name: 'type' });
        });

        expect(unregisterSpy).toHaveBeenCalled();
    });
});
