import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';

type FormData = {
    email: string;
    password: string;
};

describe('FormProvider', () => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    });

    it('renders form fields and handles submission', async () => {
        const onSubmit = vi.fn();
        const expectedData: FormData = {
            email: 'test@example.com',
            password: 'password123'
        };

        render(
            <FormProvider
                schema={schema}
                onSubmit={(data: FormData) => onSubmit(data)}
            >
                <FormField name='email'>
                    <input type='email' />
                </FormField>
                <FormField name='password'>
                    <input type='password' />
                </FormField>
                <button type='submit'>Submit</button>
            </FormProvider>
        );

        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(emailInput, {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(passwordInput, {
            target: { value: 'password123' }
        });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expectedData);
        });
    });
});
