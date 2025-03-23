import type React from 'react';
import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { DescriptionOptions } from './description';
import type { ErrorDisplayOptions } from './form';
import type { ComponentStyleOptions } from './styles';

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
}

export interface FormFieldContextValue<TFieldValues extends FieldValues = FieldValues> {
    name: keyof TFieldValues & string;
    form: UseFormReturn<TFieldValues>;
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
     * Field input component
     */
    children: ReactNode;

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
}

export interface FormFieldComponent extends React.FC<FormFieldProps>, FormFieldComposition {}
