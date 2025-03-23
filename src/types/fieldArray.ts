import type { ReactNode } from 'react';

export interface FieldArrayProps {
    /**
     * Name of the array field in the form data
     */
    name: string;

    /**
     * Children components (FormField elements)
     */
    children: ReactNode;

    /**
     * Minimum number of items required
     * @default 0
     */
    minItems?: number;

    /**
     * Maximum number of items allowed
     */
    maxItems?: number;

    /**
     * Custom add item button text
     */
    addButtonText?: string;

    /**
     * Custom remove item button text
     */
    removeButtonText?: string;

    /**
     * Custom CSS classes for the container
     */
    className?: string;

    /**
     * Custom CSS classes for the buttons
     */
    buttonClassName?: string;
}
