import { createContext, useContext } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { FormContextValue } from '../types/form';

// Create a context with a default value that will be overridden
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const FormContext = createContext<FormContextValue<any> | null>(null);

export function useFormContext<TFieldValues extends FieldValues>(): FormContextValue<TFieldValues> {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }

    return context as FormContextValue<TFieldValues>;
}
