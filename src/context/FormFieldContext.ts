import type { FormFieldContextValue } from '@/types';
import { useContext } from 'react';
import { createContext } from 'react';

/**
 * Context for sharing form fieldd state and methods
 */
export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * Hook to access form field context
 * @throws {Error} When used outside of FormProvider
 * @returns {FormContextValue} Form context value
 */
export function useFormField() {
    const context = useContext(FormFieldContext);

    if (!context) {
        throw new Error('useFormField must be used within a FormField');
    }

    return context;
}
