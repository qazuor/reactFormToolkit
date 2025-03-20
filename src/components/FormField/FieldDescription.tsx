import { cn } from '@/lib/utils';
import type { DescriptionProps } from '@/types/description';
import type { JSX } from 'react';

/**
 * FieldDescription component for rendering field-level descriptions
 * @param props - Component properties
 * @returns Field description component
 */
export function FieldDescription({
    id,
    children,
    className,
    position = 'below',
    ...props
}: DescriptionProps): JSX.Element {
    return (
        <p
            id={id}
            className={cn(
                'text-gray-500 text-sm',
                position === 'above' && 'mb-2',
                position === 'below' && 'mt-1',
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
}
