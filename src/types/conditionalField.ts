import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import type { Form } from './form';

/**
 * Props for the ConditionalField component.
 */
export interface ConditionalFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    /**
     * The field name to watch for changes
     */
    watchField: TName;

    /**
     * The condition to evaluate
     * Can be a value to match or a function that returns a boolean
     */
    condition: unknown | ((value: unknown) => boolean);

    /**
     * The children to render when the condition is met
     */
    children: ReactNode;

    /**
     * Optional fallback content to render when the condition is not met
     */
    fallback?: ReactNode;

    /**
     * Whether to keep the field registered when hidden
     * @default false
     */
    keepRegistered?: boolean;
}

/**
 * Props for the ConditionalFieldGroup component.
 */
export interface ConditionalFieldGroupProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    /**
     * The field name to watch for changes
     */
    watchField: TName;

    /**
     * Object mapping field values to the content to render
     */
    conditions: Record<string, ReactNode>;

    /**
     * Optional fallback content to render when no condition is met
     */
    fallback?: ReactNode;

    /**
     * Optional className for the wrapper div
     */
    className?: string;

    /**
     * Whether to keep fields registered when hidden
     * @default false
     */
    keepRegistered?: boolean;
}

/**
 * Options for the useConditionalField hook
 */
export interface UseConditionalFieldOptions<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    /**
     * The form instance from useFormContext
     */
    form: Form<TFieldValues>;

    /**
     * The field name to watch for changes
     */
    watchField: TName;

    /**
     * Whether to keep fields registered when hidden
     */
    keepRegistered?: boolean;

    /**
     * The content that will be conditionally shown/hidden
     * Used to find field names for unregistration
     */
    content: ReactNode | Record<string, ReactNode>;
}
