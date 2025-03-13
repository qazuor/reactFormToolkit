import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../context/FormContext';
import type { FormErrorProps } from '../types';

/**
 * FormError component for displaying global form errors.
 *
 * This component displays form-wide error messages that aren't tied to a specific field.
 * It's particularly useful for showing server-side validation errors, API response errors,
 * network issues, or any other errors that affect the entire form.
 *
 * @param props - The component props
 * @returns JSX element or null if no error is present
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FormProvider onSubmit={handleSubmit}>\
 *   // Form fields
 *   <FormError />
 *   <button type = "submit">Submit</button>
 * </FormProvider>
 *
 * // With custom styling
 * <FormError
 *   className="p-3 bg-red-50 border border-red-200 rounded-md"
 *   showIcon={true}
 * />
 *
 * // With explicit error message
 * <FormError error="Custom error message" />
 * ```
 */
export function FormError({
    className,
    showIcon = true,
    error,
    'data-testid': dataTestId
}: FormErrorProps): JSX.Element | null {
    const { t } = useTranslation();
    const { globalError, styles } = useFormContext();

    // Use provided error or global error
    const errorMessage = error || globalError;

    // If no error, don't render anything
    if (!errorMessage) {
        return null;
    }

    // Default error styles
    const defaultErrorClass = styles.error || 'mt-2 text-sm text-red-600 animate-fadeIn';

    return (
        <div
            className={`${defaultErrorClass} ${className || ''}`}
            role='alert'
            data-testid={dataTestId}
        >
            <div className='flex items-center'>
                {showIcon && (
                    <span className='mr-2 text-red-500'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <title>{t('form.error', { defaultValue: 'Error' })}</title>
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
