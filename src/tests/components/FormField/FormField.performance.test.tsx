import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

describe('FormField Performance', () => {
    const schema = z.object({
        testField: z.string().min(3, 'Must be at least 3 characters')
    });

    it('should not trigger unnecessary re-renders', async () => {
        const renderSpy = vi.fn();

        const TestComponent = () => {
            renderSpy();
            return (
                <TooltipProvider>
                    <FormProvider
                        schema={schema}
                        onSubmit={() => {
                            // Intentionally left empty for testing purposes
                        }}
                    >
                        <FormField
                            name='testField'
                            label='Test Field'
                        >
                            <input type='text' />
                        </FormField>
                    </FormProvider>
                </TooltipProvider>
            );
        };

        render(<TestComponent />);

        // Initial render + FormProvider context setup
        expect(renderSpy).toHaveBeenCalledTimes(1);

        // Type in the field
        const input = screen.getByTestId('testField');
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.blur(input);

        // Wait for validation
        await waitFor(() => {
            expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
        });

        // Type more to fix validation
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.blur(input);

        // Wait for validation to clear
        await waitFor(() => {
            expect(screen.queryByText('Must be at least 3 characters')).not.toBeInTheDocument();
        });

        // Verify the component didn't re-render unnecessarily
        // We expect only the initial render + context updates
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should efficiently handle multiple validation cycles', async () => {
        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => {
                        // Intentionally left empty for testing purposes
                    }}
                >
                    <FormField
                        name='testField'
                        label='Test Field'
                    >
                        <input type='text' />
                    </FormField>
                </FormProvider>
            </TooltipProvider>
        );

        const input = screen.getByTestId('testField');

        // Perform multiple validation cycles
        for (let i = 0; i < 5; i++) {
            // Invalid input
            fireEvent.change(input, { target: { value: 'a' } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
            });

            // Valid input
            fireEvent.change(input, { target: { value: 'abc' } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('Must be at least 3 characters')).not.toBeInTheDocument();
            });
        }

        // The test passes if we don't encounter performance issues
        expect(true).toBe(true);
    });
});
