import type { ComponentProps, ReactNode } from 'react';
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

/**
 * Styles for form fields.
 * These styles are applied to the different parts of a form field.
 */
export interface FieldStyles {
    /** CSS class for the field wrapper */
    wrapper?: string;
    /** CSS class for the field label */
    label?: string;
    /** CSS class for input elements */
    input?: string;
    /** CSS class for select elements */
    select?: string;
    /** CSS class for checkbox elements */
    checkbox?: string;
    /** CSS class for textarea elements */
    textarea?: string;
    /** CSS class for error messages */
    error?: string;
    /** CSS class for field descriptions */
    description?: string;
    /** CSS class for the required mark (*) */
    requiredMark?: string;
}

/**
 * Styles for the form and its fields.
 */
export interface FormStyles {
    /** CSS class for the form element */
    form?: string;
    /** Styles for form fields */
    field?: FieldStyles;
}

/**
 * Options for internationalization (i18n).
 */
export interface I18nOptions {
    /** Custom resources to merge with the default resources */
    resources?: TranslationResources;
    /** Language to use (defaults to 'en') */
    lng?: string;
    /** Custom i18next instance */
    i18n?: import('i18next').i18n;
}

/**
 * Default i18next resources containing translations for all supported languages.
 */
export type TranslationResources = {
    [key: string]: {
        translation?: {
            [key: string]: string | { [key: string]: string };
        };
    };
};

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
}

/** HTML Input props type */
export type HTMLInputProps = ComponentProps<'input'>;

/** HTML Select props type */
export type HTMLSelectProps = ComponentProps<'select'>;

/** HTML Textarea props type */
export type HTMLTextareaProps = ComponentProps<'textarea'>;
