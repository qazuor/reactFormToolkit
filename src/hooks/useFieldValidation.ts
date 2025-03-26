import { useFormContext } from '@/context';
import { cn } from '@/lib';
import type { UseFieldValidationProps, UseValidationReturn, ValidationState } from '@/types';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

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
    schema
}: UseFieldValidationProps): UseValidationReturn {
    const { form } = useFormContext();
    const [hasAsyncError, setHasAsyncError] = useState(false);
    const [asyncError, setAsyncError] = useState<string | undefined>(undefined);
    const [asyncValidating, setIsAsyncValidating] = useState(false);
    const [asyncValidatingStarted, setAsyncValidatingStarted] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout>();

    const asyncValidationFn = asyncValidation?.asyncValidationFn;
    const asyncValidationDebounce = asyncValidation?.asyncValidationDebounce || 500;
    const showValidationIcons = !!asyncValidation?.showValidationIcons;
    const showLoadingSpinner = !!asyncValidation?.showLoadingSpinner;
    const textWhenValidating = asyncValidation?.textWhenValidating || undefined;
    const textWhenBeforeStartValidating = asyncValidation?.textWhenBeforeStartValidating || undefined;

    // Handle async validation
    useEffect(() => {
        if (!asyncValidationFn) {
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
                    setAsyncValidatingStarted(true);
                    // Set new timeout for debounced validation
                    debounceTimeout.current = setTimeout(async () => {
                        try {
                            const validationError = await asyncValidationFn(fieldValue);
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
    }, [asyncValidationFn, fieldPath, form, schema, asyncValidationDebounce]);

    //////////////////////////////////////////////////////////////////////////////////////////

    // Determine input type and base classes
    const inputType = isCheckbox ? 'checkbox' : 'input';
    const baseClasses = mergedStyles.field?.[inputType as keyof typeof mergedStyles.field];

    // Build state classes based on validation state
    const stateClasses = cn({
        [(mergedStyles.field?.isInvalid as string) || '']: hasAsyncError,
        [(mergedStyles.field?.isValid as string) || '']: !hasAsyncError,
        [(mergedStyles.field?.isLoading as string) || '']: asyncValidating
    });

    // Set aria-describedby if description exists
    const ariaDescribedBy = `${fieldPath}-description`;

    return {
        className: cn(baseClasses, stateClasses),
        ariaInvalid: hasAsyncError,
        ariaDescribedBy,
        asyncError,
        hasAsyncError,
        asyncValidating,
        asyncValidatingStarted,
        showValidationIcons,
        showLoadingSpinner,
        textWhenValidating,
        textWhenBeforeStartValidating
    };
}
