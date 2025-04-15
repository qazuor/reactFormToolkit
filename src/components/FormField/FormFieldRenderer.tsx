import { FormFieldContext } from '@/context';
import { cn } from '@/lib';
import type { FormFieldRendererProps } from '@/types';
import { type ReactElement, isValidElement, memo } from 'react';
import { Controller } from 'react-hook-form';
import { FieldDescription } from './FieldDescription';
import { FieldError } from './FieldError';
import { FieldInput } from './FieldInput';
import { FieldLabel } from './FieldLabel';
import { FormFieldAsyncValidationIndicator } from './FormFieldAsyncValidationIndicator';

/**
 * FormFieldRenderer component for rendering form field UI elements
 * This component handles only the rendering logic, separated from state management
 *
 * @param {FormFieldRendererProps} props - Component props
 * @returns {ReactElement} Rendered form field
 *
 * @example
 * ```tsx
 * <FormFieldRenderer
 *   fieldPath="email"
 *   name="email"
 *   label="Email Address"
 *   isRequired={true}
 *   children={<input type="email" />}
 *   // ...other props
 * />
 * ```
 */
export const FormFieldRenderer = memo(function FormFieldRenderer({
    fieldPath,
    name,
    label,
    isRequired,
    description,
    descriptionOptions,
    tooltip,
    tooltipOptions,
    children,
    showError,
    displayError,
    errorOptions,
    isErrorAbove,
    isErrorRight,
    childRef,
    contextValue,
    wrapperClassName,
    asyncValidationProps,
    inputProps
}: FormFieldRendererProps): ReactElement {
    // Render the input element based on children type
    const renderInput = (): ReactElement => {
        if (typeof children === 'function') {
            // This case is handled separately in the main render function
            // Just return a placeholder that will never be used
            return <></>;
        }

        // For regular children (React elements)
        // Ensure children is a ReactElement
        if (!isValidElement(children)) {
            return <>{children}</>;
        }

        return children;
    };

    return (
        <div className={wrapperClassName ? String(cn(wrapperClassName)) : undefined}>
            <FormFieldContext.Provider value={contextValue}>
                {/* Description (above) */}
                {description && descriptionOptions?.position === 'above' && (
                    <FieldDescription
                        id={descriptionOptions?.id || `${fieldPath}-description`}
                        position='above'
                        className={descriptionOptions?.className}
                        role={descriptionOptions?.role}
                        aria-label={descriptionOptions?.['aria-label']}
                    >
                        {description}
                    </FieldDescription>
                )}

                {/* Label */}
                {label && (
                    <FieldLabel
                        htmlFor={fieldPath}
                        required={isRequired}
                        tooltip={tooltip}
                        tooltipOptions={tooltipOptions}
                    >
                        {label}
                    </FieldLabel>
                )}

                <div className='relative'>
                    {/* Error (above) */}
                    {showError && isErrorAbove && (
                        <FieldError
                            name={fieldPath}
                            message={displayError}
                            inputRef={childRef}
                            options={errorOptions}
                        />
                    )}

                    <div className={cn(isErrorRight && 'flex items-center gap-2')}>
                        {/* Input */}
                        {typeof children === 'function' ? (
                            <Controller
                                control={contextValue.form.control}
                                name={fieldPath}
                                render={({ field: rhfField }) => {
                                    const rendered = children(
                                        {
                                            field: {
                                                value: rhfField.value,
                                                onChange: rhfField.onChange,
                                                onBlur: rhfField.onBlur
                                            }
                                        },
                                        undefined, // DependantValues
                                        {}, // StyleOptions,
                                        undefined // DependantFieldState
                                    );

                                    return (
                                        <>
                                            {rendered}
                                            <FormFieldAsyncValidationIndicator
                                                showValidationIcons={asyncValidationProps.showValidationIcons}
                                                isValidating={asyncValidationProps.isValidating}
                                                showLoadingSpinner={asyncValidationProps.showLoadingSpinner}
                                                asyncValidatingStarted={asyncValidationProps.asyncValidatingStarted}
                                                hasError={asyncValidationProps.hasError}
                                                error={asyncValidationProps.error}
                                                textWhenValidating={asyncValidationProps.textWhenValidating}
                                                textWhenBeforeStartValidating={
                                                    asyncValidationProps.textWhenBeforeStartValidating
                                                }
                                            />
                                        </>
                                    );
                                }}
                            />
                        ) : (
                            <>
                                <FieldInput
                                    className={inputProps.className}
                                    ariaInvalid={inputProps.ariaInvalid}
                                    ariaDescribedBy={inputProps.ariaDescribedBy}
                                    childRef={childRef}
                                    fieldPath={fieldPath}
                                    name={name}
                                    validate={inputProps.validate}
                                    children={renderInput()}
                                    form={contextValue.form}
                                    description={description}
                                />
                                <FormFieldAsyncValidationIndicator
                                    showValidationIcons={asyncValidationProps.showValidationIcons}
                                    isValidating={asyncValidationProps.isValidating}
                                    showLoadingSpinner={asyncValidationProps.showLoadingSpinner}
                                    asyncValidatingStarted={asyncValidationProps.asyncValidatingStarted}
                                    hasError={asyncValidationProps.hasError}
                                    error={asyncValidationProps.error}
                                    textWhenValidating={asyncValidationProps.textWhenValidating}
                                    textWhenBeforeStartValidating={asyncValidationProps.textWhenBeforeStartValidating}
                                />
                            </>
                        )}

                        {/* Error (right or below) */}
                        {showError && !isErrorAbove && (
                            <FieldError
                                name={fieldPath}
                                message={displayError}
                                inputRef={childRef}
                                options={errorOptions}
                            />
                        )}
                    </div>
                </div>

                {/* Description (below) */}
                {description && (!descriptionOptions?.position || descriptionOptions?.position === 'below') && (
                    <FieldDescription
                        id={descriptionOptions?.id || `${fieldPath}-description`}
                        position='below'
                        className={descriptionOptions?.className}
                        role={descriptionOptions?.role}
                        aria-label={descriptionOptions?.['aria-label']}
                    >
                        {description}
                    </FieldDescription>
                )}
            </FormFieldContext.Provider>
        </div>
    );
});
