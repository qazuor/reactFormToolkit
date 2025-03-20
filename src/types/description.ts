import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Description configuration options
 */
export type DescriptionOptions = {
    position?: 'above' | 'below';
    className?: string;
    id?: string;
    'aria-label'?: string;
    role?: string;
};

/**
 * Props for description components
 */
export interface DescriptionProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    /**
     * Description content
     */
    children: ReactNode;

    /**
     * Optional CSS classes
     */
    className?: string;

    /**
     * Position relative to the form/field
     * @default 'below'
     */
    position?: 'above' | 'below';
}
