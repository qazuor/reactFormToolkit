import { useFormContext } from '@/context/FormContext';
import { cn } from '@/lib/utils';
import type { DescriptionProps } from '@/types';
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
    const { styleOptions } = useFormContext();

    // Get description style from provider or use default
    const descriptionClass = styleOptions?.field?.description || 'text-gray-600 text-sm';

    return (
        <div
            id={id}
            className={cn(descriptionClass, position === 'above' && 'mb-6', position === 'below' && 'mt-6', className)}
            {...props}
        >
            {children}
        </div>
    );
}
