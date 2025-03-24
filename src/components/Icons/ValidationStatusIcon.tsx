import { useQRFTTranslation } from '@/hooks';
import type { IconProps } from '@/types';
import type { JSX } from 'react';

interface ValidationStatusIconProps extends IconProps {
    status: 'success' | 'error' | 'loading';
}

/**
 * ValidationStatusIcon component for displaying field validation status
 * @param {ValidationStatusIconProps} props - Component props
 * @returns {JSX.Element} Validation status icon component
 */
export function ValidationStatusIcon({ status, className }: ValidationStatusIconProps): JSX.Element {
    const { t } = useQRFTTranslation();

    if (status === 'loading') {
        return (
            <svg
                className={`h-4 w-4 animate-spin text-blue-500 ${className || ''}`}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
            >
                <title>{t('form.loading')}</title>
                <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                />
                <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
            </svg>
        );
    }

    if (status === 'success') {
        return (
            <svg
                className={`h-4 w-4 text-green-500 ${className || ''}`}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <title>{t('form.success')}</title>
                <path d='M20 6L9 17l-5-5' />
            </svg>
        );
    }

    return (
        <svg
            className={`h-4 w-4 text-red-500 ${className || ''}`}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <title>{t('form.error')}</title>
            <circle
                cx='12'
                cy='12'
                r='10'
            />
            <line
                x1='15'
                y1='9'
                x2='9'
                y2='15'
            />
            <line
                x1='9'
                y1='9'
                x2='15'
                y2='15'
            />
        </svg>
    );
}
