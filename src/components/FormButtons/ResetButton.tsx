import { ResetIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type { ButtonHTMLAttributes } from 'react';

interface ResetButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string;
    className?: string;
}

export function ResetButton({ children, className, ...props }: ResetButtonProps) {
    const { t } = useQRFTTranslation();
    const { form } = useFormContext();
    const { isDirty } = form.formState;

    return (
        <button
            type='reset'
            disabled={!isDirty}
            className={cn(
                'relative flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            title={isDirty ? undefined : t('form.resetDisabledTooltip')}
            {...props}
        >
            <ResetIcon className='h-4 w-4' />
            {children || t('form.reset')}
        </button>
    );
}
