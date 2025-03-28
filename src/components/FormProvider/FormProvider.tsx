import { TooltipProvider } from '@/components/ui/tooltip';
import { FormContext, useAsyncValidationState } from '@/context/FormContext';
import { useQRFTTranslation } from '@/hooks';
import { defaultStyles, i18nUtils, mergeStyles } from '@/lib';
import type { FormProviderProps, FormSchema } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { type DefaultValues, type FieldValues, type UseFormReturn, useForm } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import type { z } from 'zod';
import { GlobalError } from './GlobalError';
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
    globalErrorOptions,
    i18n: i18nOptions
}: FormProviderProps<TFieldValues>): JSX.Element {
    // Get i18n instance from context or create new one
    const { i18n: contextI18n } = useQRFTTranslation({ useSuspense: false });
    const i18n = i18nOptions?.i18n || contextI18n || i18nUtils.getI18nInstance();

    const [formState, setFormState] = useState({
        isDirty: false,
        isSubmitting: false,
        isValid: false,
        isValidating: false,
        submitCount: 0,
        errors: {}
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string>();
    const { asyncValidations, asyncErrors, registerAsyncValidation, registerAsyncError } = useAsyncValidationState();

    const internalForm = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange', // Re-validate on change after submission
        shouldUnregister: false // Keep field values in form state when unmounted
    });

    const form = externalForm || internalForm;

    // Subscribe to all form state changes
    useEffect(() => {
        const subscription = form.watch(() => {
            const currentState = form.formState;
            setFormState({
                isDirty: currentState.isDirty,
                isSubmitting: currentState.isSubmitting,
                isValid: currentState.isValid && !Object.keys(asyncErrors || {}).length,
                isValidating: currentState.isValidating || Object.values(asyncValidations || {}).some(Boolean),
                submitCount: currentState.submitCount,
                errors: currentState.errors
            });
        });

        return () => subscription.unsubscribe();
    }, [form, asyncErrors, asyncValidations]);

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

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues as DefaultValues<TFieldValues>);
            setFormState({
                isDirty: false,
                isSubmitting: false,
                isValid: true,
                isValidating: false,
                submitCount: 0,
                errors: {}
            });
        }
    }, [defaultValues, form]);

    // Update grouped errors when form state changes
    useEffect(() => {
        if (errorDisplayOptions?.groupErrors) {
            const newErrors: Record<string, string> = {};
            for (const [key, error] of Object.entries(formState.errors)) {
                if (
                    (error as { message?: string })?.message &&
                    typeof error === 'object' &&
                    error !== null &&
                    'message' in error
                ) {
                    newErrors[key] = (error as { message: string }).message.toString();
                }
            }
            setErrors(newErrors);
        }
    }, [formState.errors, errorDisplayOptions?.groupErrors]);

    const handleSubmit = useCallback(
        async (data: TFieldValues) => {
            // Check if any async validations are pending
            const hasPendingValidations = Object.entries(asyncValidations || {}).some(([_fieldName, isValidating]) => {
                // Only count fields that are actually validating
                return isValidating;
            });

            // Check if any async validations have errors
            const hasAsyncErrors = Object.entries(asyncErrors || {}).some(([_fieldName, hasError]) => {
                // Only count fields that has errors
                return hasError;
            });

            // If there are pending validations or async errors, do not submit
            if (hasPendingValidations || hasAsyncErrors) {
                return;
            }

            try {
                setGlobalError(undefined);
                const result = await onSubmit(data);
                if (result instanceof Error) {
                    setGlobalError(result.message);
                }
                return result;
            } catch (error) {
                setGlobalError(error instanceof Error ? error.message : t('form.submitError'));
            }
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
                        formState,
                        globalErrorOptions,
                        globalError,
                        setGlobalError,
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
                            setGlobalError(undefined);
                        }}
                    >
                        {globalErrorOptions?.position !== 'bottom' && (
                            <GlobalError
                                message={globalError || ''}
                                options={globalErrorOptions}
                            />
                        )}
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
                        {globalErrorOptions?.position === 'bottom' && (
                            <GlobalError
                                message={globalError || ''}
                                options={globalErrorOptions}
                            />
                        )}
                    </form>
                </FormContext.Provider>
            </TooltipProvider>
        </I18nextProvider>
    );
}
