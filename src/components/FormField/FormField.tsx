import { FormFieldContext, useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useFieldStatus } from '@/hooks';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import type { FormFieldProps } from '@/types';
import { type ReactElement, cloneElement, isValidElement, useContext, useEffect, useMemo, useRef } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues as TFieldValues } from 'react-hook-form';
import { FieldDescription } from './FieldDescription';
import { FieldError } from './FieldError';
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
    const { form, schema, styleOptions: providerStyles, errorDisplayOptions: providerErrorOptions } = useFormContext();
    const childRef = useRef<HTMLElement>(null);
    const arrayContext = useContext(FieldArrayContext);

    const fieldPath = arrayContext ? `${arrayContext.name}.${arrayContext.index}.${name}` : name;

    const mergedErrorOptions = useMemo(
        () => ({
            ...providerErrorOptions,
            ...errorDisplayOptions
        }),
        [providerErrorOptions, errorDisplayOptions]
    );

    const mergedStyles = useMemo(
        () => mergeStyles(defaultStyles, providerStyles || {}, styleOptions as Record<string, string>),
        [providerStyles, styleOptions]
    );

    const isRequired = useMemo(
        () => required ?? formUtils.isFieldRequired(fieldPath, schema),
        [fieldPath, required, schema]
    );

    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';
    const { hasError, error, isTouched } = useFieldStatus(fieldPath);

    const {
        className,
        ariaInvalid,
        ariaDescribedBy,
        asyncError,
        hasAsyncError,
        asyncValidating,
        asyncValidatingStarted,
        showValidationIcons,
        showLoadingSpinner,
        textWhenValidating,
        textWhenBeforeStartValidating
    } = useFieldValidation({
        fieldPath,
        isCheckbox,
        mergedStyles,
        asyncValidation,
        schema
    });

    const displayError = asyncError || error?.message;

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
            if (fieldName === name && isTouched) {
                // Force revalidation when the field changes and has been touched
                form.trigger(name).catch(console.error);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, name, isTouched]);

    if (!isValidElement(children)) {
        return <></>;
    }

    const renderChildElement = (field: ControllerRenderProps<TFieldValues, string>): ReactElement => {
        // Filter out non-DOM props
        const { tooltipPosition, errorDisplay, ...childProps } = children.props;

        const fieldProps = {
            ...childProps,
            ...field,
            ...(isCheckbox ? { checked: !!field.value } : {}),
            className,
            value: isCheckbox ? field.value : (field.value ?? ''),
            id: fieldPath,
            'data-testid': fieldPath,
            'aria-invalid': ariaInvalid,
            'aria-describedby': description ? ariaDescribedBy : undefined
        };

        return cloneElement(children as ReactElement, {
            ...fieldProps,
            ref: childRef
        });
    };

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
                <Controller
                    control={form.control}
                    name={fieldPath}
                    render={({ field }) => {
                        const showError = !providerErrorOptions?.groupErrors && (hasError || !!asyncError);
                        const isAbove = mergedErrorOptions?.position === 'above';
                        const isRight = mergedErrorOptions?.position === 'right';

                        return (
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
                                    {renderChildElement(field)}
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
                        );
                    }}
                />
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
