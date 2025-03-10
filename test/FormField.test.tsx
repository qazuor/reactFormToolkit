'use client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FormField, FormProvider } from '../src';
import { useFormContext } from '../src/context/FormContext';

const FieldValue = ({ name }: { name: string }) => {
    const { form } = useFormContext();
    const value = form.watch(name);
    return <span data-testid={`${name}-value`}>
        {
            typeof value === 'boolean'
                ? value ? 'true' : 'false'
                : value
        }
    </span>;
};

describe('FormField', () => {
    it('renders input with label and handles changes', async () => {
        render(
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            <FormProvider onSubmit={() => {}}>
                <FormField
                    name='name'
                    label='Name'
                >
                    <input type='text' />
                </FormField>
                <FieldValue name='name' />
            </FormProvider>
        );

        const input = screen.getByLabelText('Name');
        fireEvent.change(input, { target: { value: 'John Doe' } });

        await waitFor(() => {
            expect(screen.getByTestId('name-value')).toHaveTextContent('John Doe');
        });
    });

    it('renders select field correctly', async () => {
        render(
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            <FormProvider onSubmit={() => {}}>
                <FormField
                    name='color'
                    label='Favorite Color'
                >
                    <select>
                        <option value=''>Choose a color</option>
                        <option value='red'>Red</option>
                        <option value='blue'>Blue</option>
                    </select>
                </FormField>
                <FieldValue name='color' />
            </FormProvider>
        );

        const select = screen.getByLabelText('Favorite Color');
        fireEvent.change(select, { target: { value: 'blue' } });

        await waitFor(() => {
            expect(screen.getByTestId('color-value')).toHaveTextContent('blue');
        });
    });

    it('renders checkbox field correctly', async () => {
        render(
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            <FormProvider onSubmit={() => {}}>
                <FormField
                    name='agree'
                    label='I agree to terms'
                >
                    <input type='checkbox' />
                </FormField>
                <FieldValue name='agree' />
            </FormProvider>
        );

        const checkbox = screen.getByLabelText('I agree to terms');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(screen.getByTestId('agree-value')).toHaveTextContent('true');
        });
    });

    it('displays field description', () => {
        render(
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            <FormProvider onSubmit={() => {}}>
                <FormField
                    name='email'
                    label='Email'
                    description='Enter your best email address'
                >
                    <input type='email' />
                </FormField>
            </FormProvider>
        );

        expect(screen.getByText('Enter your best email address')).toBeInTheDocument();
    });

    it('marks required fields', () => {
        render(
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            <FormProvider onSubmit={() => {}}>
                <FormField
                    name='username'
                    label='Username'
                    required={true}
                >
                    <input type='text' />
                </FormField>
            </FormProvider>
        );

        const label = screen.getByText('Username');
        expect(label.textContent).toContain('*');
    });
});
