import { useFormContext } from '@/context';
import { useFieldStatus } from '@/hooks';
import { cn } from '@/lib';
import type { AsyncValidationFn, FormProviderStyleOptions, FormSchema } from '@/types';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { ZodType, ZodTypeDef, z } from 'zod';

interface UseFieldValidationProps<
    TFieldValues extends FieldValues = FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
> {
    fieldPath: string;
    isCheckbox?: boolean;
    mergedStyles: FormProviderStyleOptions;
    asyncValidation?: AsyncValidationFn;
    asyncValidationDebounce?: number;
    schema?: TSchema;
}

interface ValidationState {
    className: string;
    ariaInvalid: boolean;
    ariaDescribedBy?: string;
    isValidating: boolean;
    hasAsyncError: boolean;
    asyncValidating: boolean;
    asyncError: string | undefined;
}

const fieldHasError = <T>(
    schema: ZodType<FieldValues, ZodTypeDef, FieldValues> | undefined,
    fieldPath: string,
    fieldValue: T
) => {
    const result = schema?.safeParse({ [fieldPath]: fieldValue });
    return !result || result.success ? false : result.error.issues.some((issue) => issue.path[0] === fieldPath);
};

/**
 * Hook for handling field validation state and styling
 * @param props Configuration options
 * @returns Validation state and attributes
 */
export function useFieldValidation({
    fieldPath,
    isCheckbox,
    mergedStyles,
    asyncValidation,
    asyncValidationDebounce,
    schema
}: UseFieldValidationProps): ValidationState {
    const { form } = useFormContext();
    const { hasError, isValidating } = useFieldStatus(fieldPath);
    const [hasAsyncError, setHasAsyncError] = useState(false);
    const [asyncError, setAsyncError] = useState<string | undefined>(undefined);
    const [asyncValidating, setIsAsyncValidating] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout>();

    // Handle async validation
    useEffect(() => {
        if (!asyncValidation) {
            return;
        }

        const subscription = form.watch((value, { name: changedField }) => {
            if (changedField === fieldPath) {
                const fieldValue = value[fieldPath as keyof typeof value];

                if (debounceTimeout.current) {
                    // Clear any existing timeout
                    clearTimeout(debounceTimeout.current);
                }

                // Check Zod validation first
                const hasFieldError = !schema || fieldHasError(schema, fieldPath, fieldValue);
                setHasAsyncError(false);
                setIsAsyncValidating(false);
                setAsyncError(undefined);

                if (!hasFieldError) {
                    setIsAsyncValidating(true);
                    // Set new timeout for debounced validation
                    debounceTimeout.current = setTimeout(async () => {
                        try {
                            const validationError = await asyncValidation(fieldValue);
                            setAsyncError(typeof validationError === 'string' ? validationError : undefined);
                            setHasAsyncError(typeof validationError === 'string');
                        } catch (error) {
                            setAsyncError(t('field.asyncValidationError'));
                            console.error('AsyncValidation error', error);
                            setHasAsyncError(true);
                        } finally {
                            setIsAsyncValidating(false);
                        }
                    }, asyncValidationDebounce);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [asyncValidation, fieldPath, form, t, schema, asyncValidationDebounce]);

    //////////////////////////////////////////////////////////////////////////////////////////

    // Determine input type and base classes
    const inputType = isCheckbox ? 'checkbox' : 'input';
    const baseClasses = mergedStyles.field?.[inputType as keyof typeof mergedStyles.field];

    // Build state classes based on validation state
    const stateClasses = cn({
        [(mergedStyles.field?.isInvalid as string) || '']: hasError,
        [(mergedStyles.field?.isValid as string) || '']: !hasError,
        [(mergedStyles.field?.isLoading as string) || '']: isValidating
    });

    // Set aria-describedby if description exists
    const ariaDescribedBy = `${fieldPath}-description`;

    return {
        className: cn(baseClasses, stateClasses),
        ariaInvalid: hasError,
        ariaDescribedBy,
        isValidating,
        asyncError,
        hasAsyncError,
        asyncValidating
    };
}
