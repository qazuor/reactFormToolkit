import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import { type JSX, useCallback, useEffect, useState } from 'react';

interface GroupedErrorsProps {
    errors: Record<string, string>;
    maxErrors?: number;
    className?: string;
    animation?: string;
    delay?: number;
    autoDismiss?: boolean;
    dismissAfter?: number;
}

export function GroupedErrors({
    errors,
    maxErrors,
    className,
    animation = 'fadeIn',
    autoDismiss = false,
    dismissAfter = 5000
}: GroupedErrorsProps): JSX.Element | null {
    const { t } = useQRFTTranslation();
    const [dismissed, setDismissed] = useState(false);

    const errorEntries = Object.entries(errors || {});
    const shouldShowErrors = errorEntries.length > 0 && !dismissed;
    const shouldLimitErrors = maxErrors && maxErrors > 0;
    const displayErrors = shouldLimitErrors && maxErrors > 0 ? errorEntries.slice(0, maxErrors) : errorEntries;
    const remainingErrors = shouldLimitErrors ? errorEntries.length - maxErrors : 0;

    const resetState = useCallback(() => {
        setDismissed(false);
    }, []);

    useEffect(() => {
        if (errorEntries.length === 0) {
            resetState();
            return;
        }
    }, [errorEntries.length, resetState]);

    useEffect(() => {
        if (errorEntries.length === 0 || !autoDismiss) {
            return;
        }

        const dismissTimeout = setTimeout(() => {
            setDismissed(true);
        }, dismissAfter);

        return () => clearTimeout(dismissTimeout);
    }, [errorEntries.length, autoDismiss, dismissAfter]);

    if (!shouldShowErrors) {
        return null;
    }

    return (
        <div
            className={cn(`mt-4 rounded-lg border border-red-200 bg-red-50 p-4 animate-${animation}`, className)}
            data-testid='grouped-errors'
            aria-live='polite'
        >
            <h3 className='mb-2 font-medium text-red-800'>{t('form.validationErrors')}</h3>
            <ul
                className='list-inside list-disc space-y-2'
                data-testid='error-list'
            >
                {displayErrors.map(([field, message]) => (
                    <li
                        key={field}
                        className='text-red-600 text-sm'
                        data-testid='error-item'
                        aria-label={`${field}: ${message}`}
                    >
                        <span className='font-medium'>{field}:</span> {message}
                    </li>
                ))}
            </ul>
            {remainingErrors > 0 && (
                <p
                    className='mt-2 text-red-500 text-sm italic'
                    data-testid='remaining-errors'
                    aria-label={t('form.remainingErrors', { count: remainingErrors })}
                >
                    {t('form.remainingErrors', { count: remainingErrors })}
                </p>
            )}
        </div>
    );
}
