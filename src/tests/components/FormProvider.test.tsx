import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../components/ui/tooltip';

interface TestFormData {
    email: string;
    password: string;
}

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

const renderForm = (onSubmit: (data: TestFormData) => void) => {
    return render(
        <TooltipProvider>
            <FormProvider
                schema={schema}
                onSubmit={onSubmit}
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
                <button type='submit'>Submit</button>
            </FormProvider>
        </TooltipProvider>
    );
};

describe('FormProvider', () => {
    it('should handle form submission with valid data', async () => {
        const expectedData: TestFormData = {
            email: 'valid@email.com',
            password: 'password123'
        };

        const onSubmit = vi.fn();
        renderForm(onSubmit);

        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(emailInput, {
            target: { value: expectedData.email }
        });
        fireEvent.blur(emailInput);

        fireEvent.change(passwordInput, {
            target: { value: expectedData.password }
        });
        fireEvent.blur(passwordInput);

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expectedData);
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should not submit with invalid data', async () => {
        const onSubmit = vi.fn();
        renderForm(onSubmit);

        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(emailInput, {
            target: { value: 'invalid-email' }
        });
        fireEvent.blur(emailInput);

        fireEvent.change(passwordInput, {
            target: { value: '123' }
        });
        fireEvent.blur(passwordInput);

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
            expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
            expect(screen.getByText(/must contain at least 8 character/i)).toBeInTheDocument();
        });
    });
});
