import { TooltipProvider } from '@radix-ui/react-tooltip';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { type SpyInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';

// Increase the test timeout to avoid timeout issues
const TEST_TIMEOUT = 5000;

describe('FormField Async Validation', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it(
        'handles async validation',
        async () => {
            const asyncValidation = vi.fn().mockResolvedValue(true);

            render(
                <TooltipProvider>
                    <FormProvider
                        schema={z.object({ testField: z.string() })}
                        onSubmit={() => Promise.resolve()}
                        defaultValues={{ testField: '' }}
                    >
                        <FormField
                            name='testField'
                            asyncValidation={{
                                asyncValidationDebounce: 10,
                                asyncValidationFn: async (value) => {
                                    return await asyncValidation(value);
                                },
                                showValidationIcons: true
                            }}
                        >
                            <input type='text' />
                        </FormField>
                    </FormProvider>
                </TooltipProvider>
            );

            const input = screen.getByTestId('testField');

            // Change input value
            fireEvent.change(input, { target: { value: 'test' } });

            // Fast-forward timers
            vi.runAllTimers();

            // Use real timers for the waitFor
            vi.useRealTimers();

            // Wait for validation to complete
            await waitFor(
                () => {
                    expect(asyncValidation).toHaveBeenCalledWith('test');
                },
                { timeout: TEST_TIMEOUT }
            );
        },
        TEST_TIMEOUT
    );

    it(
        'shows async validation error message',
        async () => {
            const asyncValidation = vi.fn().mockImplementation((value) => {
                return Promise.resolve(value === 'taken' ? 'Username is already taken' : true);
            });

            render(
                <TooltipProvider>
                    <FormProvider
                        schema={z.object({ testField: z.string() })}
                        onSubmit={() => Promise.resolve()}
                        defaultValues={{ testField: '' }}
                    >
                        <FormField
                            name='testField'
                            asyncValidation={{
                                asyncValidationDebounce: 10,
                                asyncValidationFn: async (value) => {
                                    return await asyncValidation(value as string);
                                },
                                showValidationIcons: true,
                                textWhenValidating: 'Checking...'
                            }}
                        >
                            <input type='text' />
                        </FormField>
                    </FormProvider>
                </TooltipProvider>
            );

            const input = screen.getByTestId('testField');

            // Enter invalid value
            fireEvent.change(input, { target: { value: 'taken' } });

            // Fast-forward timers
            vi.runAllTimers();

            // Use real timers for the waitFor
            vi.useRealTimers();

            // Wait for error message to appear - use getAllByText to handle multiple elements
            await waitFor(
                () => {
                    const errorElements = screen.getAllByText('Username is already taken');
                    expect(errorElements.length).toBeGreaterThan(0);
                },
                { timeout: TEST_TIMEOUT }
            );
        },
        TEST_TIMEOUT
    );

    it(
        'handles async validation errors gracefully',
        async () => {
            // Create a spy that will throw an error
            const asyncValidation: SpyInstance = vi.fn().mockRejectedValue(new Error('Validation service error'));

            // Spy on console.error to suppress the expected error
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
                // Do nothing
            });

            render(
                <TooltipProvider>
                    <FormProvider
                        schema={z.object({ testField: z.string() })}
                        onSubmit={() => Promise.resolve()}
                        defaultValues={{ testField: '' }}
                    >
                        <FormField
                            name='testField'
                            asyncValidation={{
                                asyncValidationDebounce: 10,
                                asyncValidationFn: async (value) => {
                                    return await asyncValidation(value);
                                }
                            }}
                        >
                            <input type='text' />
                        </FormField>
                    </FormProvider>
                </TooltipProvider>
            );

            const input = screen.getByTestId('testField');

            // Trigger validation
            fireEvent.change(input, { target: { value: 'test' } });

            // Fast-forward timers
            vi.runAllTimers();

            // Use real timers for the waitFor
            vi.useRealTimers();

            // Wait for field to show error state
            await waitFor(
                () => {
                    const input = screen.getByTestId('testField');
                    expect(input).toHaveAttribute('aria-invalid', 'true');
                    expect(asyncValidation).toHaveBeenCalled();
                },
                { timeout: TEST_TIMEOUT }
            );

            // Clean up console spy
            consoleErrorSpy.mockRestore();
        },
        TEST_TIMEOUT
    );
});
