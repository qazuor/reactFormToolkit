import { InfoTooltipIcon } from '@/components';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type { FieldLabelProps } from '@/types';
import type { JSX } from 'react';

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
    tooltipOptions = {},
    styleOptions
}: FieldLabelProps): JSX.Element {
    const { t } = useQRFTTranslation();
    const { styleOptions: providerStyles } = useFormContext();

    // Get styles from provider or use defaults
    const labelClass =
        styleOptions?.label || providerStyles?.field?.label || 'group mb-2 block font-medium text-gray-700 text-sm';
    const requiredMarkClass = styleOptions?.requiredMark || providerStyles?.field?.requiredMark || 'ml-1 text-red-500';
    const tooltipIconClass =
        providerStyles?.tooltip?.icon ||
        'ml-1 inline-flex cursor-help items-center text-gray-400 group-hover:text-gray-500';
    const tooltipContentClass = providerStyles?.tooltip?.content || '';

    const tooltipTitle = t('field.info');

    return (
        <label
            htmlFor={htmlFor}
            className={labelClass as string}
            data-testid='field-label'
        >
            <span data-testid='field-label-text'>{children}</span>
            {required && (
                <span
                    data-testid='field-required-indicator'
                    className={requiredMarkClass as string}
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
                            className={tooltipIconClass as string}
                        >
                            <InfoTooltipIcon title={tooltipTitle} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent
                        align={tooltipOptions?.align || 'start'}
                        className={cn(tooltipContentClass, tooltipOptions.className)}
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
