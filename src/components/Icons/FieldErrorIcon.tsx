import type { IconProps } from '@/types';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FieldErrorIcon component for displaying field-level validation errors
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Field error icon component
 */
export function FieldErrorIcon({ title }: IconProps): JSX.Element {
    const { t } = useTranslation();
    const defaultTitle = t('field.error', { defaultValue: 'Field Error' });

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
