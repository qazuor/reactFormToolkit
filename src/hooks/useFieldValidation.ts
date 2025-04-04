import { useFormContext } from '@/context';
import { cn } from '@/lib';
import { shouldApplyInputStyles } from '@/lib/ui-library';
import type { UseFieldValidationProps, UseValidationReturn, ValidationState } from '@/types';
import { t } from 'i18next';
import { useCallback, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

const fieldHasErrorFn = <T>(
    schema: ZodType<FieldValues, ZodTypeDef, FieldValues> | undefined,
    fieldPath: string,
    fieldValue: T
) => {
    const result = schema?.safeParse({ [fieldPath]: fieldValue });
    return !result || result.success ? false : result.error.issues.some((issue) => issue.path[0] === fieldPath);
};

/**
 * Hook for handling field validation state and styling
 * @param props - Configuration options for field validation
 * @returns Validation state and error information
 *
 * @example
 * ```tsx
 * const { asyncError, hasAsyncError, asyncValidating } = useFieldValidation({
 *   fieldPath: 'email',
 *   asyncValidation: {
 *     asyncValidationFn: checkEmailAvailability
 *   }
 * });
 * ```
 */
export function useFieldValidation({
    fieldPath,
    isCheckbox,
    mergedStyles,
    asyncValidation,
    schema,
    hasError: fieldHasError
}: UseFieldValidationProps): UseValidationReturn {
    const { registerAsyncValidation, registerAsyncError, uiLibrary } = useFormContext();
    const [validationState, setValidationState] = useState<ValidationState>({
        hasError: fieldHasError as boolean,
        isValidating: false,
        error: undefined,
        validatingStarted: false
    });
    const debounceTimeout = useRef<NodeJS.Timeout>();

    const asyncValidationFn = asyncValidation?.asyncValidationFn;
    const asyncValidationDebounce =
        typeof asyncValidation?.asyncValidationDebounce === 'number' ? asyncValidation?.asyncValidationDebounce : 500;
    const showValidationIcons = !!asyncValidation?.showValidationIcons;
    const showLoadingSpinner = !!asyncValidation?.showLoadingSpinner;
    const textWhenValidating = asyncValidation?.textWhenValidating;
    const textWhenBeforeStartValidating = asyncValidation?.textWhenBeforeStartValidating;

    const validate = useCallback(
        async (value: unknown) => {
            if (!asyncValidationFn) {
                return;
            }

            // Check Zod validation first
            if (schema && fieldHasErrorFn(schema, fieldPath, value)) {
                return;
            }

            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            // Update validating state immediately
            registerAsyncValidation(fieldPath, true);
            setValidationState({
                ...validationState,
                isValidating: true,
                validatingStarted: true,
                hasError: false,
                error: undefined
            });

            debounceTimeout.current = setTimeout(async () => {
                try {
                    const validationResult = await asyncValidationFn(value);
                    const hasError = typeof validationResult === 'string';

                    // Update validation state in context
                    registerAsyncValidation(fieldPath, false);
                    registerAsyncError(fieldPath, hasError);

                    setValidationState({
                        error: typeof validationResult === 'string' ? validationResult : undefined,
                        hasError,
                        isValidating: false,
                        validatingStarted: true
                    });
                } catch (error) {
                    // Update validation state in context for error case
                    registerAsyncValidation(fieldPath, false);
                    registerAsyncError(fieldPath, true);

                    setValidationState({
                        error: t('field.asyncValidationError'),
                        hasError: true,
                        isValidating: false,
                        validatingStarted: true
                    });
                    console.error('AsyncValidation error', error);
                }
            }, asyncValidationDebounce);
        },
        [
            asyncValidationFn,
            asyncValidationDebounce,
            validationState,
            schema,
            fieldPath,
            registerAsyncValidation,
            registerAsyncError
        ]
    );

    // Determine input type and base classes
    const inputType = isCheckbox ? 'checkbox' : 'input';
    const baseClasses = mergedStyles.field?.[inputType as keyof typeof mergedStyles.field];

    // Only apply validation state classes if we're not using a UI library
    const shouldApplyStyles = shouldApplyInputStyles(uiLibrary);

    // Build state classes based on validation state
    const stateClasses = cn({
        [(mergedStyles.field?.isInvalid as string) || '']: shouldApplyStyles && validationState.hasError,
        [(mergedStyles.field?.isValid as string) || '']: shouldApplyStyles && !validationState.hasError,
        [(mergedStyles.field?.isLoading as string) || '']: shouldApplyStyles && validationState.isValidating
    });

    return {
        className: cn(baseClasses, stateClasses),
        ariaInvalid: validationState.hasError,
        ariaDescribedBy: `${fieldPath}-description`,
        hasAsyncError: validationState.hasError,
        asyncValidating: validationState.isValidating,
        asyncValidatingStarted: validationState.validatingStarted,
        asyncError: validationState.error,
        textWhenValidating,
        textWhenBeforeStartValidating,
        showValidationIcons,
        showLoadingSpinner,
        validate
    };
}
