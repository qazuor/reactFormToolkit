import { TooltipProvider } from '@radix-ui/react-tooltip';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import type { TooltipOptions } from '../../../types/field';

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
});
