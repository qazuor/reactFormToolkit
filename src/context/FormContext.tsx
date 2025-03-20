import type { FormContextValue } from '@/types/form';
import { createContext, useContext } from 'react';
import type { FieldValues } from 'react-hook-form';

/**
 * Context for sharing form state and methods
 */
export const FormContext = createContext<FormContextValue | null>(null);

/**
 * Hook to access form context
 * @throws {Error} When used outside of FormProvider
 * @returns {FormContextValue} Form context value
 */
export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): FormContextValue<TFieldValues> {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('useFormContext must be used within FormProvider');
    }

    return context as FormContextValue<TFieldValues>;
}
