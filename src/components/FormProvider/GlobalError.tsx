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

    const containerClasses = cn(
        'flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700',
        options?.position === 'bottom' ? 'mt-6' : 'mb-6',
        options?.animation === 'fadeIn' && 'animate-fadeIn',
        options?.animation === 'slideIn' && 'animate-slideIn',
        options?.animation === 'shake' && 'animate-shake',
        options?.className
    );

    return (
        <div
            className={containerClasses}
            role='alert'
            aria-live='polite'
        >
            <FormErrorIcon className='h-5 w-5 shrink-0' />
            <p>{message}</p>
        </div>
    );
}
