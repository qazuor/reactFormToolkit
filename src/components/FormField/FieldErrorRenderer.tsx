import { useFormContext } from '@/context';
import { cn } from '@/lib';
import type { FieldErrorRendererProps } from '@/types';
import { type JSX, memo } from 'react';
import { FieldErrorIcon } from '../Icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

/**
 * FieldErrorRenderer component for rendering field validation error UI
 * This component handles only the rendering logic, separated from state management
 *
 * @param {FieldErrorRendererProps} props - Component props
 * @returns {JSX.Element} Rendered field error
 *
 * @example
 * ```tsx
 * <FieldErrorRenderer
 *   message="Invalid email"
 *   position="below"
 *   animationClass="animate-fadeIn"
 *   showIcon={true}
 *   className="custom-error"
 * />
 * ```
 */
export const FieldErrorRenderer = memo(function FieldErrorRenderer({
    message,
    position,
    animationClass,
    showIcon,
    className,
    iconClassName,
    positionClass,
    showTooltip = false,
    inputRef = undefined
}: FieldErrorRendererProps): JSX.Element {
    const { styleOptions } = useFormContext();

    // Render tooltip-style error
    if (position === 'tooltip') {
        return (
            <div className='relative'>
                <Tooltip open={showTooltip}>
                    <TooltipTrigger asChild={true}>
                        <div className='absolute inset-0 z-10' />
                    </TooltipTrigger>
                    <TooltipContent
                        side='bottom'
                        align='start'
                        sideOffset={0}
                        data-testid='error-tooltip'
                        className={cn(
                            'z-50 border border-red-200 bg-red-50 px-3 py-2 text-red-600',
                            styleOptions?.field?.error,
                            animationClass,
                            className
                        )}
                    >
                        <div className='flex items-center gap-2'>
                            {showIcon && <FieldErrorIcon className={iconClassName || 'h-4 w-4 shrink-0'} />}
                            <span>{message}</span>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    // Render standard error message
    const errorContent = (
        <div
            className={cn('flex items-center gap-1', positionClass, animationClass, className)}
            data-testid='field-error'
            aria-live='polite'
            role='alert'
        >
            {showIcon && <FieldErrorIcon className={cn('h-4 w-4 shrink-0', iconClassName)} />}
            <span>{message}</span>
        </div>
    );

    return <div className={cn('relative', position === 'right' && 'w-0')}>{errorContent}</div>;
});
