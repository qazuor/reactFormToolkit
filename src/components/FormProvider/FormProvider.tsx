import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { type DefaultValues, type FieldValues, useForm } from 'react-hook-form';
import { FormContext } from '../../context/FormContext';
import type { FormProviderProps } from '../../types/form';

/**
 * FormProvider component for managing form state and validation
 *
 * @template T - Zod schema type
 * @param {FormProviderProps<T>} props - Component props
 * @returns {ReactElement} Form provider component
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8)
 * });
 *
 * function LoginForm() {
 *   return (
 *     <FormProvider
 *       schema={schema}
 *       onSubmit={(data) => console.log(data)}
 *     >
 *       <FormField name="email">
 *         <input type="email" />
 *       </FormField>
 *     </FormProvider>
 *   );
 * }
 * ```
 */
export function FormProvider<TFieldValues extends FieldValues>({
    children,
    schema,
    defaultValues,
    onSubmit,
    mode = 'onBlur'
}: FormProviderProps<TFieldValues>): JSX.Element {
    const form = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange' // Re-validate on change after submission
    });

    return (
        <FormContext.Provider value={{ form }}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate={true}
            >
                {children}
            </form>
        </FormContext.Provider>
    );
}
