import type { ReactNode } from 'react';
import type {
    Control,
    DefaultValues,
    FieldValues,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormRegister,
    UseFormReturn,
    UseFormSetValue,
    UseFormTrigger,
    UseFormUnregister,
    UseFormWatch
} from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';
import type { I18nOptions } from './i18n';
import type { FormProviderStyleOptions } from './styles';

/**
 * Animation types for error messages
 */
export type ErrorAnimation = 'none' | 'fadeIn' | 'slideIn' | 'pulse' | 'shake';

/**
 * Position for error display
 */
export type ErrorPosition = 'below' | 'above' | 'right' | 'tooltip';

/**
 * Configuration options for error display
 */
export interface ErrorDisplayOptions {
    /**
     * Position of the error message relative to the input
     * @default 'below'
     */
    position?: ErrorPosition;

    /**
     * Animation to use when showing error messages
     * @default 'none'
     */
    animation?: ErrorAnimation;

    /**
     * Whether to group all errors in one location
     * @default false
     */
    groupErrors?: boolean;

    /**
     * Maximum number of errors to display when grouping
     * @default undefined (show all)
     */
    maxErrors?: number;

    /**
     * Delay in milliseconds before showing the error message
     * @default 0
     */
    delay?: number;

    /**
     * Whether to show an icon with the error message
     * @default true
     */
    showIcon?: boolean;

    /**
     * Custom CSS class for the error message container
     */
    className?: string;

    /**
     * Custom CSS class for the error icon
     */
    iconClassName?: string;

    /**
     * Whether to automatically dismiss the error after a period
     * @default false
     */
    autoDismiss?: boolean;

    /**
     * Time in milliseconds after which to dismiss the error
     * @default 5000
     */
    dismissAfter?: number;
}

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

    /** Optional form instance */
    form?: UseFormReturn<TFieldValues>;

    /** Mode for validation trigger (defaults to 'onBlur') */
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';

    /** Style options for form components */
    styleOptions?: FormProviderStyleOptions;

    /** Error display configuration */
    errorDisplayOptions?: ErrorDisplayOptions;

    /** Global error configuration */
    globalErrorOptions?: GlobalErrorOptions;

    /** Internationalization options */
    i18n?: I18nOptions;
}

/**
 * Global error configuration
 */
export interface GlobalErrorOptions {
    /**
     * Position of the error message
     * @default 'top'
     */
    position?: 'top' | 'bottom';

    /**
     * Animation to use when showing error messages
     * @default 'fadeIn'
     */
    animation?: ErrorAnimation;

    /**
     * Whether to auto dismiss the error after a period
     * @default false
     */
    autoDismiss?: boolean;

    /**
     * Time in milliseconds after which to dismiss the error
     * @default 5000
     */
    dismissAfter?: number;

    /**
     * Custom CSS class for the error message container
     */
    className?: string;
}

/**
 * Form instance value type
 */
export type Form<TFieldValues extends FieldValues = FieldValues> = {
    watch: UseFormWatch<TFieldValues>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    control: Control<TFieldValues, any>;
    getValues: UseFormGetValues<TFieldValues>;
    trigger: UseFormTrigger<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    clearErrors: UseFormClearErrors<TFieldValues>;
    unregister: UseFormUnregister<TFieldValues>;
    register: UseFormRegister<TFieldValues>;
};

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
    form: Form<TFieldValues>;

    /**
     * Zod schema for form validation
     */
    schema?: TSchema;

    /**
     * Form state
     */
    formState: {
        isDirty: boolean;
        isSubmitting: boolean;
        isValid: boolean;
        isValidating: boolean;
        submitCount: number;
        errors: Record<string, any>;
        dirtyFields: Record<string, boolean>;
        touchedFields: Record<string, boolean>;
    };

    /**
     * Style options for form components
     */
    styleOptions?: FormProviderStyleOptions;

    /**
     * Error display configuration
     */
    errorDisplayOptions?: ErrorDisplayOptions;

    /**
     * Global error configuration
     */
    globalErrorOptions?: GlobalErrorOptions;

    /**
     * Global form error
     */
    globalError?: string;

    /**
     * Set global form error
     */
    setGlobalError: (error: string | undefined) => void;

    /**
     * Record of async validation states by field name
     */
    asyncValidations?: Record<string, boolean>;

    /**
     * Record of async error states by field name
     */
    asyncErrors?: Record<string, boolean>;

    /**
     * Register async validation state for a field
     */
    registerAsyncValidation: (fieldName: string, isValidating: boolean) => void;

    /**
     * Register async error state for a field
     */
    registerAsyncError: (fieldName: string, hasError: boolean) => void;
};
