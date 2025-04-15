import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { SubmitButton } from '../../../components/FormButtons/SubmitButton';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

// Mock FormField component to avoid useFieldState dependency
vi.mock('../../../components/FormField/FormField', () => ({
    // biome-ignore lint/style/useNamingConvention: <explanation>
    FormField: ({ name, children, _asyncValidation }) => (
        <div data-testid={`form-field-${name}`}>
            {React.cloneElement(children, {
                'data-testid': name,
                onChange: vi.fn(),
                onBlur: vi.fn()
            })}
        </div>
    )
}));

// Mock the useQRFTTranslation hook
vi.mock('@/hooks', () => ({
    useQRFTTranslation: () => ({
        t: (key: string) => {
            if (key === 'form.submitDisabledPendingValidations') {
                return 'Please wait for all validations to complete';
            }
            if (key === 'form.submitDisabledAsyncErrors') {
                return 'Please fix all validation errors before submitting';
            }
            if (key === 'form.isSubmitting') {
                return 'Submitting...';
            }
            return key;
        }
    }),
    useFieldState: () => ({
        error: undefined,
        hasError: false,
        isDirty: false,
        isTouched: false,
        isValidating: false
    })
}));

// Create a mock for FormContext
const mockFormContext = {
    form: {
        watch: vi.fn(),
        control: {},
        getValues: vi.fn(),
        setValue: vi.fn(),
        trigger: vi.fn(),
        clearErrors: vi.fn(),
        register: vi.fn(),
        unregister: vi.fn()
    },
    formState: {
        isDirty: false,
        isSubmitting: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        errors: {},
        dirtyFields: {},
        touchedFields: {}
    },
    styleOptions: {
        buttons: {
            submit: 'mocked-submit-button-class'
        }
    },
    asyncValidations: {},
    asyncErrors: {},
    registerAsyncValidation: vi.fn(),
    registerAsyncError: vi.fn(),
    setGlobalError: vi.fn()
};

// Mock the FormContext
vi.mock('@/context', () => ({
    useFormContext: () => mockFormContext,
    // biome-ignore lint/style/useNamingConvention: <explanation>
    FormContext: {
        // biome-ignore lint/style/useNamingConvention: <explanation>
        Provider: ({ children }) => children
    }
}));

afterEach(() => {
    vi.clearAllMocks();
});

beforeEach(() => {
    // Reset mock state
    mockFormContext.formState.isSubmitting = false;
    mockFormContext.asyncValidations = {};
    mockFormContext.asyncErrors = {};
});

const schema = z.object({
    test: z.string().min(3)
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
    <TooltipProvider>
        <FormProvider
            schema={schema}
            onSubmit={() => Promise.resolve()}
        >
            {children}
        </FormProvider>
    </TooltipProvider>
);

describe('SubmitButton', () => {
    it('renders with default text', () => {
        render(
            <TestWrapper>
                <SubmitButton>Submit</SubmitButton>
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Submit');
    });

    it('applies custom className', () => {
        render(
            <TestWrapper>
                <SubmitButton className='custom-class'>Submit</SubmitButton>
            </TestWrapper>
        );
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('shows loading state when submitting', async () => {
        // Set the form state to submitting
        mockFormContext.formState.isSubmitting = true;

        render(<SubmitButton>Submit</SubmitButton>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', 'Submitting...');
        expect(screen.getByTestId('submit-button').querySelector('svg')).toBeInTheDocument();
    });

    it('is disabled when async validation is pending', async () => {
        // Set async validations to have a pending validation
        mockFormContext.asyncValidations = { test: true };

        render(<SubmitButton>Submit</SubmitButton>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', 'Please wait for all validations to complete');
    });

    it('is disabled when there are async errors', async () => {
        // Set async errors to have an error
        mockFormContext.asyncErrors = { test: true };

        render(<SubmitButton>Submit</SubmitButton>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', 'Please fix all validation errors before submitting');
    });
});
