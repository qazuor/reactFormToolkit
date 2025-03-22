import { TooltipProvider } from '@/components/ui/tooltip';
import { FormContext } from '@/context/FormContext';
import { QRFTTranslations } from '@/i18n/locales';
import { i18nUtils } from '@/lib';
import type { FormProviderProps, FormSchema } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type JSX, useEffect } from 'react';
import { type DefaultValues, type FieldValues, type UseFormReturn, useForm } from 'react-hook-form';
import { I18nextProvider, useTranslation } from 'react-i18next';
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
    let i18n = i18nOptions?.i18n;
    const { i18n: i18nInstance } = useTranslation('QRFT');
    if (!i18n) {
        i18n = i18nInstance;
    }

    useEffect(() => {
        // Always initialize with Zod translations and merge custom resources if provided
        const mergedOptions = {
            i18n,
            ...i18nOptions,
            resources: {
                ...QRFTTranslations,
                ...(i18nOptions?.resources || {})
            }
        };
        i18nUtils.initializeI18n(mergedOptions);
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
