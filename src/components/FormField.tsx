import type React from 'react';
import { cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';
import { Controller, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { JSX } from 'react/jsx-runtime';
import { useFormContext } from '../context/FormContext';
import { useDebounce } from '../hooks';
import type { FormFieldProps } from '../types';
import { FieldError } from './FieldError';
import { InfoTooltip } from './InfoTooltip';

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
 *
 * // With custom error display
 * <FormField
 *   name="password"
 *   label="Password"
 *   errorDisplay={{
 *     position: 'right',
 *     animation: 'shake',
 *     showIcon: true
 *   }}
 * >
 *   <input type="password" />
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
    debounceTime = 500,
    tooltip,
    tooltipPosition = 'top',
    errorDisplay
}: FormFieldProps<TFieldValues, TName>): JSX.Element {
    const { form, errors, styles, errorDisplay: globalErrorDisplay } = useFormContext<TFieldValues>();
    const error = errors[name];
    const errorMessage = error?.message as string | undefined;
    const { t } = useTranslation();
    const requiredMark = t('field.requiredMark', { defaultValue: '*' });
    const [isValidating, setIsValidating] = useState(false);
    const [fieldValue, setFieldValue] = useState<string>('');
    const debouncedValue = useDebounce(fieldValue, debounceTime);
    const [isValid, setIsValid] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorKey, setErrorKey] = useState(0); // Add a key to force error re-render

    // Merge global and field-specific error display settings
    const mergedErrorDisplay = useMemo(() => {
        // If global settings should override field settings
        if (globalErrorDisplay?.overrideFieldSettings) {
            return globalErrorDisplay;
        }

        // Otherwise, merge with field settings taking precedence
        return {
            ...globalErrorDisplay,
            ...errorDisplay
        };
    }, [globalErrorDisplay, errorDisplay]);

    // Watch form state for submission status
    useEffect(() => {
        const { isSubmitting: submitting } = form.formState;
        setIsSubmitting(submitting);
    }, [form.formState]);

    // Set up async validation
    useEffect(() => {
        if (asyncValidate && debouncedValue !== '') {
            setIsValidating(true);
            const validateField = async () => {
                try {
                    const result = await asyncValidate(debouncedValue);
                    if (typeof result === 'string') {
                        form.setError(name, { type: 'validate', message: result });
                        setIsValid(false);
                        // Force error animation to restart
                        setErrorKey((prev) => prev + 1);
                    } else if (result) {
                        form.clearErrors(name);
                        setIsValid(true);
                    } else {
                        form.setError(name, { type: 'validate', message: 'Validation failed' });
                        setIsValid(false);
                        // Force error animation to restart
                        setErrorKey((prev) => prev + 1);
                    }
                } catch (_error) {
                    form.setError(name, { type: 'validate', message: 'Validation error' });
                    setIsValid(false);
                    // Force error animation to restart
                    setErrorKey((prev) => prev + 1);
                } finally {
                    setIsValidating(false);
                }
            };

            validateField();
        }
    }, [debouncedValue, asyncValidate, form, name]);

    // Update validation state when field value changes or when errors change
    useEffect(() => {
        const subscription = form.watch((value, { name: fieldName }) => {
            if (fieldName === name || !fieldName) {
                const fieldValue = value[name];

                // Actualizar el estado de validez basado en la presencia de errores
                if (isTouched) {
                    if (errors[name]) {
                        if (isValid) {
                            setIsValid(false);
                            setErrorKey((prev) => prev + 1); // Reiniciar animación
                        }
                    } else if (!isValid && fieldValue) {
                        setIsValid(true);
                    }
                }
            }
        });

        // Verificar el estado actual de errores
        if (isTouched) {
            const currentValue = form.getValues(name);
            const hasError = !!errors[name];

            if (hasError && isValid) {
                setIsValid(false);
            } else if (!(hasError || isValid) && currentValue) {
                setIsValid(true);
            }
        }

        return () => subscription.unsubscribe();
    }, [form, name, errors, isTouched, isValid]);

    // Force error animation to restart when error message changes
    useEffect(() => {
        if (errorMessage) {
            setErrorKey((prev) => prev + 1);
        }
    }, [errorMessage]);

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

    // Determine if we should show validation indicators
    const showValidIndicator = isTouched && isValid && !isValidating && !errorMessage && !isSubmitting;
    const showInvalidIndicator = isTouched && !isValid && !isValidating && errorMessage && !isSubmitting;
    const showLoadingIndicator = isValidating || isSubmitting;
    // Determine if we should show the error message based on groupErrors setting
    const showErrorMessage = errorMessage && !mergedErrorDisplay.groupErrors;

    // Render description based on position
    const renderDescription = () => {
        if (!description) {
            return null;
        }

        return (
            <p
                id={`${name}-description`}
                className={`${styles.description} ${descriptionClassName || ''}`}
            >
                {description}
            </p>
        );
    };

    // Check if error position is right
    const isRightErrorPosition = mergedErrorDisplay?.position === 'right';
    const isTooltipErrorPosition = mergedErrorDisplay?.position === 'tooltip';

    // Create a unique key for the error component to force animation re-render
    const errorComponentKey = `${name}-error-${errorKey}`;

    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`${styles.label} ${labelClassName || ''}`}
                >
                    {label}
                    {required && <span className={styles.requiredMark}>{requiredMark}</span>}
                    {tooltip && (
                        <InfoTooltip
                            content={tooltip}
                            position={tooltipPosition}
                        />
                    )}
                    {isValidating && (
                        <span className={styles.validating || 'ml-2 text-gray-500 text-xs'}>
                            {t('field.validating', { defaultValue: 'Validating...' })}
                        </span>
                    )}
                </label>
            )}

            {/* Render error message based on position */}
            {(() => {
                const position = mergedErrorDisplay?.position || 'bottom';

                // For top position, render before the input
                if (position === 'top') {
                    return (
                        <>
                            <FieldError
                                key={errorComponentKey}
                                name={name}
                                errorMessage={errorMessage}
                                showError={!!showErrorMessage}
                                errorDisplay={mergedErrorDisplay}
                                className={errorClassName}
                                isGrouped={mergedErrorDisplay?.groupErrors}
                            />
                            {/* For top position, render description before input */}
                            {renderDescription()}
                        </>
                    );
                }

                return null;
            })()}

            {/* For right error position, wrap input and error in a flex container */}
            {isRightErrorPosition ? (
                <div className='flex items-center'>
                    <div className='relative'>
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
                                            setIsTouched(true);
                                            // No establecemos manualmente la validez aquí, dejamos que el sistema de validación lo maneje
                                            if (children.props.onBlur) {
                                                children.props.onBlur(e);
                                            }
                                        },
                                        'aria-invalid': !!error,
                                        'aria-describedby': description ? `${name}-description` : undefined,
                                        className: `${getFieldStyle()} ${children.props.className || ''} ${
                                            errorMessage ? 'border-red-500' : ''
                                        } ${isValid && isTouched ? 'border-green-500' : ''} ${
                                            isRightErrorPosition ? 'inline-block w-auto' : ''
                                        }`
                                    });
                                }
                                return <></>;
                            }}
                        />

                        {/* Validation indicators */}
                        {showValidIndicator && (
                            <span
                                className={
                                    styles.valid ||
                                    '-translate-y-1/2 absolute top-1/2 right-3 animate-fadeIn text-green-500'
                                }
                                aria-hidden='true'
                                data-testid='valid-indicator'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <title>{t('field.valid', { defaultValue: 'Valid' })}</title>
                                    <path d='M20 6L9 17l-5-5' />
                                </svg>
                            </span>
                        )}

                        {showInvalidIndicator && (
                            <span
                                className={
                                    styles.invalid ||
                                    '-translate-y-1/2 absolute top-1/2 right-3 animate-fadeIn text-red-500'
                                }
                                aria-hidden='true'
                                data-testid='invalid-indicator'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <title>{t('field.invalid', { defaultValue: 'Invalid' })}</title>
                                    <line
                                        x1='18'
                                        y1='6'
                                        x2='6'
                                        y2='18'
                                    />
                                    <line
                                        x1='6'
                                        y1='6'
                                        x2='18'
                                        y2='18'
                                    />
                                </svg>
                            </span>
                        )}

                        {showLoadingIndicator && (
                            <span
                                className={
                                    styles.loading ||
                                    '-translate-y-1/2 absolute top-1/2 right-3 animate-spin text-gray-400'
                                }
                                aria-hidden='true'
                                data-testid='loading-indicator'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <title>{t('field.loading', { defaultValue: 'Loading' })}</title>
                                    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                                </svg>
                            </span>
                        )}
                    </div>

                    {/* For right position, render error after input */}
                    <FieldError
                        key={errorComponentKey}
                        name={name}
                        errorMessage={errorMessage}
                        showError={!!showErrorMessage}
                        errorDisplay={mergedErrorDisplay}
                        className={errorClassName}
                        isGrouped={mergedErrorDisplay?.groupErrors}
                    />
                </div>
            ) : (
                <div className={`relative ${isTooltipErrorPosition ? 'group' : ''}`}>
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
                                        setIsTouched(true);
                                        // No establecemos manualmente la validez aquí, dejamos que el sistema de validación lo maneje
                                        if (children.props.onBlur) {
                                            children.props.onBlur(e);
                                        }
                                    },
                                    'aria-invalid': !!error,
                                    'aria-describedby': description ? `${name}-description` : undefined,
                                    className: `${getFieldStyle()} ${children.props.className || ''} ${
                                        errorMessage ? 'border-red-500' : ''
                                    } ${isValid && isTouched ? 'border-green-500' : ''}`
                                });
                            }
                            return <></>;
                        }}
                    />

                    {/* Render error message for tooltip position */}
                    {isTooltipErrorPosition && (
                        <FieldError
                            key={errorComponentKey}
                            name={name}
                            errorMessage={errorMessage}
                            showError={!!showErrorMessage}
                            errorDisplay={mergedErrorDisplay}
                            className={errorClassName}
                            isGrouped={mergedErrorDisplay?.groupErrors}
                        />
                    )}

                    {/* Validation indicators */}
                    {showValidIndicator && (
                        <span
                            className={
                                styles.valid ||
                                '-translate-y-1/2 absolute top-1/2 right-3 animate-fadeIn text-green-500'
                            }
                            aria-hidden='true'
                            data-testid='valid-indicator'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <title>{t('field.valid', { defaultValue: 'Valid' })}</title>
                                <path d='M20 6L9 17l-5-5' />
                            </svg>
                        </span>
                    )}

                    {showInvalidIndicator && (
                        <span
                            className={
                                styles.invalid ||
                                '-translate-y-1/2 absolute top-1/2 right-3 animate-fadeIn text-red-500'
                            }
                            aria-hidden='true'
                            data-testid='invalid-indicator'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <title>{t('field.invalid', { defaultValue: 'Invalid' })}</title>
                                <line
                                    x1='18'
                                    y1='6'
                                    x2='6'
                                    y2='18'
                                />
                                <line
                                    x1='6'
                                    y1='6'
                                    x2='18'
                                    y2='18'
                                />
                            </svg>
                        </span>
                    )}

                    {showLoadingIndicator && (
                        <span
                            className={
                                styles.loading || '-translate-y-1/2 absolute top-1/2 right-3 animate-spin text-gray-400'
                            }
                            aria-hidden='true'
                            data-testid='loading-indicator'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <title>{t('field.loading', { defaultValue: 'Loading' })}</title>
                                <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                            </svg>
                        </span>
                    )}
                </div>
            )}

            {/* Render description for positions other than top */}
            {(() => {
                const position = mergedErrorDisplay?.position || 'bottom';

                if (position !== 'top') {
                    // For bottom position, render description before error
                    if (position === 'bottom' && description) {
                        return renderDescription();
                    }

                    // For other positions, render description after input
                    if (position === 'right' && description) {
                        return renderDescription();
                    }
                }

                return null;
            })()}

            {/* Render error message for bottom position */}
            {(() => {
                const position = mergedErrorDisplay?.position || 'bottom';

                if (position === 'bottom') {
                    return (
                        <FieldError
                            key={errorComponentKey}
                            name={name}
                            errorMessage={errorMessage}
                            showError={!!showErrorMessage}
                            errorDisplay={mergedErrorDisplay}
                            className={errorClassName}
                            isGrouped={mergedErrorDisplay?.groupErrors}
                        />
                    );
                }

                return null;
            })()}
        </div>
    );
}
