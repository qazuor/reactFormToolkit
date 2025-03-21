import { FormFieldContext, useFormContext } from '@/context';
import { useFieldStatus } from '@/hooks';
import { cn, formUtils } from '@/lib';
import type { FormFieldProps } from '@/types';
import { type ReactElement, cloneElement, isValidElement, useMemo } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues as TFieldValues } from 'react-hook-form';
import { FieldDescription } from './FieldDescription';
import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

/**
 * FormField component for rendering form inputs with validation
 *
 * @param {FormFieldProps} props - Component props
 * @returns {ReactElement} Form field component
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
    children,
    description,
    descriptionOptions,
    tooltip,
    tooltipOptions
}: FormFieldProps): ReactElement {
    const { form, schema } = useFormContext();

    // Determine if field is required based on schema
    const isRequired = useMemo(() => required ?? formUtils.isFieldRequired(name, schema), [name, required, schema]);

    // Determine field type and properties
    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';
    const { hasError, error } = useFieldStatus(name);

    const contextValue = useMemo(
        () => ({
            name,
            form
        }),
        [name, form]
    );

    if (!isValidElement(children)) {
        return <></>;
    }

    /**
     * Renders the child element with the field properties
     */
    const renderChildElement = (field: ControllerRenderProps<TFieldValues, string>): ReactElement => {
        // Properties specific to checkboxes
        const checkboxProps = isCheckbox ? { checked: !!field.value } : {};
        const baseClasses = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors';
        const stateClasses = cn({
            'border-red-300 focus:border-red-500 focus:ring-red-500': hasError,
            'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !hasError,
            'cursor-not-allowed bg-gray-50 text-gray-500': field.disabled
        });

        // Filter out non-DOM props to avoid React warnings
        const { tooltipPosition, errorDisplay, ...childProps } = children.props;

        return cloneElement(children, {
            ...childProps,
            ...field,
            ...checkboxProps,
            className: cn(baseClasses, stateClasses, children.props.className),
            value: isCheckbox ? field.value : (field.value ?? ''),
            id: name,
            'data-testid': name,
            'aria-invalid': !!error,
            'aria-describedby': description ? descriptionOptions?.id || `${name}-description` : undefined
        });
    };

    return (
        <div className='space-y-2'>
            <FormFieldContext.Provider value={contextValue}>
                {description && descriptionOptions?.position === 'above' && (
                    <FieldDescription
                        id={descriptionOptions?.id || `${name}-description`}
                        position='above'
                        className={descriptionOptions?.className}
                        role={descriptionOptions?.role}
                        aria-label={descriptionOptions?.['aria-label']}
                    >
                        {description}
                    </FieldDescription>
                )}
                {label && (
                    <FieldLabel
                        htmlFor={name}
                        required={isRequired}
                        tooltip={tooltip}
                        tooltipOptions={tooltipOptions}
                    >
                        {label}
                    </FieldLabel>
                )}
                <Controller
                    control={form.control}
                    name={name}
                    render={({ field }) => renderChildElement(field)}
                />
                <FieldError message={error?.message?.toString()} />
                {description && (!descriptionOptions?.position || descriptionOptions?.position === 'below') && (
                    <FieldDescription
                        id={descriptionOptions?.id || `${name}-description`}
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
