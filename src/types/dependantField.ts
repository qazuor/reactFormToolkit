import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import type { Form } from './form';

/**
 * Represents an option in a dependent field
 */
export interface DependentOption {
    /**
     * The value of the option
     */
    value: string;

    /**
     * The display label of the option
     */
    label: string;
}

/**
 * Props for the DependantField component
 */
export interface DependantFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    /**
     * The field name that this field depends on
     */
    dependsOnField: TName;

    /**
     * Callback function to fetch dependent values based on the parent field value
     * Should return an array of options or a promise that resolves to an array of options
     */
    dependentValuesCallback: (value: unknown) => Promise<DependentOption[]> | DependentOption[];

    /**
     * The children to render (typically FormField components)
     */
    children: ReactNode;

    /**
     * Delay in milliseconds before showing loading state
     * Helps prevent flickering for fast responses
     * @default 300
     */
    loadingDelay?: number;

    /**
     * Whether to cache results to avoid unnecessary API calls
     * @default true
     */
    cacheResults?: boolean;
}

/**
 * Options for the useDependantField hook
 */
export interface UseDependantFieldOptions<TFieldValues extends FieldValues = FieldValues> {
    /**
     * The form instance from useFormContext
     */
    form: Form<TFieldValues>;

    /**
     * The field name that this field depends on
     */
    dependsOnField: FieldPath<TFieldValues>;

    /**
     * Callback function to fetch dependent values based on the parent field value
     * Should return an array of options or a promise that resolves to an array of options
     */
    dependentValuesCallback: (value: unknown) => Promise<DependentOption[]> | DependentOption[];

    /**
     * Delay in milliseconds before showing loading state
     * Helps prevent flickering for fast responses
     * @default 300
     */
    loadingDelay?: number;

    /**
     * Whether to cache results to avoid unnecessary API calls
     * @default true
     */
    cacheResults?: boolean;
}
