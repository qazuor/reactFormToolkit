import type React from 'react';
import { cloneElement, isValidElement } from 'react';
import { Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import type { JSX } from 'react/jsx-runtime';
import { useFormContext } from '../context/FormContext';
import type { FormFieldProps } from '../types/form';

/**
 * FormField component for rendering form fields with labels, validation, and error messages.
 *
 * @template TFieldValues - The type of the form values
 * @template TName - The name of the field (must be a key of TFieldValues)
 * @param props - The component props
 * @returns JSX element
 *
 * @example
 * \`\`\`tsx
 * // Text input
 * <FormField name="name" label="Name" required>
 *   <input type="text" />
 * </FormField>
 *
 * // Email input with description
 * <FormField
 *   name="email"
 *   label="Email"
 *   description="We'll never share your email with anyone else."
 * >
 *   <input type="email" />
 * </FormField>
 *
 * // Select input
 * <FormField name="country" label="Country">
 *   <select>
 *     <option value="">Select a country</option>
 *     <option value="us">United States</option>
 *     <option value="ca">Canada</option>
 *   </select>
 * </FormField>
 *
 * // Checkbox
 * <FormField name="agreeToTerms">
 *   <div className="flex items-center">
 *     <input type="checkbox" />
 *     <span className="ml-2">I agree to the terms and conditions</span>
 *   </div>
 * </FormField>
 * \`\`\`
 */
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

    /**
     * Get the appropriate field style based on the field type
     *
     * @returns The CSS class for the field
     */
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
