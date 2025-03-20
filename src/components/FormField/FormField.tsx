import { useFormContext } from '@/context/FormContext';
import { useFieldStatus } from '@/hooks/useFieldStatus';
import type { FormFieldProps } from '@/types/form';
import { type ReactElement, cloneElement, isValidElement } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues as TFieldValues } from 'react-hook-form';
import { FieldError } from './FieldError';
import { FieldInput } from './FieldInput';
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
    required = false,
    children,
    description,
    tooltip,
    tooltipOptions
}: FormFieldProps): ReactElement {
    // Determine field type and properties
    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';
    const { hasError, error } = useFieldStatus(name);

    const { form } = useFormContext();

    if (!isValidElement(children)) {
        return <></>;
    }

    /**
     * Renders the child element with the field properties
     */
    const renderChildElement = (field: ControllerRenderProps<TFieldValues, string>): ReactElement => {
        // Properties specific to checkboxes
        const checkboxProps = isCheckbox ? { checked: !!field.value } : {};

        // Filter out non-DOM props to avoid React warnings
        const { tooltipPosition, errorDisplay, ...childProps } = children.props;

        return cloneElement(children, {
            ...childProps,
            ...field,
            ...checkboxProps,
            value: isCheckbox ? field.value : (field.value ?? ''),
            id: name,
            'data-testid': name,
            'aria-invalid': !!error,
            'aria-describedby': description ? `${name}-description` : undefined
        });
    };

    return (
        <div className='space-y-2'>
            {label && (
                <FieldLabel
                    htmlFor={name}
                    required={required}
                    tooltip={tooltip}
                    tooltipOptions={tooltipOptions}
                >
                    {label}
                </FieldLabel>
            )}
            <Controller
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FieldInput
                        id={name}
                        hasError={hasError}
                        description={description}
                    >
                        {renderChildElement(field)}
                    </FieldInput>
                )}
            />
            <FieldError message={error?.message?.toString()} />
        </div>
    );
}
