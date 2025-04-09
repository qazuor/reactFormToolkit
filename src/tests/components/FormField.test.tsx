import { TooltipProvider } from '@radix-ui/react-tooltip';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import type { TooltipOptions } from '../../types/field';
const TestWrapper = ({ children }: { children: ReactNode }) => <TooltipProvider>{children}</TooltipProvider>;

describe('FormField', () => {
    const schema = z.object({
        testField: z.string().min(3, 'Must be at least 3 characters')
    });

    const renderField = (props = {}) => {
        return render(
            <TestWrapper>
                <FormProvider
                    schema={schema}
                    onSubmit={() => {
                        // Intentionally left empty for testing purposes
                    }}
                >
                    <FormField
                        name='testField'
                        label='Test Field'
                        {...props}
                    >
                        <input type='text' />
                    </FormField>
                </FormProvider>
            </TestWrapper>
        );
    };

    it('renders with label and input', () => {
        renderField();
        expect(screen.getByTestId('field-label-text')).toHaveTextContent('Test Field');
        expect(screen.getByTestId('testField')).toBeInTheDocument();
    });

    it('shows required indicator when required prop is true', () => {
        renderField({ required: true });
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('displays tooltip when tooltip prop is provided', () => {
        renderField({
            tooltip: 'Help text',
            tooltipOptions: {
                position: 'right',
                align: 'start'
            }
        });
        const tooltipTrigger = screen.getByRole('button');
        expect(tooltipTrigger).toHaveClass('cursor-help');
    });

    it('passes tooltipOptions to FieldLabel', async () => {
        const tooltipOptions: TooltipOptions = {
            position: 'top',
            align: 'center',
            sideOffset: 12,
            className: 'custom-tooltip'
        };

        renderField({
            tooltip: 'Help text',
            tooltipOptions
        });

        const trigger = screen.getByTestId('field-tooltip-trigger');
        await userEvent.hover(trigger);

        const tooltipContent = screen.getByTestId('field-tooltip-content');
        expect(tooltipContent).toHaveClass('custom-tooltip');
    });

    it('shows validation error message on invalid input', async () => {
        renderField();
        const input = screen.getByTestId('testField');

        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.blur(input);

        expect(await screen.findByText('Must be at least 3 characters')).toBeInTheDocument();
    });

    it('handles checkbox inputs correctly', () => {
        render(
            <FormProvider
                schema={z.object({ checked: z.boolean() })}
                onSubmit={() => {
                    // Intentionally left empty for testing purposes
                }}
            >
                <FormField name='checked'>
                    <input type='checkbox' />
                </FormField>
            </FormProvider>
        );

        const checkbox = screen.getByTestId('checked');
        expect(checkbox).toHaveAttribute('type', 'checkbox');

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    it('applies aria attributes correctly', () => {
        renderField({ description: 'Help text' });
        const input = screen.getByTestId('testField');
        const description = screen.getByText('Help text');

        expect(description).toHaveAttribute('id', 'testField-description');
        expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('renders label and description when children is a function', () => {
        render(
            <TestWrapper>
                <FormProvider
                    schema={schema}
                    onSubmit={() => {
                        // Intentionally left empty for testing purposes
                    }}
                >
                    <FormField
                        name='testField'
                        label='Function Field'
                        description='Field description'
                    >
                        {({ field }) => (
                            <input
                                type='text'
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    </FormField>
                </FormProvider>
            </TestWrapper>
        );

        expect(screen.getByText('Function Field')).toBeInTheDocument();
        expect(screen.getByText('Field description')).toBeInTheDocument();
    });

    it('handles non-string error messages', async () => {
        const schema = z.object({
            testField: z.string().min(5, 'Must be at least 5 characters')
        });

        render(
            <FormProvider
                schema={schema}
                onSubmit={() => {
                    // Intentionally left empty for testing purposes
                }}
            >
                <FormField name='testField'>
                    <input type='text' />
                </FormField>
            </FormProvider>
        );

        const input = screen.getByTestId('testField');
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.blur(input);

        expect(await screen.findByText('Must be at least 5 characters')).toBeInTheDocument();
    });

    it('handles async validation', async () => {
        // vi.useFakeTimers();
        const asyncValidation = vi.fn().mockImplementation((value: string) => {
            return new Promise((resolve) => {
                resolve(value === 'taken' ? 'This value is already taken' : undefined);
            });
        });

        const schema = z.object({
            testField: z.string().min(3)
        });

        render(
            <TestWrapper>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    mode='onChange'
                    defaultValues={{ testField: '' }}
                >
                    <FormField
                        name='testField'
                        asyncValidation={{
                            asyncValidationDebounce: 100,
                            asyncValidationFn: async (value: string) => {
                                const isAvailable = await asyncValidation(value);
                                return isAvailable ? true : 'Email is already registered';
                            }
                        }}
                    >
                        <input type='text' />
                    </FormField>
                </FormProvider>
            </TestWrapper>
        );

        const input = screen.getByTestId('testField');
        await act(() => {
            fireEvent.change(input, { target: { value: 'valid' } });
        });
        // vi.runAllTimers();

        await waitFor(() => {
            expect(asyncValidation).toHaveBeenCalledWith('valid');
            expect(screen.queryByText('This value is already taken')).not.toBeInTheDocument();
        });
        // vi.useRealTimers();
    });
});

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
});
