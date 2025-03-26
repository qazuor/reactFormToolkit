import type { ReactNode } from 'react';

export interface ButtonStyleOptions {
    submit?: string;
    reset?: string;
    cancel?: string;
}

export interface FormButtonsBarProps {
    /**
     * Direction of the buttons layout
     * @default 'horizontal'
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * Whether buttons should take full width
     * @default false
     */
    fullWidth?: boolean;

    /**
     * Custom CSS classes for the container
     */
    className?: string;

    /**
     * Custom CSS classes for the buttons
     */
    buttonStyles?: ButtonStyleOptions;

    /**
     * Show submit button
     * @default true
     */
    showSubmit?: boolean;

    /**
     * Show reset button
     * @default true
     */
    showReset?: boolean;

    /**
     * Show cancel button
     * @default true
     */
    showCancel?: boolean;

    /**
     * Submit button text
     */
    submitText?: string;

    /**
     * Reset button text
     */
    resetText?: string;

    /**
     * Cancel button text
     */
    cancelText?: string;

    /**
     * Cancel handler
     */
    onCancel?: () => void;

    /**
     * Additional buttons to render
     */
    children?: ReactNode;
}
