import { ValidationStatusIcon } from '@/components/Icons';
import type { JSX } from 'react';
import { memo } from 'react';

/**
 * Props for the FormFieldAsyncValidationRenderer component
 */
interface FormFieldAsyncValidationRendererProps {
    /**
     * Current validation state
     */
    state: 'validating' | 'idle' | 'valid' | 'invalid';

    /**
     * Text to display during validation
     */
    textWhenValidating?: string;

    /**
     * Whether to show loading spinner
     */
    showLoadingSpinner: boolean;

    /**
     * Whether to show validation icons
     */
    showValidationIcons: boolean;

    /**
     * Whether there is an error
     */
    hasError: boolean;

    /**
     * Error message
     */
    error?: string;

    /**
     * Whether validation is in progress
     */
    isValidating: boolean;

    /**
     * Text to display before validation starts
     */
    textWhenBeforeStartValidating?: string;
}

/**
 * FormFieldAsyncValidationRenderer component for rendering async validation UI
 * This component handles only the rendering logic, separated from state management
 *
 * @param {FormFieldAsyncValidationRendererProps} props - Component props
 * @returns {JSX.Element} Rendered async validation indicator
 *
 * @example
 * ```tsx
 * <FormFieldAsyncValidationRenderer
 *   state="validating"
 *   textWhenValidating="Checking..."
 *   showLoadingSpinner={true}
 *   showValidationIcons={true}
 *   hasError={false}
 * />
 * ```
 */
export const FormFieldAsyncValidationRenderer = memo(function FormFieldAsyncValidationRenderer({
    state,
    textWhenValidating,
    showLoadingSpinner,
    showValidationIcons,
    hasError,
    error,
    isValidating,
    textWhenBeforeStartValidating
}: FormFieldAsyncValidationRendererProps): JSX.Element {
    const baseClasses = 'items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3';

    if (state === 'validating') {
        return (
            <div
                className={baseClasses}
                aria-hidden='true'
                data-testid='invalid-indicator-validating'
            >
                {textWhenValidating && <span className='mr-2 text-blue-400 text-xs'>{textWhenValidating}</span>}
                {showLoadingSpinner && <ValidationStatusIcon status='loading' />}
            </div>
        );
    }

    if (state === 'valid') {
        return (
            <div
                className={baseClasses}
                aria-hidden='true'
                data-testid='invalid-indicator-valid'
            >
                {showValidationIcons && <ValidationStatusIcon status='success' />}
            </div>
        );
    }

    if (state === 'invalid') {
        return (
            <div
                className={baseClasses}
                aria-hidden='true'
                data-testid='invalid-indicator-invalid'
            >
                {!isValidating && hasError && <span className='mr-2 text-red-500 text-xs'>{error}</span>}
                {showValidationIcons && <ValidationStatusIcon status='error' />}
            </div>
        );
    }

    // idle
    return (
        <div
            className={baseClasses}
            aria-hidden='true'
            data-testid='invalid-indicator-idle'
        >
            {textWhenBeforeStartValidating && !hasError && (
                <span className='mr-2 text-gray-400 text-xs'>{textWhenBeforeStartValidating}</span>
            )}
        </div>
    );
});
