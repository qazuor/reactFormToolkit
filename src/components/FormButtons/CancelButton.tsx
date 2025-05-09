import { XIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CancelButtonProps } from '@/types';
import type React from 'react';

export function CancelButton({ children, className, onCancel, ...props }: CancelButtonProps) {
    const { t } = useQRFTTranslation();
    const { styleOptions } = useFormContext();

    // Get button style from provider or use default
    const cancelButtonClass =
        styleOptions?.buttons?.cancel || 'bg-red-100 px-4 py-2 rounded-md text-red-700 hover:bg-red-200';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onCancel?.();
    };

    return (
        <button
            type='button'
            onClick={handleClick}
            data-testid='cancel-button'
            className={cn(
                'flex items-center justify-center gap-2 rounded-md transition-colors',
                cancelButtonClass,
                className
            )}
            {...props}
        >
            <XIcon className='h-4 w-4' />
            {children || t('form.cancel')}
        </button>
    );
}
