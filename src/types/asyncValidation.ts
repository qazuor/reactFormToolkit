import type { FieldValues } from 'react-hook-form';
import type { z } from 'zod';
import type { FormSchema } from './form';
import type { FormProviderStyleOptions } from './styles';

/**
 * Async validator function type
 */
export type AsyncValidationFn = (value: string) => Promise<boolean | string | undefined>;

/**
 * Props for the FormField component
 */
export type AsyncValidationProps = {
    /**
     * Optional async validation function
     */
    asyncValidationFn: AsyncValidationFn;

    /**
     * Debounce time in milliseconds for async validation
     * @default 500
     */
    asyncValidationDebounce?: number;

    /**
     * Show validation status icons
     * @default true
     */
    showValidationIcons?: boolean;

    /**
     * Show loading spinner during async validation
     * @default true
     */
    showLoadingSpinner?: boolean;

    /**
     * Text to display when async validation is in progress
     * @default 'Validating...'
     */
    textWhenValidating?: string;

    /**
     * Text to display when async validation is not executed
     * @default null
     */
    textWhenBeforeStartValidating?: string;
};

export interface FieldAsyncValidationProps {
    isValidating: boolean;

    hasError: boolean;
    error: string | undefined;
    asyncValidatingStarted: boolean;

    /**
     * Show validation status icons
     * @default true
     */
    showValidationIcons: boolean;

    /**
     * Show loading spinner during async validation
     * @default true
     */
    showLoadingSpinner: boolean;

    /**
     * Text to display when async validation is in progress
     * @default 'Validating...'
     */
    textWhenValidating?: string;

    /**
     * Text to display when async validation is not executed
     * @default null
     */
    textWhenBeforeStartValidating?: string;
}

export interface UseFieldValidationProps<
    TFieldValues extends FieldValues = FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
> {
    fieldPath: string;
    isCheckbox?: boolean;
    mergedStyles: FormProviderStyleOptions;
    asyncValidation?: AsyncValidationProps;
    schema?: TSchema;
}

export interface UseValidationReturn {
    className: string;
    ariaInvalid: boolean;
    ariaDescribedBy?: string;
    hasAsyncError: boolean;
    asyncValidating: boolean;
    asyncValidatingStarted: boolean;
    asyncError: string | undefined;
    showValidationIcons: boolean;
    showLoadingSpinner: boolean;
    textWhenValidating: string | undefined;
    textWhenBeforeStartValidating: string | undefined;
}
