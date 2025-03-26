import { useQRFTTranslation } from '@/hooks';
import type { IconProps } from '@/types';
import type { JSX } from 'react';

/**
 * InfoTooltipIcon component for displaying information tooltips
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Info tooltip icon component
 */
export function InfoTooltipIcon({ title, className }: IconProps): JSX.Element {
    const { t } = useQRFTTranslation();
    const defaultTitle = t('field.info');

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
            <title aria-label={title || defaultTitle}> </title>
            <circle
                cx='12'
                cy='12'
                r='10'
            />
            <line
                x1='12'
                y1='16'
                x2='12'
                y2='12'
            />
            <line
                x1='12'
                y1='8'
                x2='12.01'
                y2='8'
            />
        </svg>
    );
}
