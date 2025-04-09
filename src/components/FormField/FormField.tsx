import { FormFieldContext, useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useFieldState, useFieldValidation } from '@/hooks';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import { getUiLibraryCompatibleStyles } from '@/lib/ui-library';
import type { FormFieldProps } from '@/types';
import { type ReactElement, isValidElement, useContext, useEffect, useMemo, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { FieldDescription } from './FieldDescription';
import { FieldError } from './FieldError';
import { FieldInput } from './FieldInput';
import { FieldLabel } from './FieldLabel';
import { FormFieldAsyncValidationIndicator } from './FormFieldAsyncValidationIndicator';

/**
 * FormField component for rendering form inputs with validation
 *
 * @param {FormFieldProps} props - Component props
 * @returns {ReactElement} Form f`ield component
 *
 * @example
 * ```tsx
 * <FormField name="email" label="Email Address" required>
 *   <input type="email" className="form-input" />
 * </FormField>
 * ```
 */
export function FormField({
    name,
    label,
    required,
    asyncValidation,
    children,
    description,
    descriptionOptions,
    tooltip,
    tooltipOptions,
    styleOptions,
    errorDisplayOptions
}: FormFieldProps): ReactElement {
    const {
        form,
        schema,
        styleOptions: providerStyles,
        errorDisplayOptions: providerErrorOptions,
        uiLibrary
    } = useFormContext();
    const childRef = useRef<HTMLInputElement>(null);
    const arrayContext = useContext(FieldArrayContext);
    const previousValueRef = useRef<unknown>();

    // Get the full field path considering array context
    const fieldPath = arrayContext ? `${arrayContext.name}.${arrayContext.index}.${name}` : name;

    // Merge error display options from provider and component
    const mergedErrorOptions = useMemo(
        () => ({
            ...providerErrorOptions,
            ...errorDisplayOptions
        }),
        [providerErrorOptions, errorDisplayOptions]
    );

    // Merge styles from default, provider, and component
    const mergedStyles = useMemo(() => {
        // If using a UI library, use the modified styles that don't style inputs
        const baseStyles = uiLibrary?.enabled ? getUiLibraryCompatibleStyles(defaultStyles) : defaultStyles;

        const filteredProviderStyles = uiLibrary?.enabled
            ? getUiLibraryCompatibleStyles(providerStyles)
            : providerStyles;
        return mergeStyles(baseStyles, filteredProviderStyles || {}, styleOptions as Record<string, string>);
    }, [uiLibrary, providerStyles, styleOptions]);

    // Determine if field is required from props or schema
    const isRequired = useMemo(
        () => required ?? formUtils.isFieldRequired(fieldPath, schema),
        [fieldPath, required, schema]
    );

    // Check if input is a checkbox
    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';
    const { error, isTouched, hasError } = useFieldState(fieldPath);

    // Get validation state and styles
    const {
        className,
        ariaInvalid,
        ariaDescribedBy,
        asyncError,
        asyncValidating,
        asyncValidatingStarted,
        hasAsyncError,
        showValidationIcons,
        showLoadingSpinner,
        textWhenValidating,
        textWhenBeforeStartValidating,
        validate
    } = useFieldValidation({
        fieldPath,
        isCheckbox,
        mergedStyles,
        asyncValidation,
        schema,
        hasError
    });

    // Combine async error with field error
    const displayError = asyncError || error?.message;

    // Create context value for field
    const contextValue = useMemo(
        () => ({
            name: fieldPath,
            form
        }),
        [fieldPath, form]
    );

    // Render the input element based on children type
    const renderInput = (): ReactElement => {
        if (typeof children === 'function') {
            // For function children, use Controller to handle field state
            return (
                <Controller
                    control={form.control}
                    name={fieldPath}
                    render={({ field: rhfField }) => {
                        const rendered = children({
                            field: {
                                value: rhfField.value,
                                onChange: rhfField.onChange,
                                onBlur: rhfField.onBlur
                            }
                        });

                        return (
                            <>
                                {rendered}
                                <FormFieldAsyncValidationIndicator
                                    showValidationIcons={showValidationIcons}
                                    isValidating={asyncValidating}
                                    showLoadingSpinner={showLoadingSpinner}
                                    asyncValidatingStarted={asyncValidatingStarted}
                                    hasError={hasAsyncError}
                                    error={asyncError || undefined}
                                    textWhenValidating={textWhenValidating}
                                    textWhenBeforeStartValidating={textWhenBeforeStartValidating}
                                />
                            </>
                        );
                    }}
                />
            );
        }

        // For regular children (React elements)
        // Ensure children is a ReactElement
        if (!isValidElement(children)) {
            return <>{children}</>;
        }

        return children;
    };

    // Render the field with all its parts (label, input, description, error)
    const renderField = () => {
        const showError = !providerErrorOptions?.groupErrors && (!!error || !!asyncError);
        const isAbove = mergedErrorOptions?.position === 'above';
        const isRight = mergedErrorOptions?.position === 'right';

        return (
            <div className={cn(mergedStyles.field?.wrapper)}>
                <FormFieldContext.Provider value={contextValue}>
                    {/* Description (above) */}
                    {description && descriptionOptions?.position === 'above' && (
                        <FieldDescription
                            id={descriptionOptions?.id || `${fieldPath}-description`}
                            position='above'
                            className={cn(mergedStyles.field?.description, descriptionOptions?.className)}
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
                        {showError && isAbove && (
                            <FieldError
                                name={fieldPath}
                                message={displayError}
                                inputRef={childRef}
                                options={mergedErrorOptions}
                            />
                        )}

                        <div className={cn(isRight && 'flex items-center gap-2')}>
                            {/* Input */}
                            {typeof children === 'function' ? (
                                renderInput()
                            ) : (
                                <>
                                    <FieldInput
                                        className={cn(mergedStyles.field?.input, className)}
                                        ariaInvalid={ariaInvalid}
                                        ariaDescribedBy={ariaDescribedBy}
                                        childRef={childRef}
                                        fieldPath={fieldPath}
                                        name={name}
                                        validate={validate}
                                        children={renderInput()}
                                        form={form}
                                        description={description}
                                    />
                                    <FormFieldAsyncValidationIndicator
                                        showValidationIcons={showValidationIcons}
                                        isValidating={asyncValidating}
                                        showLoadingSpinner={showLoadingSpinner}
                                        asyncValidatingStarted={asyncValidatingStarted}
                                        hasError={hasAsyncError}
                                        error={asyncError}
                                        textWhenValidating={textWhenValidating}
                                        textWhenBeforeStartValidating={textWhenBeforeStartValidating}
                                    />
                                </>
                            )}

                            {/* Error (right or below) */}
                            {showError && !isAbove && (
                                <FieldError
                                    name={fieldPath}
                                    message={displayError}
                                    inputRef={childRef}
                                    options={mergedErrorOptions}
                                />
                            )}
                        </div>
                    </div>

                    {/* Description (below) */}
                    {description && (!descriptionOptions?.position || descriptionOptions?.position === 'below') && (
                        <FieldDescription
                            id={descriptionOptions?.id || `${fieldPath}-description`}
                            position='below'
                            className={cn(mergedStyles.field?.description, descriptionOptions?.className)}
                            role={descriptionOptions?.role}
                            aria-label={descriptionOptions?.['aria-label']}
                        >
                            {description}
                        </FieldDescription>
                    )}
                </FormFieldContext.Provider>
            </div>
        );
    };

    // Effect to force revalidation when the value changes
    useEffect(() => {
        const subscription = form.watch((_value, { name: fieldName }) => {
            if (fieldName === name) {
                const currentValue = form.getValues(name);
                if (currentValue !== previousValueRef.current && isTouched) {
                    previousValueRef.current = currentValue;
                    // Force revalidation when the field changes and has been touched
                    form.trigger(name).catch(console.error);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form, name, isTouched]);

    // Return the unified field rendering
    return renderField();
}
