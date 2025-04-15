import { useFormContext } from '@/context';
import { useFieldState } from '@/hooks';
import { cn } from '@/lib';
import type { ErrorAnimation, ErrorPosition, FieldErrorProps } from '@/types';
import { memo, useEffect, useState } from 'react';
import { FieldErrorRenderer } from './FieldErrorRenderer';

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
 * @returns Field error component or null if no error
 */
export const FieldError = memo(function FieldError({ options, name, message: propMessage, inputRef }: FieldErrorProps) {
    // Get context first to ensure consistent hook order
    const { errorDisplayOptions: providerOptions, styleOptions } = useFormContext();
    const { error } = useFieldState(name);

    // Initialize all state variables before any conditional returns
    const [visible, setVisible] = useState(!options?.delay);
    const [dismissed, setDismissed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);

    // Get the message after initializing all state
    const message = propMessage || error?.message;

    // Don't show individual errors if using grouped errors
    if (providerOptions?.groupErrors) {
        return null;
    }

    const position: ErrorPosition = (options?.position as ErrorPosition) || 'below';

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

    // Convert message to string to ensure it's never undefined
    const errorMessage = message.toString();

    // Get animation type from options or default to 'none'
    const animation: ErrorAnimation = (options?.animation as ErrorAnimation) || 'none';

    // Determine if animation should be applied (not for tooltips and not for 'none' animation)
    const shouldAnimate = position !== 'tooltip' && animation !== 'none';

    // Get animation class if animation should be applied
    const animationClass = shouldAnimate ? ANIMATION_CLASSES[animation] : '';

    // Prepare error configuration
    const errorConfig = {
        message: errorMessage,
        position,
        animationClass,
        showIcon: options?.showIcon ?? true,
        className: cn(styleOptions?.field?.error || 'text-red-600 text-sm', options?.className),
        iconClassName: options?.iconClassName
    };

    if (position === 'tooltip') {
        return (
            <FieldErrorRenderer
                {...errorConfig}
                position='tooltip'
                showTooltip={showTooltip}
                inputRef={inputRef}
            />
        );
    }

    return (
        <FieldErrorRenderer
            {...errorConfig}
            positionClass={POSITION_CLASSES[position]}
        />
    );
});
