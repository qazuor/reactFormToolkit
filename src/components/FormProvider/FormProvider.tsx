import { TooltipProvider } from '@/components/ui/tooltip';
import { FormContext, useAsyncValidationState } from '@/context/FormContext';
import { useQRFTTranslation } from '@/hooks';
import { defaultStyles, i18nUtils, mergeStyles } from '@/lib';
import type { FormProviderProps, FormSchema } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { type DefaultValues, type FieldValues, type UseFormReturn, useForm } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import type { z } from 'zod';
import { GroupedErrors } from './GroupedErrors';

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
    form: externalForm,
    defaultValues,
    onSubmit,
    mode = 'onBlur',
    styleOptions,
    errorDisplayOptions,
    i18n: i18nOptions
}: FormProviderProps<TFieldValues>): JSX.Element {
    // Get i18n instance from context or create new one
    const { i18n: contextI18n } = useQRFTTranslation({ useSuspense: false });
    const i18n = i18nOptions?.i18n || contextI18n || i18nUtils.getI18nInstance();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const { asyncValidations, asyncErrors, registerAsyncValidation, registerAsyncError } = useAsyncValidationState();

    // Merge style options with defaults
    const mergedStyles = useMemo(() => mergeStyles(defaultStyles, styleOptions), [styleOptions]);

    useEffect(() => {
        // Initialize i18n with current instance and any custom resources
        i18nUtils.initializeI18n({
            i18n,
            resources: i18nOptions?.resources,
            lng: i18nOptions?.lng
        });
    }, [i18nOptions, i18n]);

    const internalForm = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange' // Re-validate on change after submission
    });

    const form = externalForm || internalForm;

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues as DefaultValues<TFieldValues>);
        }
    }, [defaultValues, form]);

    // Update grouped errors when form state changes
    useEffect(() => {
        if (errorDisplayOptions?.groupErrors) {
            const newErrors: Record<string, string> = {};
            for (const [key, error] of Object.entries(form.formState.errors)) {
                if (error?.message) {
                    newErrors[key] = error.message.toString();
                }
            }
            setErrors(newErrors);
        }
    }, [form.formState.errors, errorDisplayOptions?.groupErrors]);

    const handleSubmit = useCallback(
        async (data: TFieldValues) => {
            // Check if any async validations are pending
            const hasPendingValidations = Object.values(asyncValidations).some(Boolean);
            // Check if any async validations have errors
            const hasAsyncErrors = Object.values(asyncErrors).some(Boolean);

            if (hasPendingValidations || hasAsyncErrors) {
                return;
            }

            await onSubmit(data);
        },
        [onSubmit, asyncValidations, asyncErrors]
    );

    return (
        <I18nextProvider i18n={i18n}>
            <TooltipProvider
                delayDuration={0}
                skipDelayDuration={0}
                disableHoverableContent={true}
            >
                <FormContext.Provider
                    value={{
                        form: form as UseFormReturn<FieldValues>,
                        schema: schema as TSchema,
                        errorDisplayOptions,
                        styleOptions: mergedStyles,
                        asyncValidations,
                        asyncErrors,
                        registerAsyncValidation,
                        registerAsyncError
                    }}
                >
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        noValidate={true}
                        onReset={(e) => {
                            e.preventDefault();
                            form.reset(defaultValues as DefaultValues<TFieldValues>);
                        }}
                    >
                        {children}
                        {errorDisplayOptions?.groupErrors && (
                            <GroupedErrors
                                errors={errors}
                                maxErrors={errorDisplayOptions.maxErrors}
                                className={errorDisplayOptions.className}
                                animation={errorDisplayOptions.animation}
                                delay={errorDisplayOptions.delay}
                                autoDismiss={errorDisplayOptions.autoDismiss}
                                dismissAfter={errorDisplayOptions.dismissAfter}
                            />
                        )}
                    </form>
                </FormContext.Provider>
            </TooltipProvider>
        </I18nextProvider>
    );
}
