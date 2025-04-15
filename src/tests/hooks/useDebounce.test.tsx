import { act, renderHook } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial value', 500));
        expect(result.current).toBe('initial value');
    });

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial value', delay: 500 }
        });

        // Initial value should be returned immediately
        expect(result.current).toBe('initial value');

        // Update the value
        rerender({ value: 'updated value', delay: 500 });

        // Value should not have changed yet
        expect(result.current).toBe('initial value');

        // Fast-forward time
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Now the value should be updated
        expect(result.current).toBe('updated value');
    });

    it('should handle multiple updates within the delay period', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial value', delay: 500 }
        });

        // Update multiple times
        rerender({ value: 'update 1', delay: 500 });

        act(() => {
            vi.advanceTimersByTime(200);
        });

        rerender({ value: 'update 2', delay: 500 });

        act(() => {
            vi.advanceTimersByTime(200);
        });

        rerender({ value: 'final update', delay: 500 });

        // Value should still be the initial one
        expect(result.current).toBe('initial value');

        // Fast-forward remaining time
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Now the value should be the final update
        expect(result.current).toBe('final update');
    });

    it('should handle delay changes', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial value', delay: 500 }
        });

        // Update with a longer delay
        rerender({ value: 'updated value', delay: 1000 });

        // Fast-forward 500ms
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Value should not have changed yet due to longer delay
        expect(result.current).toBe('initial value');

        // Fast-forward remaining time
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Now the value should be updated
        expect(result.current).toBe('updated value');
    });

    it('should handle different value types', () => {
        // Test with number
        const { result: numberResult, rerender: numberRerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 0, delay: 500 } }
        );

        numberRerender({ value: 42, delay: 500 });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(numberResult.current).toBe(42);

        // Test with object
        const { result: objectResult, rerender: objectRerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: { test: 'initial' }, delay: 500 } }
        );

        const newObject = { test: 'updated' };
        objectRerender({ value: newObject, delay: 500 });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(objectResult.current).toEqual(newObject);
    });

    it('should clear timeout on unmount', () => {
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

        const { unmount } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'test', delay: 500 }
        });

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
