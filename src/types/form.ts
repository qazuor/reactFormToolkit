import type { ReactNode } from 'react';
import type { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';
import type { DescriptionOptions } from './description';
import type { TooltipOptions } from './field';
import type { I18nOptions } from './i18n';

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

    /** Internationalization options */
    i18n?: I18nOptions;
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
    description?: string | ReactNode;

    /**
     * Optional description configuration options
     */
    descriptionOptions?: DescriptionOptions;

    /**
     * Optional tooltip text to show on hover
     */
    tooltip?: string;

    /**
     * Optional tooltip configuration options
     */
    tooltipOptions?: TooltipOptions;
}

/**
 * Form context value type
 */
export type FormContextValue<TFieldValues extends FieldValues = FieldValues> = {
    /**
     * Form methods from react-hook-form
     */
    form: UseFormReturn<TFieldValues>;
};
