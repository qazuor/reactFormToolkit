import type { ReactNode } from 'react';

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
     * Optional tooltip text
     */
    tooltip?: string;
}

/**
 * Props for the FieldInput component
 */
export interface FieldInputProps {
    /**
     * Field identifier
     */
    id: string;

    /**
     * Whether the field has an error
     */
    hasError?: boolean;

    /**
     * Whether the field is disabled
     */
    disabled?: boolean;

    /**
     * Child input element
     */
    children: ReactNode;

    /**
     * Description for accessibility
     */
    description?: string;
}

/**
 * Props for the FieldError component
 */
export interface FieldErrorProps {
    /**
     * Error message to display
     */
    message?: string;
}
