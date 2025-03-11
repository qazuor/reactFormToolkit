import { createContext, useContext } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { FormContextValue } from '../types/form';

/**
 * Context for the form state and methods.
 * The default value is null and will be overridden by the FormProvider.
 */
// biome-ignore lint/suspicious/noExplicitAny: Context needs to be generic
export const FormContext = createContext<FormContextValue<any> | null>(null);

/**
 * Hook to access the form context.
 * This hook must be used within a FormProvider.
 *
 * @template TFieldValues - The type of the form values
 * @returns The form context value
 * @throws Error if used outside a FormProvider
 *
 * @example
 * ```tsx
 * function SubmitButton() {
 *   const { form } = useFormContext();
 *   const { formState: { isSubmitting } } = form;
 *
 *   return (
 *     <button type="submit" disabled={isSubmitting}>
 *       {isSubmitting ? 'Submitting...' : 'Submit'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useFormContext<TFieldValues extends FieldValues>(): FormContextValue<TFieldValues> {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }

    return context as FormContextValue<TFieldValues>;
}
