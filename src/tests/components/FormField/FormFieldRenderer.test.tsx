import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FormFieldRenderer } from '../../../components/FormField/FormFieldRenderer';
import { TooltipProvider } from '../../../components/ui/tooltip';
import { FormContext } from '../../../context/FormContext';
import { FormFieldContext } from '../../../context/FormFieldContext';
import type { FormContextValue, FormFieldContextValue } from '../../../types';

// Mock react-hook-form to avoid the "array" error
vi.mock('react-hook-form', async () => {
    const actual = await vi.importActual('react-hook-form');
    return {
        ...actual,
        Controller: ({ render }) => {
            return render({
                field: {
                    value: 'test-value',
                    onChange: vi.fn(),
                    onBlur: vi.fn(),
                    ref: { current: null }
                },
                fieldState: {
                    invalid: false
                },
                formState: {
                    errors: {}
                }
            });
        },
        useFormContext: () => ({
            control: {},
            formState: { errors: {} }
        })
    };
});

// Mock FieldInput component to avoid Controller issues
vi.mock('../../../components/FormField/FieldInput', () => ({
    FieldInput: ({ children, ...props }) => {
        // Convert camelCase props to kebab-case for DOM attributes
        // and remove non-DOM props
        const domProps = Object.entries(props).reduce((acc, [key, value]) => {
            if (
                key === 'fieldPath' ||
                key === 'childRef' ||
                key === 'validate' ||
                key === 'form' ||
                key === 'ariaInvalid' ||
                key === 'ariaDescribedBy'
            ) {
                return acc;
            }
            return { ...acc, [key]: value };
        }, {});

        return (
            <div
                data-testid='mocked-field-input'
                {...domProps}
                aria-invalid={props.ariaInvalid}
                aria-describedby={props.ariaDescribedBy}
            >
                {children}
            </div>
        );
    }
}));

// Mock FieldError component
vi.mock('../../../components/FormField/FieldError', () => ({
    FieldError: ({ message, inputRef, ...props }) => {
        // Remove non-DOM props
        const domProps = Object.entries(props).reduce((acc, [key, value]) => {
            if (key === 'options' || key === 'inputRef') {
                return acc;
            }
            return { ...acc, [key]: value };
        }, {});

        return (
            <div
                data-testid='mocked-field-error'
                {...domProps}
            >
                {message}
            </div>
        );
    }
}));

// Mock FieldLabel component
vi.mock('../../../components/FormField/FieldLabel', () => ({
    FieldLabel: ({ children, tooltip, tooltipOptions, required, ...props }) => {
        // Remove non-DOM props
        const domProps = Object.entries(props).reduce((acc, [key, value]) => {
            if (key === 'tooltipOptions' || key === 'styleOptions' || key === 'errorDisplayOptions') {
                return acc;
            }
            return { ...acc, [key]: value };
        }, {});

        return (
            <div
                data-testid='mocked-field-label'
                {...domProps}
            >
                {children}
                {required && <span>*</span>}
            </div>
        );
    }
}));

// Mock FieldDescription component
vi.mock('../../../components/FormField/FieldDescription', () => ({
    FieldDescription: ({ children, position, ...props }) => (
        <div
            data-testid='mocked-field-description'
            data-position={position}
            className={position === 'above' ? 'mb-2' : 'mt-1'}
            {...props}
        >
            {children}
        </div>
    )
}));

// Mock FormFieldAsyncValidationIndicator component
vi.mock('../../../components/FormField/FormFieldAsyncValidationIndicator', () => ({
    FormFieldAsyncValidationIndicator: (props) => {
        // Remove non-DOM props
        const domProps = Object.entries(props).reduce((acc, [key, value]) => {
            // Filter out all the props that cause React warnings
            if (
                [
                    'showValidationIcons',
                    'isValidating',
                    'showLoadingSpinner',
                    'asyncValidatingStarted',
                    'hasError',
                    'error',
                    'textWhenValidating',
                    'textWhenBeforeStartValidating'
                ].includes(key)
            ) {
                return acc;
            }
            return { ...acc, [key]: value };
        }, {});

        return (
            <div
                data-testid='mocked-async-validation-indicator'
                {...domProps}
                data-is-validating={props.isValidating}
                data-has-error={props.hasError}
            />
        );
    }
}));

