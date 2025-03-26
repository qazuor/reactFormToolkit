import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { SubmitButton } from '../../../components/FormButtons/SubmitButton';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

const schema = z.object({
    test: z.string().min(3)
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
    <TooltipProvider>
        <FormProvider
            schema={schema}
            onSubmit={() => Promise.resolve()}
        >
            {children}
        </FormProvider>
    </TooltipProvider>
);

describe('SubmitButton', () => {
    it('renders with default text', () => {
        render(
            <TestWrapper>
                <SubmitButton>Submit</SubmitButton>
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Submit');
    });

    it('applies custom className', () => {
        render(
            <TestWrapper>
                <SubmitButton className='custom-class'>Submit</SubmitButton>
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('shows loading state when submitting', async () => {
        const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(
            <FormProvider
                schema={schema}
                onSubmit={onSubmit}
            >
                <SubmitButton>Submit</SubmitButton>
            </FormProvider>
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(screen.getByTitle('Form has validation errors and cannot be submitted')).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('is disabled when form is invalid', () => {
        render(
            <TestWrapper>
                <SubmitButton>Submit</SubmitButton>
            </TestWrapper>
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', 'Form has validation errors and cannot be submitted');
    });

    it('is disabled when async validation is pending', async () => {
        render(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
            >
                <FormField
                    name='test'
                    asyncValidation={{
                        asyncValidationFn: async () => {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            return true;
                        }
                    }}
                >
                    <input type='text' />
                </FormField>
                <SubmitButton>Submit</SubmitButton>
            </FormProvider>
        );

        const testInput = screen.getByTestId('test');

        await act(async () => {
            fireEvent.change(testInput, { target: { value: 'test value' } });
            fireEvent.blur(testInput);
        });

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', 'Please wait for all validations to complete');
    });

    it('is disabled when there are async errors', async () => {
        render(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
            >
                <FormField
                    name='test'
                    asyncValidation={{
                        asyncValidationDebounce: 0,
                        asyncValidationFn: async () => {
                            return 'Async validation error';
                        }
                    }}
                >
                    <input type='text' />
                </FormField>
                <SubmitButton>Submit</SubmitButton>
            </FormProvider>
        );

        const testInput = screen.getByTestId('test');

        await act(async () => {
            fireEvent.change(testInput, { target: { value: 'test value' } });
            fireEvent.blur(testInput);
        });

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', 'Please fix all validation errors before submitting');
    });
});
