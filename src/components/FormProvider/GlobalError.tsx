import { useFormContext } from '@/context';
import { cn } from '@/lib';
import type { GlobalErrorOptions } from '@/types';
import { useEffect, useState } from 'react';
import { FormErrorIcon } from '../Icons';

interface GlobalErrorProps {
    message: string;
    options?: GlobalErrorOptions;
}

export function GlobalError({ message, options }: GlobalErrorProps) {
    const [visible, setVisible] = useState(true);
    const { styleOptions } = useFormContext();

    useEffect(() => {
        if (options?.autoDismiss && options.dismissAfter && message) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, options.dismissAfter);

            return () => clearTimeout(timer);
        }
    }, [options?.autoDismiss, options?.dismissAfter, message]);

    if (!(message && visible)) {
        return null;
    }

    // Get error style from provider or use default
    const errorClass = styleOptions?.field?.error || 'text-red-700 dark:text-red-400';

    const containerClasses = cn(
        'flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400',
        options?.position === 'bottom' ? 'mt-6' : 'mb-6',
        options?.animation === 'fadeIn' && 'animate-fadeIn',
        options?.animation === 'slideIn' && 'animate-slideIn',
        options?.animation === 'shake' && 'animate-shake',
        errorClass,
        options?.className
    );

    return (
        <div
            className={containerClasses}
            role='alert'
            aria-live='polite'
        >
            <FormErrorIcon className='h-5 w-5 shrink-0 text-red-600 dark:text-red-400' />
            <p className='text-inherit'>{message}</p>
        </div>
    );
}
