import { cn } from '@/lib/utils';
import type { DescriptionProps } from '@/types/description';
import type { JSX } from 'react';

/**
 * FormDescription component for rendering form-level descriptions
 * @param props - Component properties
 * @returns Form description component
 */
export function FormDescription({
    id,
    children,
    className,
    position = 'above',
    ...props
}: DescriptionProps): JSX.Element {
    return (
        <div
            id={id}
            className={cn(
                'text-gray-600 text-sm',
                position === 'above' && 'mb-6',
                position === 'below' && 'mt-6',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
