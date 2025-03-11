import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField, FormProvider } from '../src';
import { useFormContext } from '../src/context/FormContext';

describe('Integration Tests', () => {
    it('handles a complex form with multiple field types and validation', async () => {
        const handleSubmit = vi.fn();
        const schema = z.object({
            name: z.string().min(2, 'Name too short'),
            email: z.string().email('Invalid email'),
            age: z.coerce.number().min(18, 'Must be at least 18'),
            country: z.string().min(1, 'Please select a country'),
            terms: z.literal(true, {
                errorMap: () => ({ message: 'You must accept the terms' })
            })
        });

        type CountrySelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
        const CountrySelect = (props: CountrySelectProps) => (
            <select {...props}>
                <option value=''>Select country</option>
                <option value='us'>United States</option>
                <option value='uk'>United Kingdom</option>
            </select>
        );

        const FormValues = () => {
            const { form } = useFormContext();
            const values = form.watch();
            return <pre data-testid='form-values'>{JSON.stringify(values, null, 2)}</pre>;
        };

        render(
            <FormProvider
                onSubmit={handleSubmit}
                schema={schema}
                defaultValues={{ name: '', email: '', age: 0, country: '', terms: false }}
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
                <FormField
                    name='age'
                    label='Age'
                    rules={{ valueAsNumber: true }}
                >
                    <input type='number' />
                </FormField>
                <FormField
                    name='country'
                    label='Country'
                >
                    <CountrySelect />
                </FormField>
                <FormField
                    name='terms'
                    label='I accept the terms'
                >
                    <input type='checkbox' />
                </FormField>
                <FormValues />
                <button type='submit'>Submit</button>
            </FormProvider>
        );

        // Fill in valid data
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
        fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'us' } });
        fireEvent.click(screen.getByLabelText('I accept the terms'));

        // Submit the form
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'John Doe',
                    email: 'john@example.com',
                    age: 25,
                    country: 'us',
                    terms: true
                }),
                expect.anything()
            );
        });

        // Check if form values are updated correctly
        expect(JSON.parse(screen.getByTestId('form-values').textContent || '{}')).toEqual({
            name: 'John Doe',
            email: 'john@example.com',
            age: '25', //Form watch dont cast correctly this value
            country: 'us',
            terms: true
        });

        // Test validation errors
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'J' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Age'), { target: { value: '17' } });
        fireEvent.change(screen.getByLabelText('Country'), { target: { value: '' } });
        fireEvent.click(screen.getByLabelText('I accept the terms')); // Uncheck

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText('Name too short')).toBeInTheDocument();
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
            expect(screen.getByText('Must be at least 18')).toBeInTheDocument();
            expect(screen.getByText('Please select a country')).toBeInTheDocument();
            expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
        });

        expect(handleSubmit).toHaveBeenCalledTimes(1); // Should not have been called again
    });
});
