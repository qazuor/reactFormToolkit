import { useFormContext } from '@/context';
import { cn } from '@/lib/utils';
import type { DescriptionProps } from '@/types';
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
    const { styleOptions } = useFormContext();

    // Get description style from provider or use default
    const descriptionClass = styleOptions?.field?.description || 'text-gray-500 text-sm dark:text-gray-400';

    return (
        <p
            id={id}
            className={cn(descriptionClass, position === 'above' && 'mb-2', position === 'below' && 'mt-1', className)}
            {...props}
        >
            {children}
        </p>
    );
}
