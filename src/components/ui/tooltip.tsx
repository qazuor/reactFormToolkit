import { cn } from '@/lib/utils';
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
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-testid='field-tooltip-content'
        className={cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
