import { createContext, useContext } from 'react';
import { FieldValues } from 'react-hook-form';
import { FormContextValue } from '../types/form';

/**
 * Context for sharing form state and methods
 */
export const FormContext = createContext<FormContextValue<any> | null>(null);

/**
 * Hook to access form context
 * @throws {Error} When used outside of FormProvider
 * @returns {FormContextValue} Form context value
 */
export function useFormContext<T extends FieldValues>(): FormContextValue<T> {
    const context = useContext(FormContext);
    
    if (!context) {
        throw new Error('useFormContext must be used within FormProvider');
    }
    
    return context as FormContextValue<T>;
}