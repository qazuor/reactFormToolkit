import { useQRFTTranslation } from '@/hooks';
import type { IconProps } from '@/types';
import type { JSX } from 'react';

/**
 * LoadingIcon component for displaying loading states
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Loading icon component
 */
export function LoadingIcon({ title, className }: IconProps): JSX.Element {
    const { t } = useQRFTTranslation();
    const defaultTitle = t('form.loading');

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
            className={`animate-spin ${className || ''}`}
        >
            <title>{title || defaultTitle}</title>
            <line
                x1='12'
                y1='2'
                x2='12'
                y2='6'
            />
            <line
                x1='12'
                y1='18'
                x2='12'
                y2='22'
            />
            <line
                x1='4.93'
                y1='4.93'
                x2='7.76'
                y2='7.76'
            />
            <line
                x1='16.24'
                y1='16.24'
                x2='19.07'
                y2='19.07'
            />
            <line
                x1='2'
                y1='12'
                x2='6'
                y2='12'
            />
            <line
                x1='18'
                y1='12'
                x2='22'
                y2='12'
            />
            <line
                x1='4.93'
                y1='19.07'
                x2='7.76'
                y2='16.24'
            />
            <line
                x1='16.24'
                y1='7.76'
                x2='19.07'
                y2='4.93'
            />
        </svg>
    );
}
