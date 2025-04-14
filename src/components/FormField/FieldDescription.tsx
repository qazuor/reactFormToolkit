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
    const { styleOptions: providerStyles } = useFormContext();

    // Get description style from provider or use default
    const descriptionClass = providerStyles?.field?.description || 'text-gray-500 text-sm';

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
