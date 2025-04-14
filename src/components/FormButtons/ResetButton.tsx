import { ResetIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib/utils';
import type { ResetButtonProps } from '@/types';

export function ResetButton({ children, className, ...props }: ResetButtonProps) {
    const { t } = useQRFTTranslation();
    const {
        formState: { isDirty },
        styleOptions
    } = useFormContext();

    // Get button style from provider or use default
    const resetButtonClass =
        styleOptions?.buttons?.reset || 'bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300';

    return (
        <button
            type='reset'
            disabled={!isDirty}
            data-testid='reset-button'
            className={cn(
                'relative flex items-center justify-center gap-2 rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                resetButtonClass,
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
