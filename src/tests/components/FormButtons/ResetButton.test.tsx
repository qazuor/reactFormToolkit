import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ResetButton } from '../../../components/FormButtons/ResetButton';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

const schema = z.object({
    test: z.string()
});

const TestWrapper = ({
    children,
    defaultValues = {}
}: { children: ReactNode; defaultValues?: Record<string, unknown> }) => (
    <TooltipProvider>
        <FormProvider
            schema={schema}
            onSubmit={() => Promise.resolve()}
            defaultValues={defaultValues}
        >
            {children}
        </FormProvider>
    </TooltipProvider>
);

describe('ResetButton', () => {
    it('renders with default text', () => {
        render(
            <TestWrapper>
                <ResetButton />
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Reset Form');
    });

    it('renders with custom text', () => {
        render(
            <TestWrapper>
                <ResetButton>Custom Reset</ResetButton>
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Custom Reset');
    });

    it('applies custom className', () => {
        render(
            <TestWrapper>
                <ResetButton className='custom-class' />
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('is disabled initially when form is pristine', () => {
        render(
            <TestWrapper>
                <ResetButton />
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('becomes enabled when form values change', async () => {
        render(
            <TestWrapper defaultValues={{ test: '' }}>
                <FormField name='test'>
                    <input type='text' />
                </FormField>
                <ResetButton />
            </TestWrapper>
        );

        const input = screen.getByTestId('test');
        const button = screen.getByRole('button');

        expect(button).toBeDisabled();

        await userEvent.type(input, 'test');
        await waitFor(() => {
            expect(button).not.toBeDisabled();
        });
    });

    it('resets form to initial values when clicked', async () => {
        render(
            <TestWrapper defaultValues={{ test: 'initial' }}>
                <FormField name='test'>
                    <input type='text' />
                </FormField>
                <ResetButton />
            </TestWrapper>
        );

        const input = screen.getByTestId('test') as HTMLInputElement;
        const button = screen.getByRole('button');

        // Change input value
        await act(async () => {
            fireEvent.input(input, { target: { value: 'changed' } });
            fireEvent.blur(input);
        });
        await waitFor(() => {
            expect(button).not.toBeDisabled();
        });

        // Click reset button
        await userEvent.click(button);
        expect(input.value).toBe('initial');
        expect(button).toBeDisabled();
    });

    it('shows tooltip when disabled', () => {
        render(
            <TestWrapper>
                <ResetButton />
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveAttribute('title', 'No changes to reset');
    });
});
