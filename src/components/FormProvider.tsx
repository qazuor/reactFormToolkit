import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { type JSX, useMemo } from 'react';
import { type DefaultValues, type FieldValues, FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { FormContext } from '../context/FormContext';
import { defaultStyles } from '../styles/defaultStyles';
import type { FormProviderProps } from '../types/form';

/**
 * FormProvider component that wraps the form and provides context to child components.
 *
 * @template TFieldValues - The type of the form values
 * @param props - The component props
 * @returns JSX element
 *
 * @example
 * \`\`\`tsx
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
 * \`\`\`
 */
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

    /**
     * Handle form submission
     *
     * @param data - The form data
     * @param event - The form event
     */
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
