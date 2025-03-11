import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { type JSX, useMemo } from 'react';
import { type DefaultValues, type FieldValues, FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { FormContext } from '../context/FormContext';
import { defaultStyles } from '../styles/defaultStyles';
import type { FormProviderProps } from '../types/form';

export function FormProvider<TFieldValues extends FieldValues>({
    children,
    onSubmit,
    schema,
    defaultValues,
    className,
    form: externalForm,
    resetOnSubmit = false,
    styles
}: FormProviderProps<TFieldValues>): JSX.Element {
    // Create the form instance
    const internalForm = useForm<TFieldValues>({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: defaultValues as DefaultValues<TFieldValues>,
        mode: 'onBlur'
    });

    // Use external form if provided, otherwise use the internal form
    const form = useMemo(() => {
        return externalForm || internalForm;
    }, [externalForm, internalForm]);

    const {
        handleSubmit,
        formState: { errors },
        reset
    } = form;

    const handleFormSubmit = async (data: TFieldValues, event?: React.BaseSyntheticEvent) => {
        await onSubmit(data, event);
        if (resetOnSubmit) {
            reset(defaultValues as DefaultValues<TFieldValues>);
        }
    };

    const formStyles = styles?.form || defaultStyles.form;

    return (
        <FormContext.Provider value={{ form, errors, styles: styles?.field || defaultStyles.field }}>
            <RHFFormProvider {...form}>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className={`${formStyles} ${className || ''}`}
                    noValidate={true}
                >
                    {children}
                </form>
            </RHFFormProvider>
        </FormContext.Provider>
    );
}
