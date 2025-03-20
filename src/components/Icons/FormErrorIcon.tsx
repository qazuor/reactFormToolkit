import type { IconProps } from '@/types/icons';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FormErrorIcon component for displaying form-level errors
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Form error icon component
 */
export function FormErrorIcon({ title }: IconProps): JSX.Element {
    const { t } = useTranslation();
    const defaultTitle = t('form.error', { defaultValue: 'Form Error' });

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
        >
            <title>{title || defaultTitle}</title>
            <circle
                cx='12'
                cy='12'
                r='10'
            />
            <line
                x1='12'
                y1='8'
                x2='12'
                y2='12'
            />
            <line
                x1='12'
                y1='16'
                x2='12.01'
                y2='16'
            />
        </svg>
    );
}
