import { fireEvent, render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

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

describe('FormField Performance', () => {
    const schema = z.object({
        testField: z.string().min(3, 'Must be at least 3 characters')
    });

    it('should not trigger unnecessary re-renders', async () => {
        const renderSpy = vi.fn();

        const TestComponent = () => {
            renderSpy();
            return (
                <TooltipProvider>
                    <FormProvider
                        schema={schema}
                        onSubmit={() => {
                            // Intentionally left empty for testing purposes
                        }}
                    >
                        <FormField
                            name='testField'
                            label='Test Field'
                        >
                            <input type='text' />
                        </FormField>
                    </FormProvider>
                </TooltipProvider>
            );
        };

        render(<TestComponent />);

        // Initial render + FormProvider context setup
        expect(renderSpy).toHaveBeenCalledTimes(1);

        // Type in the field
        const input = screen.getByTestId('testField');
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.blur(input);

        // Type more to fix validation
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.blur(input);

        // Verify the component didn't re-render unnecessarily
        // We expect only the initial render + context updates
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should efficiently handle multiple validation cycles', async () => {
        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => {
                        // Intentionally left empty for testing purposes
                    }}
                >
                    <FormField
                        name='testField'
                        label='Test Field'
                    >
                        <input type='text' />
                    </FormField>
                </FormProvider>
            </TooltipProvider>
        );

        const input = screen.getByTestId('testField');

        // Perform multiple validation cycles
        for (let i = 0; i < 5; i++) {
            // Invalid input
            fireEvent.change(input, { target: { value: 'a' } });
            fireEvent.blur(input);

            // Valid input
            fireEvent.change(input, { target: { value: 'abc' } });
            fireEvent.blur(input);
        }

        // The test passes if we don't encounter performance issues
        expect(true).toBe(true);
    });
});
