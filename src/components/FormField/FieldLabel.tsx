import { InfoTooltipIcon } from '@/components/Icons';
import type { FieldLabelProps } from '@/types/field';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FieldLabel component for rendering form field labels
 * @param props - Component properties
 * @returns Form field label component
 */
export function FieldLabel({ htmlFor, children, required, tooltip }: FieldLabelProps): JSX.Element {
    const { t } = useTranslation();

    return (
        <label
            htmlFor={htmlFor}
            className='mb-2 block font-medium text-gray-700 text-sm'
        >
            <span>{children}</span>
            {required && <span className='ml-1 text-red-500'>*</span>}
            {tooltip && (
                <span className='ml-1 inline-block align-middle text-gray-400'>
                    <InfoTooltipIcon title={t('field.info', { defaultValue: tooltip })} />
                </span>
            )}
        </label>
    );
}
