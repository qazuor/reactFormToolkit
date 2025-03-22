import type { ReactNode } from 'react';
import type { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';
import type { I18nOptions } from './i18n';

export type FormSchema<T extends z.ZodType> = T;

/**
 * Props for the FormProvider component
 * @template T - Zod schema type
 */
export interface FormProviderProps<
    TFieldValues extends FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
> {
    /**
     * Callback function called when the form is submitted
     * @param data - The validated form data
     */
    onSubmit: SubmitHandler<TFieldValues>;

    /**
     * Zod schema for form validation
     */
    schema?: TSchema;

    /**
     * Optional default values for form fields
     */
    defaultValues?: DefaultValues<TFieldValues>;

    /** Form fields and other components */
    children: ReactNode;

    /** Mode for validation trigger (defaults to 'onBlur') */
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';

    /** Internationalization options */
    i18n?: I18nOptions;
}

/**
 * Form context value type
 */
export type FormContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
> = {
    /**
     * Form methods from react-hook-form
     */
    form: UseFormReturn<TFieldValues>;

    /**
     * Zod schema for form validation
     */
    schema?: TSchema;
};
