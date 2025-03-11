import type React from 'react';
import { cloneElement, isValidElement } from 'react';
import { Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import type { JSX } from 'react/jsx-runtime';
import { useFormContext } from '../context/FormContext';
import type { FormFieldProps } from '../types/form';

export function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    label,
    description,
    children,
    className = '',
    labelClassName = 'block text-sm font-medium text-gray-700 mb-1',
    descriptionClassName = 'mt-1 text-sm text-gray-500',
    errorClassName = 'mt-1 text-sm text-red-600',
    required = false,
    rules
}: FormFieldProps<TFieldValues, TName>): JSX.Element {
    const { form, errors } = useFormContext<TFieldValues>();
    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={name}
                    className={labelClassName}
                >
                    {label}
                    {required && <span className='ml-1 text-red-500'>*</span>}
                </label>
            )}

            <Controller
                control={form.control}
                name={name}
                rules={rules}
                render={({ field }) => {
                    // Clone the child element and pass the field props
                    if (isValidElement(children)) {
                        return cloneElement(children, {
                            id: name,
                            ...field,
                            ...children.props,
                            // Ensure onChange from react-hook-form is preserved
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                field.onChange(e);
                                if (children.props.onChange) {
                                    children.props.onChange(e);
                                }
                            },
                            // Ensure onBlur from react-hook-form is preserved
                            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                field.onBlur();
                                if (children.props.onBlur) {
                                    children.props.onBlur(e);
                                }
                            },
                            // Add aria attributes for accessibility
                            'aria-invalid': !!error,
                            'aria-describedby': description ? `${name}-description` : undefined
                        });
                    }
                    return <></>;
                }}
            />

            {description && (
                <p
                    id={`${name}-description`}
                    className={descriptionClassName}
                >
                    {description}
                </p>
            )}

            {errorMessage && (
                <p
                    className={errorClassName}
                    role='alert'
                >
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
