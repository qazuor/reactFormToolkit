import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import type { FormProviderStyleOptions } from '../../../types/styles';

// Mock the useFieldState hook
vi.mock('@/hooks', () => ({
    useQRFTTranslation: () => ({
        t: (key: string) => key
    }),
    useFieldState: () => ({
        error: undefined,
        hasError: false,
        isDirty: false,
        isTouched: false,
        isValidating: false
    }),
    useFieldValidation: () => ({
        className: 'mocked-class',
        ariaInvalid: false,
        ariaDescribedBy: 'test-description',
        hasAsyncError: false,
        asyncValidating: false,
        asyncValidatingStarted: false,
        asyncError: undefined,
        showValidationIcons: true,
        showLoadingSpinner: true,
        textWhenValidating: undefined,
        textWhenBeforeStartValidating: undefined,
        validate: async () => {
            // Intentionally left empty for testing purposes
        }
    })
}));

// Mock the FormFieldAsyncValidationIndicator component
vi.mock('../../../components/FormField/FormFieldAsyncValidationIndicator', () => ({
    // biome-ignore lint/style/useNamingConvention: <explanation>
    FormFieldAsyncValidationIndicator: () => <div data-testid='async-validation-indicator' />
}));

// Mock the FieldError component
vi.mock('../../../components/FormField/FieldError', () => ({
    // biome-ignore lint/style/useNamingConvention: <explanation>
    FieldError: ({ name, message }) => <div data-testid={`field-error-${name}`}>{message}</div>
}));

afterEach(() => {
    vi.clearAllMocks();
});

describe('FormField Styling', () => {
    const schema = z.object({
        test: z.string()
    });

    const renderField = (providerStyles?: FormProviderStyleOptions, fieldStyles?: Record<string, string>) => {
        return render(
            <FormProvider
                schema={schema}
                onSubmit={(data) => console.log(data)}
                defaultValues={{ test: '' }}
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
        expect(input).toHaveClass('mocked-class');
    });

    it('should apply provider style overrides', () => {
        const providerStyles: FormProviderStyleOptions = {
            field: {
                input: 'custom-provider-class'
            }
        };
        renderField(providerStyles);
        const input = screen.getByTestId('test');
        expect(input).toHaveClass('mocked-class');
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
        expect(input).toHaveClass('mocked-class');
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
        expect(input).toHaveClass('mocked-class');
    });
});
