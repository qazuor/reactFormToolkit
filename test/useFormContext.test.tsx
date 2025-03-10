'use client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FormProvider } from '../src';
import { useFormContext } from '../src/context/FormContext';

describe('useFormContext', () => {
    it('provides form context to child components', async () => {
        const TestComponent = () => {
            const { form } = useFormContext();
            return (
                <button
                    type='button'
                    onClick={() => form.setValue('test', 'value')}
                >
                    Set Value
                </button>
            );
        };

        const FieldValue = ({ name }: { name: string }) => {
            const { form } = useFormContext();
            const value = form.watch(name);
            return <span data-testid={`${name}-value`}>{value}</span>;
        };

        render(
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            <FormProvider onSubmit={() => {}}>
                <TestComponent />
                <FieldValue name='test' />
            </FormProvider>
        );

        fireEvent.click(screen.getByText('Set Value'));

        await waitFor(() => {
            expect(screen.getByTestId('test-value')).toHaveTextContent('value');
        });
    });

    it('throws error when used outside FormProvider', () => {
        const TestComponent = () => {
            useFormContext();
            return null;
        };

        expect(() => render(<TestComponent />)).toThrow('useFormContext must be used within a FormProvider');
    });
});
