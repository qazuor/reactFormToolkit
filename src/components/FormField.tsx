import type React from 'react';
import { cloneElement, isValidElement, useEffect, useState } from 'react';
import { Controller, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { JSX } from 'react/jsx-runtime';
import { useFormContext } from '../context/FormContext';
import { useDebounce } from '../hooks';
import type { FormFieldProps } from '../types';

/**
 * FormField component for rendering form fields with labels, validation, and error messages.
 *
 * @template TFieldValues - The type of the form values
 * @template TName - The name of the field (must be a key of TFieldValues)
 * @param props - The component props
 * @returns JSX element
 *
 * @example
 * ```tsx
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
 *
 * // With async validation
 * <FormField
 *   name="username"
 *   label="Username"
 *   asyncValidate={async (value) => {
 *     // Check if username is available
 *     const response = await checkUsernameAvailability(value);
 *     return response.available || "Username is already taken";
 *   }}
 *   debounceTime={500}
 * >
 *   <input type="text" />
 * </FormField>
 * ```
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
    rules,
    asyncValidate,
    debounceTime = 500
}: FormFieldProps<TFieldValues, TName>): JSX.Element {
    const { form, errors, styles } = useFormContext<TFieldValues>();
    const error = errors[name];
    const errorMessage = error?.message as string | undefined;
    const { t } = useTranslation();
    const requiredMark = t('field.requiredMark', { defaultValue: '*' });
    const [isValidating, setIsValidating] = useState(false);
    const [fieldValue, setFieldValue] = useState<string>('');
    const debouncedValue = useDebounce(fieldValue, debounceTime);

    // Set up async validation
    useEffect(() => {
        if (asyncValidate && debouncedValue !== '') {
            const validateField = async () => {
                setIsValidating(true);
                try {
                    const result = await asyncValidate(debouncedValue);
                    if (typeof result === 'string') {
                        form.setError(name, { type: 'validate', message: result });
                    } else if (result) {
                        form.clearErrors(name);
                    } else {
                        form.setError(name, { type: 'validate', message: 'Validation failed' });
                    }
                } catch (_error) {
                    form.setError(name, { type: 'validate', message: 'Validation error' });
                } finally {
                    setIsValidating(false);
                }
            };

            validateField();
        }
    }, [debouncedValue, asyncValidate, form, name]);

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

    // Combine rules with required validation
    const combinedRules: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    > = {
        ...(required ? { required: 'This field is required' } : {}),
        ...rules
    };

    if (asyncValidate) {
        // If asyncValidate is provided, add it to the validation rules
        combinedRules.validate = {
            ...combinedRules.validate,
            async asyncValidator(value: unknown) {
                // Skip empty values (unless required, which is handled separately)
                if (!(value || required)) {
                    return true;
                }

                // Return true here as the actual validation happens in the useEffect
                return true;
            }
        };
    }

    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`${styles.label} ${labelClassName || ''}`}
                >
                    {label}
                    {required && <span className={styles.requiredMark}>{requiredMark}</span>}
                    {isValidating && (
                        <span className={styles.validating || 'ml-2 text-gray-500 text-xs'}>
                            {t('field.validating', { defaultValue: 'Validating...' })}
                        </span>
                    )}
                </label>
            )}

            <Controller
                control={form.control}
                name={name}
                rules={combinedRules}
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
                                if (asyncValidate) {
                                    setFieldValue(e.target.value);
                                    setIsValidating(true);
                                }
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
