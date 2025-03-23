import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import type { FormProviderStyleOptions } from '../../types/styles';

describe('FormField Styling', () => {
    const schema = z.object({
        test: z.string()
    });

    const renderField = (providerStyles?: FormProviderStyleOptions, fieldStyles?: Record<string, string>) => {
        return render(
            <FormProvider
                schema={schema}
                onSubmit={(data) => console.log(data)}
                styleOptions={providerStyles}
            >
                <FormField
                    name='test'
                    label='Test Field'
                    styleOptions={fieldStyles}
                >
                    <input type='text' />
                </FormField>
            </FormProvider>
        );
    };

    it('should apply default styles', () => {
        renderField();
        const input = screen.getByTestId('test');
        expect(input).toHaveClass('block', 'w-full', 'rounded-md');
    });

    it('should apply provider style overrides', () => {
        const providerStyles: FormProviderStyleOptions = {
            field: {
                input: 'custom-provider-class'
            }
        };
        renderField(providerStyles);
        const input = screen.getByTestId('test');
        expect(input).toHaveClass('custom-provider-class');
    });

    it('should apply component style overrides', () => {
        const providerStyles: FormProviderStyleOptions = {
            field: {
                input: 'provider-class'
            }
        };
        const fieldStyles = {
            input: 'component-class'
        };
        renderField(providerStyles, fieldStyles);
        const input = screen.getByTestId('test');
        expect(input).toHaveClass('component-class');
    });

    it('should handle validation states with custom styles', () => {
        const providerStyles: FormProviderStyleOptions = {
            field: {
                isValid: 'custom-valid',
                isInvalid: 'custom-invalid'
            }
        };
        renderField(providerStyles);
        const input = screen.getByTestId('test');
        expect(input).toHaveClass('custom-valid');
    });
});
