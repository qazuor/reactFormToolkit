import { XIcon } from '@/components/Icons';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string;
    className?: string;
    onCancel?: () => void;
}

export function CancelButton({ children, className, onCancel, ...props }: CancelButtonProps) {
    const { t } = useQRFTTranslation();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onCancel?.();
    };

    return (
        <button
            type='button'
            onClick={handleClick}
            className={cn(
                'flex items-center justify-center gap-2 rounded-md bg-red-100 px-4 py-2 text-red-700 transition-colors hover:bg-red-200',
                className
            )}
            {...props}
        >
            <XIcon className='h-4 w-4' />
            {children || t('form.cancel')}
        </button>
    );
}
