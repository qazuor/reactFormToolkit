import type { FieldValues } from 'react-hook-form';
import type { z } from 'zod';
import type { AsyncValidationProps } from './asyncValidation';
import type { FormSchema } from './form';
import type { FormProviderStyleOptions } from './styles';

/**
 * State for field validation
 */
export interface ValidationState {
    hasError: boolean;
    isValidating: boolean;
    error?: string;
    validatingStarted: boolean;
}

/**
 * Props for field validation hook
 */
export interface UseFieldValidationProps<
    TFieldValues extends FieldValues = FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
> {
    fieldPath: string;
    isCheckbox?: boolean;
    mergedStyles: FormProviderStyleOptions;
    asyncValidation?: AsyncValidationProps;
    schema?: TSchema;
    hasError?: boolean;
}

/**
 * Return type for field validation hook
 */
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
    validate: (value: unknown) => Promise<void>;
}
