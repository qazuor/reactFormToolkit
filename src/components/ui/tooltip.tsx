import { cn } from '@/lib/utils';
import { useFormContext } from '@/context';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

const TooltipProvider = ({ children, ...props }: TooltipPrimitive.TooltipProviderProps) => (
    <TooltipPrimitive.Provider
        delayDuration={0}
        disableHoverableContent={true}
        {...props}
    >
        {children}
    </TooltipPrimitive.Provider>
);

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
    const { styleOptions } = useFormContext();

    // Get tooltip content style from provider or use default
    const tooltipContentClass = styleOptions?.tooltip?.content || '';

    return (
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            data-testid='field-tooltip-content'
            className={cn(
                'z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
                tooltipContentClass,
                className
            )}
            {...props}
        />
    );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
