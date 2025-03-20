import type { ReactNode } from 'react';

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
