import { useFormContext } from '@/context/FormContext';
import type { FormFieldProps } from '@/types/form';
import { type ReactElement, cloneElement, isValidElement } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues as TFieldValues } from 'react-hook-form';

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
export function FormField({ name, label, required = false, children, description }: FormFieldProps): ReactElement {
    // Determine field type and properties
    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';

    const { form } = useFormContext();
    const {
        formState: { errors }
    } = form;
    const error = errors[name];

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
        <div>
            {label && (
                <label htmlFor={name}>
                    {label}
                    {required && <span>*</span>}
                </label>
            )}
            <Controller
                control={form.control}
                name={name}
                render={({ field }) => renderChildElement(field)}
            />
            {error && <p>{error.message?.toString()}</p>}
        </div>
    );
}
