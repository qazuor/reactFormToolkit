import type { ComponentProps, ReactNode } from 'react';
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

// Form provider types
export interface FormProviderProps<TFieldValues extends FieldValues> {
    children: ReactNode;
    onSubmit: SubmitHandler<TFieldValues>;
    schema?: ZodType<TFieldValues, ZodTypeDef, TFieldValues>;
    defaultValues?: DefaultValues<TFieldValues>;
    className?: string;
    form?: UseFormReturn<TFieldValues>;
    resetOnSubmit?: boolean;
}

// Form context type
export interface FormContextValue<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
}

// Form field types
export interface FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    name: TName;
    label?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
    required?: boolean;
}

// HTML Input props
export type HTMLInputProps = ComponentProps<'input'>;

// HTML Select props
export type HTMLSelectProps = ComponentProps<'select'>;

// HTML Textarea props
export type HTMLTextareaProps = ComponentProps<'textarea'>;
