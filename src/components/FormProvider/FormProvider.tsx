import { TooltipProvider } from '@/components/ui/tooltip';
import { FormContext } from '@/context/FormContext';
import type { FormProviderProps, FormSchema } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { type DefaultValues, type FieldValues, type UseFormReturn, useForm } from 'react-hook-form';

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
    mode = 'onBlur',
    i18n: i18nOptions
}: FormProviderProps<TFieldValues>): JSX.Element {
    const form: UseFormReturn<TFieldValues> = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange' // Re-validate on change after submission
    });

    return (
        <TooltipProvider
            delayDuration={0}
            skipDelayDuration={0}
            disableHoverableContent={true}
        >
            <FormContext.Provider value={{ form: form as UseFormReturn<FieldValues> }}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate={true}
                >
                    {children}
                </form>
            </FormContext.Provider>
        </TooltipProvider>
    );
}
