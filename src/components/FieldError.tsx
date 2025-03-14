import { type JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ErrorAnimation, ErrorPosition, FieldErrorProps } from '../types';

/**
 * Component for displaying field validation errors with customizable styling and positioning.
 */
export function FieldError({
    name,
    errorMessage,
    showError,
    errorDisplay,
    className = '',
    isGrouped = false
}: FieldErrorProps): JSX.Element | null {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [animationKey, setAnimationKey] = useState(0); // Add a key to force animation re-render

    // Default error display configuration
    const position: ErrorPosition = errorDisplay?.position || 'bottom';
    const animation: ErrorAnimation = errorDisplay?.animation || 'fade';
    const delay = errorDisplay?.delay || 0;
    const showIcon = errorDisplay?.showIcon !== false;
    const autoDismiss = errorDisplay?.autoDismiss;
    const dismissAfter = errorDisplay?.dismissAfter || 5000;

    // Handle delayed appearance
    useEffect(() => {
        if (!(errorMessage && showError)) {
            setVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            // Increment animation key to force re-render and restart animation
            setAnimationKey((prev) => prev + 1);
            setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [errorMessage, showError, delay]);

    // Handle auto-dismiss
    useEffect(() => {
        if (!(autoDismiss && visible && errorMessage)) {
            return;
        }

        const timer = setTimeout(() => {
            setVisible(false);
        }, dismissAfter);

        return () => clearTimeout(timer);
    }, [autoDismiss, dismissAfter, visible, errorMessage]);

    // If no error or error is grouped, don't render
    if (!(errorMessage && showError) || isGrouped || !visible) {
        return null;
    }

    // Position-specific classes for error messages
    const positionClasses = {
        bottom: 'mt-1',
        top: 'mb-1',
        right: 'ml-2 inline-block',
        tooltip: 'absolute z-10 p-2 bg-red-50 border border-red-200 rounded shadow-sm'
    };

    // Animation classes for error messages
    const animationClasses = {
        fade: 'animate-fadeIn',
        slide: 'animate-slideIn',
        shake: 'animate-shake',
        pulse: 'animate-pulse',
        none: ''
    };

    // Tooltip position classes
    const tooltipPositionClasses = {
        tooltip: 'top-full left-0 mt-1 group-hover:block hidden' // Show on hover for tooltip position
    };

    // Base classes for the error container
    const baseClasses = 'text-sm text-red-600';
    const positionClass = positionClasses[position as keyof typeof positionClasses];
    const animationClass = animationClasses[animation];
    const tooltipClass = position === 'tooltip' ? tooltipPositionClasses[position] : '';

    // Combine all classes
    const errorClasses = `
        ${baseClasses}
        ${positionClass}
        ${animationClass}
        ${tooltipClass}
        ${className}
    `.trim();

    return (
        <div
            key={animationKey} // Add key to force animation re-render
            className={errorClasses}
            role='alert'
            data-testid={`${name}-error`}
            data-animation={animation} // Add data attribute for testing
        >
            <div className='flex items-center'>
                {showIcon && (
                    <span className='mr-1 text-red-500'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='14'
                            height='14'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <title>{t('field.error', { defaultValue: 'Error' })}</title>
                            <circle
                                cx='12'
                                cy='12'
                                r='10'
                            />
                            <line
                                x1='12'
                                y1='8'
                                x2='12'
                                y2='12'
                            />
                            <line
                                x1='12'
                                y1='16'
                                x2='12.01'
                                y2='16'
                            />
                        </svg>
                    </span>
                )}
                <span>{errorMessage}</span>
            </div>
        </div>
    );
}
