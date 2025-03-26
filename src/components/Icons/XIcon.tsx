import { useQRFTTranslation } from '@/hooks';
import type { IconProps } from '@/types';
import type { JSX } from 'react';

/**
 * XIcon component for displaying X icon
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Field error icon component
 */
export function XIcon({ title, className }: IconProps): JSX.Element {
    const { t } = useQRFTTranslation();
    const defaultTitle = t('field.cancel');
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={className}
        >
            <title>{title || defaultTitle}</title>
            <path d='M18 6 6 18' />
            <path d='m6 6 12 12' />
        </svg>
    );
}
