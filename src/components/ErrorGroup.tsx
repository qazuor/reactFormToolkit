import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ErrorGroupProps } from '../types';

/**
 * Component for displaying multiple error messages grouped together.
 */
export function ErrorGroup({
    errors,
    maxErrors = Number.POSITIVE_INFINITY,
    animation = 'fade',
    className = '',
    'data-testid': dataTestId
}: ErrorGroupProps): JSX.Element | null {
    const { t } = useTranslation();

    // If no errors, don't render anything
    const errorEntries = Object.entries(errors);
    if (errorEntries.length === 0) {
        return null;
    }

    // Limit the number of errors to display
    const displayErrors = errorEntries.slice(0, maxErrors);
    const remainingErrors = errorEntries.length - maxErrors;

    // Animation classes
    const animationClasses = {
        fade: 'animate-fadeIn',
        slide: 'animate-slideIn',
        shake: 'animate-shake',
        pulse: 'animate-pulse',
        none: ''
    };

    const animationClass = animationClasses[animation];

    return (
        <div
            className={`mt-2 text-red-600 text-sm ${animationClass} ${className}`}
            role='alert'
            data-testid={dataTestId || 'error-group'}
        >
            <h3 className='mb-2 font-medium text-red-800 text-sm'>
                {t('form.errors', { defaultValue: 'Please correct the following errors:' })}
            </h3>
            <ul className='list-disc space-y-1 pl-5'>
                {displayErrors.map(([field, message]) => (
                    <li
                        key={field}
                        className='text-red-700 text-sm'
                    >
                        <span className='font-medium'>{field}:</span> {message}
                    </li>
                ))}
                {remainingErrors > 0 && (
                    <li className='text-red-700 text-sm'>
                        {t('form.moreErrors', { count: remainingErrors, defaultValue: 'And {{count}} more error(s)' })}
                    </li>
                )}
            </ul>
        </div>
    );
}
