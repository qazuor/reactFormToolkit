import { FormFieldContext, useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useFieldStatus } from '@/hooks';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import type { FormFieldProps } from '@/types';
import { type ReactElement, cloneElement, isValidElement, useContext, useMemo, useRef } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues as TFieldValues } from 'react-hook-form';
import { ValidationStatusIcon } from '../Icons';
import { FieldDescription } from './FieldDescription';
import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

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
    asyncValidationDebounce = 500,
    showValidationIcons = true,
    showLoadingSpinner = true,
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
    const { hasError, error } = useFieldStatus(fieldPath);

    const { className, ariaInvalid, ariaDescribedBy, asyncError, hasAsyncError, asyncValidating } = useFieldValidation({
        fieldPath,
        isCheckbox,
        mergedStyles,
        asyncValidation,
        asyncValidationDebounce,
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
                                    {showValidationIcons && asyncValidation && (
                                        <div className='items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3'>
                                            {asyncValidating && showLoadingSpinner && (
                                                <ValidationStatusIcon status='loading' />
                                            )}
                                            {!asyncValidating && hasAsyncError && (
                                                <ValidationStatusIcon status='error' />
                                            )}
                                            {!(asyncValidating || asyncError) && (
                                                <ValidationStatusIcon status='success' />
                                            )}
                                        </div>
                                    )}
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