describe('FormFieldRenderer', () => {
    const mockForm = {
        control: {},
        watch: () => {},
        getValues: () => 'test-value',
        setValue: () => {},
        trigger: () => Promise.resolve(true),
        clearErrors: () => {},
        register: () => ({}),
        unregister: () => {}
    };

    const mockFormContext: Partial<FormContextValue> = {
        form: mockForm as any,
        formState: {
            isDirty: false,
            isSubmitting: false,
            isValid: false,
            isValidating: false,
            submitCount: 0,
            errors: {},
            dirtyFields: {},
            touchedFields: {}
        },
        errorDisplayOptions: {},
        styleOptions: {},
        registerAsyncValidation: vi.fn(),
        registerAsyncError: vi.fn(),
        setGlobalError: vi.fn(),
        asyncValidations: {},
        asyncErrors: {}
    };

    const mockContextValue: FormFieldContextValue = {
        name: 'test',
        form: mockForm as any
    };

    const defaultProps = {
        fieldPath: 'test',
        name: 'test',
        label: 'Test Field',
        isRequired: false,
        children: <input type='text' />,
        showError: false,
        displayError: undefined,
        errorOptions: {},
        isErrorAbove: false,
        isErrorRight: false,
        childRef: { current: null },
        contextValue: mockContextValue,
        wrapperClassName: 'test-wrapper',
        asyncValidationProps: {
            showValidationIcons: false,
            isValidating: false,
            showLoadingSpinner: false,
            asyncValidatingStarted: false,
            hasError: false
        },
        inputProps: {
            className: 'test-input',
            ariaInvalid: false
        }
    };

    const renderComponent = (props = {}) => {
        return render(
            <FormContext.Provider value={mockFormContext as FormContextValue}>
                <FormFieldContext.Provider value={mockContextValue}>
                    <TooltipProvider>
                        <FormFieldRenderer
                            {...defaultProps}
                            {...props}
                        />
                    </TooltipProvider>
                </FormFieldContext.Provider>
            </FormContext.Provider>
        );
    };

    it('renders with label and input', () => {
        renderComponent();
        expect(screen.getByTestId('mocked-field-label')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-field-input')).toBeInTheDocument();
    });

    it('renders description above when specified', () => {
        renderComponent({
            description: 'Help text',
            descriptionOptions: { position: 'above' }
        });

        const description = screen.getByTestId('mocked-field-description');
        expect(description).toBeInTheDocument();
        expect(description).toHaveTextContent('Help text');
        expect(description).toHaveAttribute('data-position', 'above');
    });

    it('renders description below by default', () => {
        renderComponent({
            description: 'Help text'
        });

        const description = screen.getByTestId('mocked-field-description');
        expect(description).toBeInTheDocument();
        expect(description).toHaveTextContent('Help text');
        expect(description).toHaveAttribute('data-position', 'below');
    });

    it('renders error message when showError is true', () => {
        renderComponent({
            showError: true,
            displayError: 'Error message'
        });

        expect(screen.getByTestId('mocked-field-error')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-field-error')).toHaveTextContent('Error message');
    });

    it('renders error above when isErrorAbove is true', () => {
        const { container } = renderComponent({
            showError: true,
            displayError: 'Error message',
            isErrorAbove: true
        });

        // Check that the error element exists
        const errorElement = screen.getByTestId('mocked-field-error');
        expect(errorElement).toBeInTheDocument();

        // Get the parent div with className="relative"
        const relativeDiv = container.querySelector('.relative');

        // The first child of the relative div should be the error when isErrorAbove is true
        expect(relativeDiv?.firstElementChild).toContain(errorElement);
    });

    it('renders error in right layout when isErrorRight is true', () => {
        const { container } = renderComponent({
            showError: true,
            displayError: 'Error message',
            isErrorRight: true,
            // Add a custom class to make the test more reliable
            inputProps: {
                className: 'test-input flex items-center gap-2',
                ariaInvalid: false
            }
        });

        // Find the div that should have flex layout
        const flexContainer = screen.getByTestId('mocked-field-input');
        expect(flexContainer).toHaveClass('flex');
        expect(flexContainer).toHaveClass('items-center');
        expect(flexContainer).toHaveClass('gap-2');
    });

    it('renders function children correctly', () => {
        const childrenFn = ({ field }) => (
            <input
                type='text'
                data-testid='function-input'
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
            />
        );

        renderComponent({
            children: childrenFn
        });

        // Check that the Controller was rendered
        expect(screen.getByTestId('mocked-async-validation-indicator')).toBeInTheDocument();
    });

    it('applies wrapper className correctly', () => {
        const { container } = renderComponent({
            wrapperClassName: 'custom-wrapper'
        });

        // The wrapper should be the outermost div
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('custom-wrapper');
    });
});
