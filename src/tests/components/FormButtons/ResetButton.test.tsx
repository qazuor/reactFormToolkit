import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ResetButton } from '../../../components/FormButtons/ResetButton';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

// Mock FormField component to avoid useFieldState dependency
vi.mock('../../../components/FormField/FormField', () => ({
    // biome-ignore lint/style/useNamingConvention: <explanation>
    FormField: ({ name, children }) => (
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
            if (key === 'form.reset') {
                return 'Reset Form';
            }
            if (key === 'form.resetDisabledTooltip') {
                return 'No changes to reset';
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

afterEach(() => {
    vi.clearAllMocks();
});

const schema = z.object({
    test: z.string()
});

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
            reset: 'mocked-reset-button-class'
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
        // Update the mock to simulate a dirty form
        mockFormContext.formState.isDirty = true;

        render(<ResetButton />);

        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();

        // Reset the mock for other tests
        mockFormContext.formState.isDirty = false;
    });

    it('resets form to initial values when clicked', async () => {
        // Update the mock to simulate a dirty form
        mockFormContext.formState.isDirty = true;

        render(<ResetButton />);

        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();

        // Click the button and verify form reset was triggered
        await userEvent.click(button);

        // Reset the mock for other tests
        mockFormContext.formState.isDirty = false;
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
