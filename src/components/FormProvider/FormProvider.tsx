import { TooltipProvider } from '@/components/ui/tooltip';
import { FormContext } from '@/context/FormContext';
import { useQRFTTranslation } from '@/hooks';
import { i18nUtils } from '@/lib';
import type { FormProviderProps, FormSchema } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type JSX, useEffect } from 'react';
import { type DefaultValues, type FieldValues, type UseFormReturn, useForm } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import type { z } from 'zod';

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
export function FormProvider<
    TFieldValues extends FieldValues,
    TSchema extends FormSchema<z.ZodType<TFieldValues>> = FormSchema<z.ZodType<TFieldValues>>
>({
    children,
    schema,
    defaultValues,
    onSubmit,
    mode = 'onBlur',
    i18n: i18nOptions
}: FormProviderProps<TFieldValues>): JSX.Element {
    // Get i18n instance from context or create new one
    const { i18n: contextI18n } = useQRFTTranslation({ useSuspense: false });
    const i18n = i18nOptions?.i18n || contextI18n || i18nUtils.getI18nInstance();

    useEffect(() => {
        // Initialize i18n with current instance and any custom resources
        i18nUtils.initializeI18n({
            i18n,
            resources: i18nOptions?.resources,
            lng: i18nOptions?.lng
        });
    }, [i18nOptions, i18n]);

    const form: UseFormReturn<TFieldValues> = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange' // Re-validate on change after submission
    });

    return (
        <I18nextProvider i18n={i18n}>
            <TooltipProvider
                delayDuration={0}
                skipDelayDuration={0}
                disableHoverableContent={true}
            >
                <FormContext.Provider value={{ form: form as UseFormReturn<FieldValues>, schema: schema as TSchema }}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        noValidate={true}
                    >
                        {children}
                    </form>
                </FormContext.Provider>
            </TooltipProvider>
        </I18nextProvider>
    );
}
