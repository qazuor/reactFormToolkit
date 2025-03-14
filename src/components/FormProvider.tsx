import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { type DefaultValues, type FieldValues, FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FormContext } from '../context/FormContext';
import { initI18n } from '../i18n';
import { defaultStyles } from '../styles/defaultStyles';
import type { FormProviderProps, TranslationResources } from '../types';
import { ErrorGroup } from './ErrorGroup';

/**
 * FormProvider component that wraps the form and provides context to child components.
 *
 * @template TFieldValues - The type of the form values
 * @param props - The component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * const formSchema = z.object({
 *   name: z.string().min(2, 'Name must be at least 2 characters'),
 *   email: z.string().email('Please enter a valid email address'),
 * });
 *
 * type FormValues = z.infer<typeof formSchema>;
 *
 * function MyForm() {
 *   const handleSubmit = (data: FormValues) => {
 *     console.log('Form submitted:', data);
 *   };
 *
 *   return (
 *     <FormProvider
 *       onSubmit={handleSubmit}
 *       schema={formSchema}
 *       defaultValues={{ name: '', email: '' }}
 *       errorDisplay={{ position: 'right', animation: 'shake' }}
 *     >
 *       <FormField name="name" label="Name">
 *         <input type="text" />
 *       </FormField>
 *
 *       <FormField name="email" label="Email">
 *         <input type="email" />
 *       </FormField>
 *
 *       <button type="submit">Submit</button>
 *     </FormProvider>
 *   );
 * }
 * ```
 */
export function FormProvider<TFieldValues extends FieldValues>({
    children,
    onSubmit,
    onError,
    schema,
    defaultValues,
    className,
    form: externalForm,
    resetOnSubmit = false,
    styles,
    i18n: i18nOptions,
    mode = 'onBlur',
    errorDisplay
}: FormProviderProps<TFieldValues>): JSX.Element {
    const { t } = useTranslation();
    // State for global error
    const [globalError, setGlobalErrorState] = useState<string | null>(null);

    // Default error display configuration
    const defaultErrorDisplay = {
        position: 'bottom' as const,
        animation: 'fade' as const,
        delay: 0,
        showIcon: true,
        groupErrors: false,
        maxErrors: Number.POSITIVE_INFINITY,
        autoDismiss: false,
        dismissAfter: 5000,
        overrideFieldSettings: false
    };

    // Merge default error display with user-provided options
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const mergedErrorDisplay = useMemo(
        () => ({
            ...defaultErrorDisplay,
            ...errorDisplay
        }),
        [errorDisplay]
    );

    // Create the form instance with improved validation
    const internalForm = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode,
        criteriaMode: 'all', // Show all validation criteria
        reValidateMode: 'onChange' // Re-validate on change after submission
    });

    // Use external form if provided, otherwise use the internal form
    const form = useMemo(() => {
        return externalForm || internalForm;
    }, [externalForm, internalForm]);

    // Initialize i18n if options are provided
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const i18nInstance = useMemo(() => {
        if (i18nOptions?.i18n) {
            return i18nOptions.i18n;
        }
        return initI18n(i18nOptions?.resources as TranslationResources, i18nOptions?.lng);
    }, [i18nOptions?.i18n]);

    // Update language when it changes
    useEffect(() => {
        if (i18nInstance && i18nOptions?.lng) {
            i18nInstance.changeLanguage(i18nOptions.lng);
        }
    }, [i18nInstance, i18nOptions?.lng]);

    // Update resources when they change
    useEffect(() => {
        if (i18nInstance && i18nOptions?.resources) {
            for (const lang of Object.keys(i18nOptions.resources)) {
                if (i18nOptions.resources?.[lang]?.translation) {
                    i18nInstance.addResourceBundle(
                        lang,
                        'translation',
                        i18nOptions.resources[lang].translation,
                        true,
                        true
                    );
                }
            }
        }
    }, [i18nInstance, i18nOptions?.resources]);

    const {
        handleSubmit,
        formState: { errors },
        reset
    } = form;

    const setGlobalError = useCallback((error: string | null) => {
        setGlobalErrorState(error);
    }, []);

    const clearGlobalError = useCallback(() => {
        setGlobalErrorState(null);
    }, []);

    /**
     * Handle form submission
     *
     * @param data - The form data
     * @param event - The form event
     */
    const handleFormSubmit = async (data: TFieldValues, event?: React.BaseSyntheticEvent) => {
        clearGlobalError();
        try {
            await onSubmit(data, event);
            if (resetOnSubmit) {
                reset(defaultValues as DefaultValues<TFieldValues>);
            }
        } catch (error) {
            // Set global error if submission fails
            if (error instanceof Error) {
                setGlobalError(error.message);
            } else if (typeof error === 'string') {
                setGlobalError(error);
            } else {
                setGlobalError(t('form.unexpectedError', { defaultValue: 'An unexpected error occurred' }));
            }
            // Call onError callback if provided
            if (onError) {
                onError(error);
            }
        }
    };

    const formStyles = styles?.form || defaultStyles.form;

    // Convert errors object to a format suitable for ErrorGroup
    const errorMessages = useMemo(() => {
        if (!errors) {
            return {};
        }

        return Object.entries(errors).reduce(
            (acc, [key, error]) => {
                if (error?.message) {
                    acc[key] = error.message as string;
                }
                return acc;
            },
            {} as Record<string, string>
        );
    }, [errors]);

    const contextValue = useMemo(
        () => ({
            form,
            errors,
            styles: styles?.field || defaultStyles.field,
            globalError,
            setGlobalError,
            clearGlobalError,
            errorDisplay: mergedErrorDisplay
        }),
        [form, errors, styles?.field, globalError, setGlobalError, clearGlobalError, mergedErrorDisplay]
    );

    return (
        <I18nextProvider i18n={i18nInstance}>
            <FormContext.Provider value={contextValue}>
                <RHFFormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className={`${formStyles} ${className || ''}`}
                        noValidate={true}
                        name={JSON.stringify(form.getValues())}
                    >
                        {children}

                        {/* Render grouped errors if enabled */}
                        {mergedErrorDisplay.groupErrors && Object.keys(errorMessages).length > 0 && (
                            <ErrorGroup
                                errors={errorMessages}
                                maxErrors={mergedErrorDisplay.maxErrors}
                                animation={mergedErrorDisplay.animation}
                            />
                        )}
                    </form>
                </RHFFormProvider>
            </FormContext.Provider>
        </I18nextProvider>
    );
}
