import type { ReactNode } from 'react';
import type { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

/**
 * Props for the FormProvider component
 * @template T - Zod schema type
 */
export interface FormProviderProps<TFieldValues extends FieldValues> {
    /**
     * Callback function called when the form is submitted
     * @param data - The validated form data
     */
    onSubmit: SubmitHandler<TFieldValues>;

    /**
     * Zod schema for form validation
     */
    schema?: ZodType<TFieldValues, ZodTypeDef, TFieldValues>;

    /**
     * Optional default values for form fields
     */
    defaultValues?: DefaultValues<TFieldValues>;

    /** Form fields and other components */
    children: ReactNode;

    /** Mode for validation trigger (defaults to 'onBlur') */
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * Props for the FormField component
 */
export interface FormFieldProps {
    /**
     * Field name, must match the schema property
     */
    name: string;

    /**
     * Optional field label
     */
    label?: string;

    /**
     * Whether the field is required
     * @default false
     */
    required?: boolean;

    /**
     * Field input component
     */
    children: ReactNode;

    /**
     * Field description
     */
    description?: string;
}

/**
 * Form context value type
 */
export interface FormContextValue<TFieldValues extends FieldValues> {
    /**
     * Form methods from react-hook-form
     */
    form: UseFormReturn<TFieldValues>;
}
