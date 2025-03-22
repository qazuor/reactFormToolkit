import { InfoTooltipIcon } from '@/components';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib';
import type { FieldLabelProps } from '@/types';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FieldLabel component for rendering form field labels
 * @param props - Component properties
 * @returns Form field label component
 */
export function FieldLabel({
    htmlFor,
    children,
    required,
    tooltip,
    tooltipOptions = {}
}: FieldLabelProps): JSX.Element {
    const { t } = useTranslation();
    const tooltipTitle = t('field.info');

    return (
        <label
            htmlFor={htmlFor}
            className='group mb-2 block font-medium text-gray-700 text-sm'
            data-testid='field-label'
        >
            <span data-testid='field-label-text'>{children}</span>
            {required && (
                <span
                    data-testid='field-required-indicator'
                    className='ml-1 text-red-500'
                >
                    *
                </span>
            )}
            {tooltip && (
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <button
                            type='button'
                            data-testid='field-tooltip-trigger'
                            className='ml-1 inline-flex cursor-help items-center text-gray-400 group-hover:text-gray-500'
                        >
                            <InfoTooltipIcon title={tooltipTitle} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent
                        align={tooltipOptions?.align || 'start'}
                        className={tooltipOptions.className}
                        side={tooltipOptions?.position || 'right'}
                        sideOffset={tooltipOptions?.sideOffset || 8}
                    >
                        <p className={cn('text-sm', tooltipOptions?.className)}>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </label>
    );
}
