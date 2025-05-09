import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { FieldArray } from '../../components/FieldArray/FieldArray';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../components/ui/tooltip';

const schema = z.object({
    items: z
        .array(
            z.object({
                name: z.string().min(2, 'Name must be at least 2 characters'),
                email: z.string().email('Invalid email address')
            })
        )
        .min(1, 'At least one item is required')
});

describe('FieldArray', () => {
    const renderFieldArray = (props = {}) => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={(data) => console.log('Form submitted:', data)}
                    defaultValues={{
                        items: [{ name: '', email: '' }]
                    }}
                >
                    <FieldArray
                        name='items'
                        {...props}
                    >
                        <FormField name='name'>
                            <input type='text' />
                        </FormField>
                        <FormField name='email'>
                            <input type='email' />
                        </FormField>
                    </FieldArray>
                    <button type='submit'>Submit</button>
                </FormProvider>
            </TooltipProvider>
        );
    };

    it('renders initial field array item', () => {
        renderFieldArray();
        expect(screen.getByTestId('items.0.name')).toBeInTheDocument();
        expect(screen.getByTestId('items.0.email')).toBeInTheDocument();
    });

    it('adds new items when clicking add button', async () => {
        renderFieldArray();
        const addButton = screen.getByText('Add New Item');

        await userEvent.click(addButton);

        expect(screen.getByTestId('items.1.name')).toBeInTheDocument();
        expect(screen.getByTestId('items.1.email')).toBeInTheDocument();
    });

    it('removes items when clicking remove button', async () => {
        renderFieldArray();
        const addButton = screen.getByText('Add New Item');

        // Add an item first
        await userEvent.click(addButton);
        expect(screen.getByTestId('items.1.name')).toBeInTheDocument();

        // Remove the second item
        const removeButtons = screen.getAllByText('Remove Item');
        await userEvent.click(removeButtons[1]);

        expect(screen.queryByTestId('items.1.name')).not.toBeInTheDocument();
    });

    it('respects minItems constraint', () => {
        renderFieldArray({ minItems: 2 });
        const addButton = screen.getByText('Add New Item');

        // Add item to reach minItems
        fireEvent.click(addButton);

        // Remove buttons should not be visible when at minItems
        expect(screen.queryByText('Remove')).not.toBeInTheDocument();
    });

    it('respects maxItems constraint', async () => {
        renderFieldArray({ maxItems: 2 });
        const addButton = screen.getByText('Add New Item');

        // Add item to reach maxItems
        await userEvent.click(addButton);

        // Add button should not be visible when at maxItems
        expect(addButton).not.toBeVisible();
    });

    it('validates nested fields correctly', async () => {
        renderFieldArray();

        const nameInput = screen.getByTestId('items.0.name');
        const emailInput = screen.getByTestId('items.0.email');
        const submitButton = screen.getByText('Submit');

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'a' } });
            fireEvent.blur(nameInput);
        });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.blur(emailInput);
        });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(
            () => {
                const errors = screen.getAllByRole('alert');
                expect(errors).toHaveLength(2);
                expect(errors[0]).toHaveTextContent('Name must be at least 2 characters');
                expect(errors[1]).toHaveTextContent('Invalid email address');
            },
            { timeout: 1000 }
        );
    });

    it('supports custom button text', () => {
        renderFieldArray({
            addButtonText: 'Add More',
            removeButtonText: 'Delete'
        });

        expect(screen.getByText('Add More')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('applies custom CSS classes', () => {
        renderFieldArray({
            className: 'custom-container',
            buttonClassName: 'custom-button'
        });

        const container = screen.getByTestId('items.0.name').closest('.custom-container');
        const addButton = screen.getByText('Add New Item');

        expect(container).toHaveClass('custom-container');
        expect(addButton).toHaveClass('custom-button');
    });
});
