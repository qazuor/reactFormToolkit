import { useFormContext } from '@/context';
import { useFieldStatus } from '@/hooks';
import { cn } from '@/lib';
import type { ErrorAnimation, ErrorPosition, FieldErrorProps } from '@/types';
import { type JSX, useEffect, useState } from 'react';
import { FieldErrorIcon } from '../Icons/FieldErrorIcon';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const ANIMATION_CLASSES: Record<ErrorAnimation, string> = {
    none: '',
    fadeIn: 'animate-fadeIn',
    slideIn: 'animate-slideIn',
    pulse: 'animate-pulse',
    shake: 'animate-shake'
};

const POSITION_CLASSES: Record<ErrorPosition, string> = {
    below: 'mt-1',
    above: 'mb-1',
    right: 'flex-shrink-0 whitespace-nowrap',
    tooltip: ''
};

/**
 * FieldError component for displaying field validation errors
 * @param props - Component properties
 * @returns Form field error component
 */
export function FieldError({ options, name, message: propMessage, inputRef }: FieldErrorProps): JSX.Element | null {
    const { errorDisplayOptions: providerOptions } = useFormContext();
    const { error } = useFieldStatus(name);
    const message = propMessage || error?.message;
    const [visible, setVisible] = useState(!options?.delay);
    const [dismissed, setDismissed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);

    // Don't show individual errors if using grouped errors
    if (providerOptions?.groupErrors) {
        return null;
    }

    const position: ErrorPosition = (options?.position as ErrorPosition) || 'below';
    const animation: ErrorAnimation = (options?.animation as ErrorAnimation) || 'none';
    // Don't apply animation for tooltip position
    const shouldAnimate = position !== 'tooltip' && animation !== 'none';
    const animationClass = shouldAnimate ? ANIMATION_CLASSES[animation as keyof typeof ANIMATION_CLASSES] : '';
    const showIcon = options?.showIcon ?? true;

    // Handle delay and auto-dismiss
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useEffect(() => {
        let showTimeout: NodeJS.Timeout | undefined;
        let dismissTimeout: NodeJS.Timeout | undefined;

        if (message) {
            if (options?.delay) {
                showTimeout = setTimeout(() => setVisible(true), options.delay);
            } else {
                setVisible(true);
            }

            if (options?.autoDismiss && options.dismissAfter) {
                dismissTimeout = setTimeout(() => setDismissed(true), options.dismissAfter);
            }
        }

        return () => {
            if (showTimeout) {
                clearTimeout(showTimeout);
            }
            if (dismissTimeout) {
                clearTimeout(dismissTimeout);
            }
        };
    }, [message, options?.delay, options?.autoDismiss, options?.dismissAfter]);

    // Handle tooltip visibility
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useEffect(() => {
        if (!inputRef?.current || position !== 'tooltip') {
            return;
        }
        const input = inputRef.current;
        const handleMouseEnter = () => setShowTooltip(true);
        const handleMouseLeave = () => setShowTooltip(false);
        input.addEventListener('mouseenter', handleMouseEnter);
        input.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            input.removeEventListener('mouseenter', handleMouseEnter);
            input.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [inputRef, position]);

    if (!(message && visible) || dismissed) {
        return null;
    }

    const errorContent = (
        <div
            className={cn(
                'flex items-center gap-1 text-red-600 text-sm',
                POSITION_CLASSES[position],
                animationClass,
                options?.className
            )}
            data-testid='field-error'
            aria-live='polite'
        >
            {showIcon && <FieldErrorIcon className={cn(options?.iconClassName || 'h-4 w-4 shrink-0')} />}
            <span>{message.toString()}</span>
        </div>
    );

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
                            animation !== 'none' && animation === 'pulse' && 'animate-pulse',
                            options?.className
                        )}
                    >
                        <div className='flex items-center gap-2'>
                            {showIcon && (
                                <FieldErrorIcon className={cn(options?.iconClassName || 'h-4 w-4 shrink-0')} />
                            )}
                            <span>{message.toString()}</span>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return <div className={cn('relative', position === 'right' && 'w-0')}>{errorContent}</div>;
}
