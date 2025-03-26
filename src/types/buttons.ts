import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonStyleOptions } from './styles';

/**
 * Props for the FormButtonsBar component
 */
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

/**
 * Props for the SubmitButton component
 */
export interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: string;
    className?: string;
}

/**
 * Props for the ResetButton component
 */
export interface ResetButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string;
    className?: string;
}

/**
 * Props for the CancelButton component
 */
export interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string;
    className?: string;
    onCancel?: () => void;
}
