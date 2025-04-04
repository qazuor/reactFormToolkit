import type { AsyncValidationProps } from '@/types/asyncValidation';
import type React from 'react';
import type { ReactNode } from 'react';
import type { ReactElement, RefObject } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { DescriptionOptions } from './description';
import type { ErrorDisplayOptions, Form } from './form';
import type { ComponentStyleOptions } from './styles';

/**
 * Props for the FieldInput component
 */
export interface FieldInputProps<TFieldValues extends FieldValues = FieldValues> {
    /* Field path in the form data */
    fieldPath: string;

    /* Field name */
    name: string;

    /* Child components */
    children: ReactElement;

    /* Form instance */
    form: Form<TFieldValues>;

    /* Field description */
    description?: string;

    /* Validation function */
    validate?: (value: unknown) => Promise<void>;

    /* Sets the field as touched */
    setTouched?: (touched: boolean) => void;

    /* Ref for the child element */
    childRef?: RefObject<HTMLInputElement>;

    /* Custom CSS class */
    className?: string;

    /* Aria invalid attribute */
    ariaInvalid?: boolean;

    /* Aria described by attribute */
    ariaDescribedBy?: string;
}

/**
 * Tooltip configuration options
 */
export type TooltipOptions = {
    position?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delay?: number;
    className?: string;
    sideOffset?: number;
    hideDelay?: number;
};

/**
 * Props for the FieldLabel component
 */
export interface FieldLabelProps {
    /**
     * HTML for attribute to associate label with input
     */
    htmlFor: string;

    /**
     * Label text content
     */
    children: string;

    /**
     * Whether the field is required
     */
    required?: boolean;

    /**
     * Optional tooltip content
     */
    tooltip?: string;

    /**
     * Optional tooltip configuration options
     */
    tooltipOptions?: TooltipOptions;

    /**
     * Optional style overrides for this field
     */
    styleOptions?: ComponentStyleOptions;

    /**
     * Optional error display configuration that overrides provider options
     */
    errorDisplayOptions?: Partial<ErrorDisplayOptions>;
}

/**
 * Props for the FieldError component
 */
export interface FieldErrorProps {
    /**
     * Field name for error lookup
     */
    name: string;

    /**
     * Optional error message override
     */
    message?: string;

    /**
     * Optional error display configuration
     */
    options?: {
        position?: string;
        animation?: string;
        showIcon?: boolean;
        className?: string;
        iconClassName?: string;
        delay?: number;
        autoDismiss?: boolean;
        dismissAfter?: number;
    };

    /**
     * Reference to the input element for tooltip positioning
     */
    inputRef?: React.RefObject<HTMLElement>;
}

export interface FormFieldContextValue<TFieldValues extends FieldValues = FieldValues> {
    name: keyof TFieldValues & string;
    form: Form<TFieldValues>;
}

export interface FormFieldDescriptionProps {
    /**
     * Description text content
     */
    children: string;
}

export interface FormFieldComposition {
    label: React.FC<FieldLabelProps>;
    description: React.FC<FormFieldDescriptionProps>;
    error: React.FC<FieldErrorProps>;
}

/**
 * Props for the FormField component
 */
export interface FormFieldProps {
    /**
     * Field name, must match the schema property
     */
    name: string;

    /**
     * Optional field label
     */
    label?: string;

    /**
     * Whether the field is required
     * @default false
     */
    required?: boolean;

    /**
     * Field input component or render function
     */
    children:
        | ReactNode
        | ((props: {
              field: {
                  value: any;
                  onChange: (value: any) => void;
                  onBlur: () => void;
              };
              options?: Array<{ value: string; label: string }>;
              isLoading?: boolean;
          }) => ReactNode);

    /**
     * Field description
     */
    description?: string | ReactNode;

    /**
     * Optional description configuration options
     */
    descriptionOptions?: DescriptionOptions;

    /**
     * Optional tooltip text to show on hover
     */
    tooltip?: string;

    /**
     * Optional tooltip configuration options
     */
    tooltipOptions?: TooltipOptions;

    /**
     * Optional style overrides for this field
     */
    styleOptions?: ComponentStyleOptions;

    /**
     * Optional error display configuration that overrides provider options
     */
    errorDisplayOptions?: Partial<ErrorDisplayOptions>;

    /**
     * Optional async validation props
     */
    asyncValidation?: AsyncValidationProps;

    /**
     * Name of the field this field depends on
     */
    dependsOn?: string;

    /**
     * Callback to update options when dependency changes
     */
    dependencyUpdateCallback?: (value: string) => Promise<Array<{ value: string; label: string }>>;
}

export interface FormFieldComponent extends React.FC<FormFieldProps>, FormFieldComposition {}
