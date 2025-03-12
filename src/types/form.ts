import type { ComponentProps, ReactNode } from 'react';
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';
import type { AsyncValidateFunction, FieldStyles, FormStyles, I18nOptions } from './index.ts';

/**
 * Props for the FormProvider component.
 *
 * @template TFieldValues - The type of the form values
 */
export interface FormProviderProps<TFieldValues extends FieldValues> {
    /** Form fields and other components */
    children: ReactNode;
    /** Function called when the form is submitted */
    onSubmit: SubmitHandler<TFieldValues>;
    /** Zod schema for form validation */
    schema?: ZodType<TFieldValues, ZodTypeDef, TFieldValues>;
    /** Default values for form fields */
    defaultValues?: DefaultValues<TFieldValues>;
    /** CSS class for the form element */
    className?: string;
    /** External form instance from React Hook Form */
    form?: UseFormReturn<TFieldValues>;
    /** Whether to reset the form after submission */
    resetOnSubmit?: boolean;
    /** Custom styles for form elements */
    styles?: FormStyles;
    /** Internationalization options */
    i18n?: I18nOptions;
    /** Mode for validation trigger (defaults to 'onBlur') */
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * Value provided by the FormContext.
 *
 * @template TFieldValues - The type of the form values
 */
export interface FormContextValue<TFieldValues extends FieldValues> {
    /** Form instance from React Hook Form */
    form: UseFormReturn<TFieldValues>;
    /** Form validation errors */
    errors: FieldErrors<TFieldValues>;
    /** Styles for form fields */
    styles: FieldStyles;
}

/**
 * Props for the FormField component.
 *
 * @template TFieldValues - The type of the form values
 * @template TName - The name of the field (must be a key of TFieldValues)
 */
export interface FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    /** Field name (must match schema) */
    name: TName;
    /** Label text for the field */
    label?: string;
    /** Description text displayed below the field */
    description?: string;
    /** Input element (input, select, textarea, etc.) */
    children: ReactNode;
    /** CSS class for the field wrapper */
    className?: string;
    /** CSS class for the label */
    labelClassName?: string;
    /** CSS class for the description */
    descriptionClassName?: string;
    /** CSS class for error messages */
    errorClassName?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Additional validation rules */
    rules?: Record<string, unknown>;
    /** Async validation function */
    asyncValidate?: AsyncValidateFunction;
    /** Debounce time for async validation in milliseconds */
    debounceTime?: number;
}

/** HTML Input props type */
export type HTMLInputProps = ComponentProps<'input'>;

/** HTML Select props type */
export type HTMLSelectProps = ComponentProps<'select'>;

/** HTML Textarea props type */
export type HTMLTextareaProps = ComponentProps<'textarea'>;
