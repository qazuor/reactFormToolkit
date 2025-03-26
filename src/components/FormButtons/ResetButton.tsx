import { ResetIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type { ResetButtonProps } from '@/types';
import { useEffect, useRef, useState } from 'react';

export function ResetButton({ children, className, ...props }: ResetButtonProps) {
    const { t } = useQRFTTranslation();
    const { form } = useFormContext();
    const [isEnabled, setIsEnabled] = useState(false);
    const initialValuesRef = useRef<Record<string, unknown>>();

    useEffect(() => {
        // Store initial values when component mounts
        initialValuesRef.current = form.getValues();
    }, [form]);

    useEffect(() => {
        // Subscribe to all fields
        const subscription = form.watch((values) => {
            if (!initialValuesRef.current) {
                return;
            }

            // Compare current values with initial values
            const hasChanges = Object.keys(values).some((key) => {
                return values[key] !== initialValuesRef.current?.[key];
            });

            setIsEnabled(hasChanges);
        });

        return () => subscription.unsubscribe();
    }, [form]);

    return (
        <button
            type='reset'
            disabled={!isEnabled}
            className={cn(
                'relative flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            title={isEnabled ? undefined : t('form.resetDisabledTooltip')}
            {...props}
        >
            <ResetIcon className='h-4 w-4' />
            {children || t('form.reset')}
        </button>
    );
}
