'use client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField, FormProvider, useFormContext } from '../src';

describe('FormProvider', () => {
    it('renders form and handles submission', async () => {
        const handleSubmit = vi.fn();
        const schema = z.object({
            name: z.string().min(2, 'Name too short'),
            email: z.string().email('Invalid email')
        });

        render(
            <FormProvider
                onSubmit={handleSubmit}
                schema={schema}
                defaultValues={{ name: '', email: '' }}
            >
                <FormField
                    name='name'
                    label='Name'
                >
                    <input type='text' />
                </FormField>
                <FormField
                    name='email'
                    label='Email'
                >
                    <input type='email' />
                </FormField>
                <button type='submit'>Submit</button>
            </FormProvider>
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'John Doe', email: 'john@example.com' }),
                expect.anything()
            );
        });
    });

    it('shows validation errors', async () => {
        const handleSubmit = vi.fn();
        const schema = z.object({
            name: z.string().min(2, 'Name too short'),
            email: z.string().email('Invalid email')
        });

        render(
            <FormProvider
                onSubmit={handleSubmit}
                schema={schema}
                defaultValues={{ name: '', email: '' }}
            >
                <FormField
                    name='name'
                    label='Name'
                >
                    <input type='text' />
                </FormField>
                <FormField
                    name='email'
                    label='Email'
                >
                    <input type='email' />
                </FormField>
                <button type='submit'>Submit</button>
            </FormProvider>
        );

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText('Name too short')).toBeInTheDocument();
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
        });

        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('resets form when resetOnSubmit is true', async () => {
        const handleSubmit = vi.fn();
        const schema = z.object({
            name: z.string().min(2, 'Name too short')
        });

        const TestComponent = () => {
            const { form } = useFormContext();
            const value = form.watch('name');
            return <span data-testid='name-value'>{value}</span>;
        };

        render(
            <FormProvider
                onSubmit={handleSubmit}
                schema={schema}
                defaultValues={{ name: '' }}
                resetOnSubmit={true}
            >
                <FormField
                    name='name'
                    label='Name'
                >
                    <input type='text' />
                </FormField>
                <TestComponent />
                <button type='submit'>Submit</button>
            </FormProvider>
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' }), expect.anything());
        });

        await waitFor(() => {
            expect(screen.getByTestId('name-value')).toHaveTextContent('');
        });
    });
});
