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
    className,
    labelClassName,
    descriptionClassName,
    errorClassName,
    required = false,
    rules
}: FormFieldProps<TFieldValues, TName>): JSX.Element {
    const { form, errors, styles } = useFormContext<TFieldValues>();
    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    const fieldType = isValidElement(children) ? children.type : 'input';

    const getFieldStyle = () => {
        if (fieldType === 'select') {
            return styles.select;
        }
        if (fieldType === 'textarea') {
            return styles.textarea;
        }
        if (fieldType === 'input' && isValidElement(children) && children.props.type === 'checkbox') {
            return styles.checkbox;
        }
        return styles.input;
    };

    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`${styles.label} ${labelClassName || ''}`}
                >
                    {label}
                    {required && <span className={styles.requiredMark}>*</span>}
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
                            ...children.props,
                            ...field,
                            value: field.value ?? '',
                            id: name,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                field.onChange(e);
                                if (children.props.onChange) {
                                    children.props.onChange(e);
                                }
                            },
                            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                field.onBlur();
                                if (children.props.onBlur) {
                                    children.props.onBlur(e);
                                }
                            },
                            'aria-invalid': !!error,
                            'aria-describedby': description ? `${name}-description` : undefined,
                            className: `${getFieldStyle()} ${children.props.className || ''}`
                        });
                    }
                    return <></>;
                }}
            />

            {description && (
                <p
                    id={`${name}-description`}
                    className={`${styles.description} ${descriptionClassName || ''}`}
                >
                    {description}
                </p>
            )}

            {errorMessage && (
                <p
                    className={`${styles.error} ${errorClassName || ''}`}
                    role='alert'
                >
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
