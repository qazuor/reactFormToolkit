import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ConditionalField } from '../../../components/ConditionalField';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

const schema = z.object({
    type: z.enum(['A', 'B']),
    fieldA: z.string().optional(),
    fieldB: z.string().optional()
});

describe('ConditionalField', () => {
    const renderConditionalField = (condition: string | ((value: unknown) => boolean)) => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ type: 'A' }}
                >
                    <FormField name='type'>
                        <select>
                            <option value='A'>Type A</option>
                            <option value='B'>Type B</option>
                        </select>
                    </FormField>

                    <ConditionalField
                        watchField='type'
                        condition={condition}
                    >
                        <FormField name='fieldA'>
                            <input type='text' />
                        </FormField>
                    </ConditionalField>
                </FormProvider>
            </TooltipProvider>
        );
    };

    it('shows content when condition matches', () => {
        renderConditionalField('A');
        expect(screen.getByTestId('fieldA')).toBeInTheDocument();
    });

    it('hides content when condition does not match', () => {
        renderConditionalField('B');
        expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();
    });

    it('supports function conditions', () => {
        renderConditionalField((value) => value === 'A');
        expect(screen.getByTestId('fieldA')).toBeInTheDocument();
    });

    it('updates visibility when watched field changes', async () => {
        renderConditionalField('A');
        const select = screen.getByTestId('type') as HTMLSelectElement;

        expect(screen.getByTestId('fieldA')).toBeInTheDocument();

        await userEvent.selectOptions(select, 'B');

        await waitFor(() => {
            expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();
        });
    });

    it('renders fallback content when condition is not met', () => {
        render(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'B' }}
            >
                <ConditionalField
                    watchField='type'
                    condition='A'
                    fallback={<div data-testid='fallback'>Fallback Content</div>}
                >
                    <FormField name='fieldA'>
                        <input type='text' />
                    </FormField>
                </ConditionalField>
            </FormProvider>
        );

        expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();
        expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('keeps fields registered when keepRegistered is true', async () => {
        const { rerender } = render(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'A', fieldA: 'test' }}
            >
                <ConditionalField
                    watchField='type'
                    condition='A'
                    keepRegistered={true}
                >
                    <FormField name='fieldA'>
                        <input type='text' />
                    </FormField>
                </ConditionalField>
            </FormProvider>
        );

        // Change condition to hide field
        rerender(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'B', fieldA: 'test' }}
            >
                <ConditionalField
                    watchField='type'
                    condition='A'
                    keepRegistered={true}
                >
                    <FormField name='fieldA'>
                        <input type='text' />
                    </FormField>
                </ConditionalField>
            </FormProvider>
        );

        // Field should be hidden but value should be preserved
        expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();

        // Change condition back to show field
        rerender(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'A', fieldA: 'test' }}
            >
                <ConditionalField
                    watchField='type'
                    condition='A'
                    keepRegistered={true}
                >
                    <FormField name='fieldA'>
                        <input type='text' />
                    </FormField>
                </ConditionalField>
            </FormProvider>
        );

        // Field should be visible with preserved value
        const input = screen.getByTestId('fieldA') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('test');
    });
});
