import { FormFieldContext, useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useFieldState, useFieldValidation, useQRFTTranslation } from '@/hooks';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import { getUiLibraryCompatibleStyles } from '@/lib/ui-library';
import type { FormFieldProps } from '@/types';
import { type ReactElement, isValidElement, useContext, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
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
    dependsOn,
    dependencyUpdateCallback,
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
    const { t } = useQRFTTranslation();
    const childRef = useRef<HTMLInputElement>(null);
    const arrayContext = useContext(FieldArrayContext);
    const previousValueRef = useRef<unknown>();
    const [dependentOptions, setDependentOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    const fieldPath = arrayContext ? `${arrayContext.name}.${arrayContext.index}.${name}` : name;

    const mergedErrorOptions = useMemo(
        () => ({
            ...providerErrorOptions,
            ...errorDisplayOptions
        }),
        [providerErrorOptions, errorDisplayOptions]
    );

    // Get the appropriate base styles based on UI library configuration
    const mergedStyles = useMemo(() => {
        // If using a UI library, use the modified styles that don't style inputs
        const baseStyles = uiLibrary?.enabled ? getUiLibraryCompatibleStyles(defaultStyles) : defaultStyles;

        const filteredProviderStyles = uiLibrary?.enabled
            ? getUiLibraryCompatibleStyles(providerStyles)
            : providerStyles;
        return mergeStyles(baseStyles, filteredProviderStyles || {}, styleOptions as Record<string, string>);
    }, [uiLibrary, providerStyles, styleOptions]);

    const isRequired = useMemo(
        () => required ?? formUtils.isFieldRequired(fieldPath, schema),
        [fieldPath, required, schema]
    );

    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';
    const { error, isTouched, hasError } = useFieldState(fieldPath);

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

    const displayError = asyncError || error?.message;

    // Handle render function children
    const renderChildrenContent = (): ReactElement => {
        if (typeof children === 'function') {
            const fieldProps = {
                value: form.getValues(fieldPath),
                onChange: (value: unknown) => form.setValue(fieldPath, value),
                onBlur: () => form.trigger(fieldPath)
            };

            const rendered = children({
                field: fieldProps,
                options: dependentOptions,
                isLoading: isLoadingOptions
            });

            // Ensure we return a ReactElement
            if (!isValidElement(rendered)) {
                return <>{rendered}</>;
            }
            return rendered;
        }

        // Handle select fields with dependencies
        if (dependsOn && isValidElement(children) && children.type === 'select') {
            const selectProps = {
                ...children.props,
                disabled: isLoadingOptions || dependentOptions.length === 0,
                'aria-busy': isLoadingOptions,
                children: [
                    <option
                        key='placeholder'
                        value=''
                    >
                        {t('form.selectOption')}
                    </option>,
                    ...dependentOptions.map(({ value, label }) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>
                    ))
                ]
            };
            return React.cloneElement(children, selectProps);
        }

        // Ensure children is a ReactElement
        if (!isValidElement(children)) {
            return <>{children}</>;
        }
        return children;
    };

    // Create context value for field
    const contextValue = useMemo(
        () => ({
            name: fieldPath,
            form
        }),
        [fieldPath, form]
    );

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

    // Handle dependency updates
    useEffect(() => {
        if (dependsOn && dependencyUpdateCallback) {
            const subscription = form.watch((_value, { name: changedField }) => {
                if (changedField === dependsOn) {
                    const dependencyValue = form.getValues(dependsOn);
                    if (dependencyValue) {
                        setIsLoadingOptions(true);
                        dependencyUpdateCallback(dependencyValue)
                            .then((options) => {
                                setDependentOptions(options);
                                // Clear current value when dependency changes
                                form.setValue(name, '');
                                form.trigger(name).catch(console.error);
                            })
                            .catch(() => {
                                // Handle error
                                setDependentOptions([]);
                                form.setValue(name, '');
                                form.trigger(name).catch(console.error);
                            })
                            .finally(() => {
                                setIsLoadingOptions(false);
                            });
                    } else {
                        setDependentOptions([]);
                        form.setValue(name, '');
                        form.trigger(name).catch(console.error);
                    }
                }
            });

            return () => subscription.unsubscribe();
        }
    }, [dependsOn, dependencyUpdateCallback, form, name]);

    if (typeof children === 'function') {
        // For function children, we still want to render the field wrapper with label, description, etc.
        const showError = !providerErrorOptions?.groupErrors && (!!error || !!asyncError);
        const isAbove = mergedErrorOptions?.position === 'above';
        const isRight = mergedErrorOptions?.position === 'right';

        return (
            <div className={cn(mergedStyles.field?.wrapper)}>
                <FormFieldContext.Provider value={contextValue}>
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
                        {showError && isAbove && (
                            <FieldError
                                name={fieldPath}
                                message={displayError}
                                inputRef={childRef}
                                options={mergedErrorOptions}
                            />
                        )}

                        <div className={cn(isRight && 'flex items-center gap-2')}>
                            <Controller
                                control={form.control}
                                name={fieldPath}
                                render={({ field: rhfField }) => {
                                    const rendered = children({
                                        field: {
                                            value: rhfField.value,
                                            onChange: rhfField.onChange,
                                            onBlur: rhfField.onBlur
                                        },
                                        options: dependentOptions,
                                        isLoading: isLoadingOptions
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
                                                error={asyncError}
                                                textWhenValidating={textWhenValidating}
                                                textWhenBeforeStartValidating={textWhenBeforeStartValidating}
                                            />
                                        </>
                                    );
                                }}
                            />

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
    }

    const showError = !providerErrorOptions?.groupErrors && (!!error || !!asyncError);
    const isAbove = mergedErrorOptions?.position === 'above';
    const isRight = mergedErrorOptions?.position === 'right';

    return (
        <div className={cn(mergedStyles.field?.wrapper)}>
            <FormFieldContext.Provider value={contextValue}>
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
                    {showError && isAbove && (
                        <FieldError
                            name={fieldPath}
                            message={displayError}
                            inputRef={childRef}
                            options={mergedErrorOptions}
                        />
                    )}
                    <div className={cn(isRight && 'flex items-center gap-2')}>
                        <FieldInput
                            className={cn(mergedStyles.field?.input, className)}
                            ariaInvalid={ariaInvalid}
                            ariaDescribedBy={ariaDescribedBy}
                            childRef={childRef}
                            fieldPath={fieldPath}
                            name={name}
                            validate={validate}
                            children={renderChildrenContent()}
                            form={form}
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
}
