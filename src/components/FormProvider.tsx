'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { type JSX, useMemo } from 'react';
import { type DefaultValues, type FieldValues, FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { FormContext } from '../context/FormContext';
import type { FormProviderProps } from '../types/form';

export function FormProvider<TFieldValues extends FieldValues>({
    children,
    onSubmit,
    schema,
    defaultValues,
    className,
    form: externalForm,
    resetOnSubmit = false
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

    return (
        <FormContext.Provider value={{ form, errors }}>
            <RHFFormProvider {...form}>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className={className}
                    noValidate={true}
                >
                    {children}
                </form>
            </RHFFormProvider>
        </FormContext.Provider>
    );
}
