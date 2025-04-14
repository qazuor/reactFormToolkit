import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ConditionalFieldGroup } from '../../../components/ConditionalField';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

const schema = z.object({
    type: z.enum(['valueA', 'valueB', 'valueC']),
    fieldA: z.string().optional(),
    fieldB: z.string().optional(),
    fieldC: z.string().optional()
});

describe('ConditionalFieldGroup', () => {
    const renderConditionalFieldGroup = (initialType = 'valueA', customClass = '') => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ type: initialType }}
                >
                    <FormField name='type'>
                        <select>
                            <option value='valueA'>Type A</option>
                            <option value='valueB'>Type B</option>
                            <option value='valueC'>Type C</option>
                        </select>
                    </FormField>

                    <ConditionalFieldGroup
                        watchField='type'
                        className={customClass || ''}
                        conditions={{
                            valueA: (
                                <FormField name='fieldA'>
                                    <input type='text' />
                                </FormField>
                            ),
                            valueB: (
                                <FormField name='fieldB'>
                                    <input type='text' />
                                </FormField>
                            )
                        }}
                        fallback={
                            <FormField name='fieldC'>
                                <input type='text' />
                            </FormField>
                        }
                    />
                </FormProvider>
            </TooltipProvider>
        );
    };

    it('renders correct field based on condition', () => {
        renderConditionalFieldGroup('valueA');
        expect(screen.getByTestId('fieldA')).toBeInTheDocument();
        expect(screen.queryByTestId('fieldB')).not.toBeInTheDocument();
        expect(screen.queryByTestId('fieldC')).not.toBeInTheDocument();
    });

    it('updates fields when condition changes', async () => {
        renderConditionalFieldGroup('valueA');
        const select = screen.getByTestId('type') as HTMLSelectElement;

        await userEvent.selectOptions(select, 'valueB');

        await waitFor(() => {
            expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();
            expect(screen.getByTestId('fieldB')).toBeInTheDocument();
        });
    });

    it('renders fallback when no condition matches', async () => {
        renderConditionalFieldGroup('valueC');
        expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();
        expect(screen.queryByTestId('fieldB')).not.toBeInTheDocument();
        expect(screen.getByTestId('fieldC')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        renderConditionalFieldGroup('valueA', 'custom-class');
        const inputA = screen.getByTestId('fieldA') as HTMLInputElement;
        const parentConditionalFieldGroup =
            inputA.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
        expect(parentConditionalFieldGroup).toHaveClass('custom-class');
    });

    it('keeps fields registered when keepRegistered is true', async () => {
        const { rerender } = render(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'valueA', fieldA: 'test-a', fieldB: 'test-b' }}
            >
                <ConditionalFieldGroup
                    watchField='type'
                    conditions={{
                        valueA: (
                            <FormField name='fieldA'>
                                <input type='text' />
                            </FormField>
                        ),
                        valueB: (
                            <FormField name='fieldB'>
                                <input type='text' />
                            </FormField>
                        )
                    }}
                    keepRegistered={true}
                />
            </FormProvider>
        );

        // Initial field A should be visible with value
        const inputA = screen.getByTestId('fieldA') as HTMLInputElement;
        expect(inputA.value).toBe('test-a');

        // Change to type B
        rerender(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'valueB', fieldA: 'test-a', fieldB: 'test-b' }}
            >
                <ConditionalFieldGroup
                    watchField='type'
                    conditions={{
                        valueA: (
                            <FormField name='fieldA'>
                                <input type='text' />
                            </FormField>
                        ),
                        valueB: (
                            <FormField name='fieldB'>
                                <input type='text' />
                            </FormField>
                        )
                    }}
                    keepRegistered={true}
                />
            </FormProvider>
        );

        // Field B should be visible with value, A should be hidden
        expect(screen.queryByTestId('fieldA')).not.toBeInTheDocument();
        const inputB = screen.getByTestId('fieldB') as HTMLInputElement;
        expect(inputB.value).toBe('test-b');

        // Change back to type A
        rerender(
            <FormProvider
                schema={schema}
                onSubmit={() => Promise.resolve()}
                defaultValues={{ type: 'valueA', fieldA: 'test-a', fieldB: 'test-b' }}
            >
                <ConditionalFieldGroup
                    watchField='type'
                    conditions={{
                        valueA: (
                            <FormField name='fieldA'>
                                <input type='text' />
                            </FormField>
                        ),
                        valueB: (
                            <FormField name='fieldB'>
                                <input type='text' />
                            </FormField>
                        )
                    }}
                    keepRegistered={true}
                />
            </FormProvider>
        );

        // Field A should be visible again with preserved value
        const inputAAgain = screen.getByTestId('fieldA') as HTMLInputElement;
        expect(inputAAgain.value).toBe('test-a');
    });
});
