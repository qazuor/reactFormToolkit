/**
 * Defines the possible positions for displaying error messages.
 */
export type ErrorPosition = 'bottom' | 'right' | 'top' | 'left' | 'tooltip' | 'inline';

/**
 * Defines the possible animation types for error messages.
 */
export type ErrorAnimation = 'fade' | 'slide' | 'shake' | 'pulse' | 'none';

/**
 * Configuration options for error message display.
 */
export interface ErrorDisplayOptions {
    /**
     * Position of the error message relative to the input field.
     * @default 'bottom'
     */
    position?: ErrorPosition;

    /**
     * Animation effect when displaying the error message.
     * @default 'fade'
     */
    animation?: ErrorAnimation;

    /**
     * Delay in milliseconds before showing the error message.
     * @default 0
     */
    delay?: number;

    /**
     * Whether to show an icon with the error message.
     * @default true
     */
    showIcon?: boolean;

    /**
     * Custom CSS class for the error message container.
     */
    className?: string;

    /**
     * Custom CSS class for the error icon.
     */
    iconClassName?: string;

    /**
     * Whether to group all errors in one location.
     * @default false
     */
    groupErrors?: boolean;

    /**
     * Maximum number of errors to display when grouping.
     * @default 3
     */
    maxErrors?: number;

    /**
     * Whether to automatically dismiss the error after a period.
     * @default false
     */
    autoDismiss?: boolean;

    /**
     * Time in milliseconds after which to dismiss the error.
     * @default 5000
     */
    dismissAfter?: number;
}

/**
 * Configuration for global error display at the form level.
 * Extends ErrorDisplayOptions with additional properties specific to form-level error handling.
 */
export interface GlobalErrorDisplayConfig extends ErrorDisplayOptions {
    /**
     * Whether global error display settings should override field-specific settings.
     * When true, field-level error display settings will be ignored in favor of global settings.
     * @default false
     */
    overrideFieldSettings?: boolean;

    /**
     * Whether to show a summary of all errors at the form level.
     * @default false
     */
    showSummary?: boolean;

    /**
     * Position of the error summary relative to the form.
     * @default 'top'
     */
    summaryPosition?: 'top' | 'bottom';

    /**
     * Custom CSS class for the error summary container.
     */
    summaryClassName?: string;

    /**
     * Custom title for the error summary.
     * @default 'Please correct the following errors:'
     */
    summaryTitle?: string;

    /**
     * Whether to scroll to the first error when form validation fails.
     * @default false
     */
    scrollToError?: boolean;

    /**
     * Offset in pixels when scrolling to an error.
     * @default 100
     */
    scrollOffset?: number;

    /**
     * Behavior for scrolling to errors.
     * @default 'smooth'
     */
    scrollBehavior?: 'auto' | 'smooth';
}

/**
 * Default error display options.
 */
export const defaultErrorDisplayOptions: ErrorDisplayOptions = {
    position: 'bottom',
    animation: 'fade',
    delay: 0,
    showIcon: true,
    groupErrors: false,
    maxErrors: 3,
    autoDismiss: false,
    dismissAfter: 5000
};

/**
 * Props for the FieldError component.
 */
export interface FieldErrorProps {
    /**
     * The name of the field this error is associated with
     */
    name: string;

    /**
     * The error message to display
     */
    errorMessage?: string;

    /**
     * Whether to show the error message
     */
    showError: boolean;

    /**
     * Error display configuration
     */
    errorDisplay?: ErrorDisplayOptions;

    /**
     * Custom CSS class for the error message
     */
    className?: string;

    /**
     * Whether the error is part of a grouped error display
     */
    isGrouped?: boolean;

    'data-testid'?: string;
}

/**
 * Props for the ErrorGroup component.
 */
export interface ErrorGroupProps {
    /**
     * Map of field names to error messages.
     */
    errors: Record<string, string>;

    /**
     * Custom display options for the error group.
     */
    errorDisplay?: ErrorDisplayOptions;

    /**
     * Maximum number of errors to display.
     */
    maxErrors?: number;

    /**
     * Animation effect for the error group.
     */
    animation?: 'fade' | 'slide' | 'shake' | 'pulse' | 'none';

    /**
     * CSS class for the error group container.
     */
    className?: string;

    /**
     * HTML data-testid attribute for testing.
     */
    'data-testid'?: string;
}
