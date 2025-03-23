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
    delay = 0,
    autoDismiss = false,
    dismissAfter = 5000
}: GroupedErrorsProps): JSX.Element | null {
    const { t } = useQRFTTranslation();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const errorEntries = Object.entries(errors || {});
    const shouldShowErrors = errorEntries.length > 0 && visible && !dismissed;
    const shouldLimitErrors = maxErrors && maxErrors > 0;
    const displayErrors = shouldLimitErrors ? errorEntries.slice(0, maxErrors) : errorEntries;
    const remainingErrors = shouldLimitErrors ? errorEntries.length - maxErrors : 0;

    const resetState = useCallback(() => {
        setVisible(false);
        setDismissed(false);
    }, []);

    useEffect(() => {
        if (errorEntries.length === 0) {
            resetState();
            return;
        }

        const showTimeout = setTimeout(() => {
            setVisible(true);
        }, delay);

        return () => clearTimeout(showTimeout);
    }, [errorEntries.length, delay, resetState]);

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
            role='alert'
        >
            <h3 className='mb-2 font-medium text-red-800'>{t('form.validationErrors')}</h3>
            <ul className='list-inside list-disc space-y-2'>
                {displayErrors.map(([field, message]) => (
                    <li
                        key={field}
                        className='text-red-600 text-sm'
                    >
                        <span className='font-medium'>{field}:</span> {message}
                    </li>
                ))}
                {remainingErrors > 0 && (
                    <li className='text-red-500 text-sm italic'>
                        {t('form.viewMoreErrors', { count: errorEntries.length - (maxErrors || 0) })}
                    </li>
                )}
            </ul>
        </div>
    );
}
