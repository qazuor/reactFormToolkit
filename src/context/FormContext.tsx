import type { FormContextValue, FormSchema } from '@/types';
import { createContext, useCallback, useContext, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { z } from 'zod';

interface AsyncValidationState {
    asyncValidations: Record<string, boolean>;
    asyncErrors: Record<string, boolean>;
    registerAsyncValidation: (fieldName: string, isValidating: boolean) => void;
    registerAsyncError: (fieldName: string, hasError: boolean) => void;
}

export function useAsyncValidationState(): AsyncValidationState {
    const [asyncValidations, setAsyncValidations] = useState<Record<string, boolean>>({});
    const [asyncErrors, setAsyncErrors] = useState<Record<string, boolean>>({});

    const registerAsyncValidation = useCallback((fieldName: string, isValidating: boolean) => {
        setAsyncValidations((prev) => ({
            ...prev,
            [fieldName]: isValidating
        }));
    }, []);

    const registerAsyncError = useCallback((fieldName: string, hasError: boolean) => {
        setAsyncErrors((prev) => ({
            ...prev,
            [fieldName]: hasError
        }));
    }, []);

    return {
        asyncValidations,
        asyncErrors,
        registerAsyncValidation,
        registerAsyncError
    };
}

/**
 * Context for sharing form state and methods
 */
export const FormContext = createContext<FormContextValue | null>(null);

/**
 * Hook to access form context
 * @throws {Error} When used outside of FormProvider
 * @returns {FormContextValue} Form context value
 */
export function useFormContext<
    TFieldValues extends FieldValues = FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
>(): FormContextValue<TFieldValues> {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('useFormContext must be used within FormProvider');
    }

    return context as FormContextValue<TFieldValues, TSchema>;
}
