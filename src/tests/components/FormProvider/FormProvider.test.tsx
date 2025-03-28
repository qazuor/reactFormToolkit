import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormButtonsBar } from '../../../components/FormButtons/FormButtonsBar';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

const schema = z.object({
    test: z.string()
});

const schemaForSubmition = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Must contain at least 8 characters')
});

const TestWrapper = ({
    children,
    onSubmit,
    globalErrorOptions
}: { children: ReactNode; onSubmit; globalErrorOptions? }) => (
    <TooltipProvider>
        <FormProvider
            schema={schema}
            onSubmit={onSubmit}
            defaultValues={{ test: 'valid' }}
            globalErrorOptions={globalErrorOptions}
        >
            {children}
        </FormProvider>
    </TooltipProvider>
);

interface TestFormData {
    email: string;
    password: string;
}

const renderFormForSubmition = (onSubmit: (data: TestFormData) => void) => {
    return render(
        <TooltipProvider>
            <FormProvider
                schema={schemaForSubmition}
                onSubmit={onSubmit}
                defaultValues={{
                    email: '',
                    password: ''
                }}
            >
                <FormField
                    name='email'
                    label='Email'
                    required={true}
                >
                    <input type='email' />
                </FormField>
                <FormField
                    name='password'
                    label='Password'
                    required={true}
                >
                    <input type='password' />
                </FormField>
                <FormButtonsBar />
            </FormProvider>
        </TooltipProvider>
    );
};

describe('FormProvider with Global Errors', () => {
    it('displays global error when submission fails', async () => {
        const error = new Error('API Error');
        const onSubmit = vi.fn().mockRejectedValue(error);
        render(
            <TestWrapper onSubmit={onSubmit}>
                <FormField name='test'>
                    <input type='text' />
                </FormField>
                <FormButtonsBar />
            </TestWrapper>
        );
        await userEvent.click(screen.getByTestId('submit-button'));
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(error.message);
        });
    });
    it('applies global error options', async () => {
        const onSubmit = vi.fn().mockRejectedValue(new Error('Error'));
        render(
            <TestWrapper
                onSubmit={onSubmit}
                globalErrorOptions={{
                    position: 'bottom',
                    animation: 'fadeIn',
                    className: 'custom-error'
                }}
            >
                <FormField name='test'>
                    <input type='text' />
                </FormField>
                <FormButtonsBar />
            </TestWrapper>
        );
        await userEvent.click(screen.getByTestId('submit-button'));
        await waitFor(() => {
            const error = screen.getByRole('alert');
            expect(error).toHaveClass('mt-6', 'animate-fadeIn', 'custom-error');
        });
    });
    it('clears global error on form reset', async () => {
        const onSubmit = vi.fn().mockRejectedValue(new Error('Error de test'));
        render(
            <TestWrapper onSubmit={onSubmit}>
                <FormField name='test'>
                    <input type='text' />
                </FormField>
                <FormButtonsBar />
            </TestWrapper>
        );
        const testInput = screen.getByTestId('test');
        await act(async () => {
            fireEvent.click(screen.getByTestId('submit-button'));
        });
        await act(async () => {
            fireEvent.change(testInput, { target: { value: 'texto de prueba' } });
            fireEvent.blur(testInput);
        });
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('reset-button'));
        });

        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    it('auto dismisses global error', async () => {
        const onSubmit = vi.fn().mockRejectedValue(new Error('Error'));

        render(
            <TestWrapper
                onSubmit={onSubmit}
                globalErrorOptions={{
                    autoDismiss: true,
                    dismissAfter: 100
                }}
            >
                <FormField name='test'>
                    <input type='text' />
                </FormField>
                <FormButtonsBar />
            </TestWrapper>
        );
        await act(async () => {
            fireEvent.click(screen.getByTestId('submit-button'));
        });
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
        await waitFor(
            () => {
                expect(screen.queryByRole('alert')).not.toBeInTheDocument();
            },
            { timeout: 200 }
        );
    });
});

describe('FormProvider', () => {
    it('should handle form submission with valid data', async () => {
        const expectedData: TestFormData = {
            email: 'valid@email.com',
            password: 'password123'
        };

        const onSubmit = vi.fn();
        const { container } = renderFormForSubmition(onSubmit);

        const emailInput = container.querySelector('[data-testid="email"]') as HTMLInputElement;
        const passwordInput = container.querySelector('[data-testid="password"]') as HTMLInputElement;
        const submitButton = container.querySelector('[data-testid="submit-button"]') as HTMLButtonElement;

        // Wait for form to initialize
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        await act(async () => {
            fireEvent.change(emailInput, {
                target: { value: expectedData.email }
            });
            fireEvent.blur(emailInput);
        });

        // Wait for validation
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        await act(async () => {
            fireEvent.change(passwordInput, {
                target: { value: expectedData.password }
            });
            fireEvent.blur(passwordInput);
        });

        // Wait for validation
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        await act(async () => {
            fireEvent.submit(container.querySelector('form')!);
        });

        await waitFor(
            () => {
                expect(onSubmit).toHaveBeenCalledWith(expectedData);
                expect(onSubmit).toHaveBeenCalledTimes(1);
            },
            { timeout: 1000 }
        );
    });

    it('should not submit with invalid data', async () => {
        const onSubmit = vi.fn();
        const { container } = renderFormForSubmition(onSubmit);

        const emailInput = container.querySelector('[data-testid="email"]') as HTMLInputElement;
        const passwordInput = container.querySelector('[data-testid="password"]') as HTMLInputElement;
        const submitButton = container.querySelector('[data-testid="submit-button"]') as HTMLButtonElement;

        // Wait for form to initialize
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        await act(async () => {
            fireEvent.change(emailInput, {
                target: { value: 'invalid-email' }
            });
            fireEvent.blur(emailInput);
        });

        await act(async () => {
            fireEvent.change(passwordInput, {
                target: { value: '123' }
            });
            fireEvent.blur(passwordInput);
        });

        // Wait for validation
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
            expect(screen.getByText('Must contain at least 8 characters')).toBeInTheDocument();
        });
    });
});
