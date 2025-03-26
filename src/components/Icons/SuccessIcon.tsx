import { useQRFTTranslation } from '@/hooks';
import type { IconProps } from '@/types';
import type { JSX } from 'react';

/**
 * SuccessIcon component for displaying success states
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Success icon component
 */
export function SuccessIcon({ title, className }: IconProps): JSX.Element {
    const { t } = useQRFTTranslation();
    const defaultTitle = t('form.success');

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={className}
        >
            <title>{title || defaultTitle}</title>
            <circle
                cx='12'
                cy='12'
                r='10'
            />
            <path d='M8 12l3 3 5-5' />
        </svg>
    );
}
