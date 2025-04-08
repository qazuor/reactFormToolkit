import { TooltipProvider } from '@/components/ui/tooltip';
import { FormContext, useAsyncValidationState } from '@/context/FormContext';
import { useQRFTTranslation } from '@/hooks';
import { defaultStyles, hasAsyncErrors, hasPendingValidations, i18nUtils, mergeStyles } from '@/lib';
import type { FormProviderProps, FormSchema } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    type Control,
    type DefaultValues,
    type FieldValues,
    type UseFormClearErrors,
    type UseFormGetValues,
    type UseFormRegister,
    type UseFormSetValue,
    type UseFormTrigger,
    type UseFormUnregister,
    type UseFormWatch,
    useForm
} from 'react-hook-form';
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
    defaultValues,
    onSubmit,
    mode = 'all',
    styleOptions,
    errorDisplayOptions,
    globalErrorOptions,
    uiLibrary,
    i18n: i18nOptions
}: FormProviderProps<TFieldValues>): JSX.Element {
    // Get i18n instance from context or create new one
    const { i18n: contextI18n } = useQRFTTranslation({ useSuspense: false });
    const i18nInstance = i18nOptions?.i18n || contextI18n || i18nUtils.getI18nInstance();

    const [formState, setFormState] = useState({
        isDirty: false,
        isSubmitting: false,
        isValid: false,
        isValidating: false,
        submitCount: 0,
        errors: {},
        touchedFields: {},
        dirtyFields: {}
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string>();
    const { asyncValidations, asyncErrors, registerAsyncValidation, registerAsyncError } = useAsyncValidationState();
    const previousFormStateRef = useRef({
        isDirty: false,
        isSubmitting: false,
        isValid: false,
        isValidating: false,
        submitCount: 0
    });

    const {
        formState: { isDirty, isSubmitting, isValid, isValidating, submitCount, errors, touchedFields, dirtyFields },
        watch: watchForm,
        reset: resetForm,
        control: controlForm,
        getValues: getValuesForm,
        trigger: triggerForm,
        setValue: setValueForm,
        clearErrors: clearErrorsForm,
        handleSubmit: handleSubmitForm,
        register: registerForm,
        unregister: unregisterForm
    } = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange', // Re-validate on change after submission
        shouldUnregister: false // Keep field values in form state when unmounted
    });

    const shouldUpdateFormState = useCallback(() => {
        const prev = previousFormStateRef.current;
        return (
            isDirty !== prev.isDirty ||
            isSubmitting !== prev.isSubmitting ||
            isValid !== prev.isValid ||
            isValidating !== prev.isValidating ||
            submitCount !== prev.submitCount
        );
    }, [isDirty, isSubmitting, isValid, isValidating, submitCount]);

    // si recibo external form usar los controles, states y demas de ahi
    // const form = externalForm || internalForm;

    // Subscribe to all form state changes
    useEffect(() => {
        const hasSomePendingValidations = hasPendingValidations(asyncValidations || {});
        const hasSomeAsyncErrors = hasAsyncErrors(asyncErrors || {});

        if (!shouldUpdateFormState()) {
            return;
        }

        previousFormStateRef.current = {
            isDirty,
            isSubmitting,
            isValid,
            isValidating,
            submitCount
        };

        setFormState({
            isDirty: isDirty,
            isSubmitting: isSubmitting,
            isValid: isValid && !hasSomeAsyncErrors,
            isValidating: isValidating || hasSomePendingValidations,
            submitCount: submitCount,
            errors: errors,
            touchedFields,
            dirtyFields
        });
    }, [
        shouldUpdateFormState,
        isDirty,
        isSubmitting,
        isValid,
        isValidating,
        touchedFields,
        dirtyFields,
        submitCount,
        errors,
        asyncErrors,
        asyncValidations
    ]);

    // Merge style options with defaults
    const mergedStyles = useMemo(() => mergeStyles(defaultStyles, styleOptions), [styleOptions]);

    useEffect(() => {
        // Initialize i18n with current instance and any custom resources
        i18nUtils.initializeI18n({
            i18n: i18nInstance,
            resources: i18nOptions?.resources,
            lng: i18nOptions?.lng
        });
    }, [i18nOptions, i18nInstance]);

    // Reset form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            resetForm(defaultValues as DefaultValues<TFieldValues>);
            setFormState({
                isDirty: false,
                isSubmitting: false,
                isValid: true,
                isValidating: false,
                submitCount: 0,
                errors: {},
                dirtyFields: {},
                touchedFields: {}
            });
        }
    }, [defaultValues, resetForm]);

    // Update grouped errors when form state changes
    useEffect(() => {
        if (errorDisplayOptions?.groupErrors) {
            const currentErrors = JSON.stringify(errors);
            const prevErrors = JSON.stringify(formErrors);

            if (currentErrors === prevErrors) {
                return;
            }

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
            setFormErrors(newErrors);
        }
    }, [formState.errors, errorDisplayOptions?.groupErrors]);

    const handleSubmit = useCallback(
        async (data: TFieldValues) => {
            const hasSomePendingValidations = hasPendingValidations(asyncValidations || {});
            const hasSomeAsyncErrors = hasAsyncErrors(asyncErrors || {});

            // If there are pending validations or async errors, do not submit
            if (hasSomePendingValidations || hasSomeAsyncErrors) {
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
        <I18nextProvider i18n={i18nInstance}>
            <TooltipProvider
                delayDuration={0}
                skipDelayDuration={0}
                disableHoverableContent={true}
            >
                <FormContext.Provider
                    value={{
                        form: {
                            watch: watchForm as UseFormWatch<FieldValues>,
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            control: controlForm as Control<FieldValues, any>,
                            getValues: getValuesForm as UseFormGetValues<FieldValues>,
                            trigger: triggerForm as UseFormTrigger<FieldValues>,
                            setValue: setValueForm as UseFormSetValue<FieldValues>,
                            clearErrors: clearErrorsForm as UseFormClearErrors<FieldValues>,
                            register: registerForm as UseFormRegister<FieldValues>,
                            unregister: unregisterForm as UseFormUnregister<FieldValues>
                        },
                        formState,
                        schema: schema as TSchema,
                        errorDisplayOptions,
                        styleOptions: mergedStyles,
                        uiLibrary,
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
                        onSubmit={handleSubmitForm(handleSubmit)}
                        noValidate={true}
                        onReset={(e) => {
                            e.preventDefault();
                            resetForm(defaultValues as DefaultValues<TFieldValues>);
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
                                errors={formErrors}
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
