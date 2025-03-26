import { FormFieldContext, useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useFieldState, useFieldValidation } from '@/hooks';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import type { FormFieldProps } from '@/types';
import { type ReactElement, isValidElement, useContext, useEffect, useMemo, useRef } from 'react';
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
    const { form, schema, styleOptions: providerStyles, errorDisplayOptions: providerErrorOptions } = useFormContext();
    const childRef = useRef<HTMLInputElement>(null);
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

    // const renderChildElement = (field: ControllerRenderProps<TFieldValues, string>): ReactElement => {
    //     // Filter out non-DOM props
    //     const { tooltipPosition, errorDisplay, ...childProps } = children.props;

    //     const fieldProps = {
    //         ...childProps,
    //         ...field,
    //         ...(isCheckbox ? { checked: !!field.value } : {}),
    //         className,
    //         value: isCheckbox ? field.value : (field.value ?? ''),
    //         id: fieldPath,
    //         'data-testid': fieldPath,
    //         'aria-invalid': ariaInvalid,
    //         'aria-describedby': description ? ariaDescribedBy : undefined
    //     };

    //     return cloneElement(children as ReactElement, {
    //         ...fieldProps,
    //         ref: childRef
    //     });
    // };
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
                            children={children}
                            form={form}
                            // setTouched={setTouched}
                            // validate={asyncValidate}
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
