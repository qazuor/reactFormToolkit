import type { FieldInputProps } from '@/types';
import type React from 'react';
import { type ReactElement, cloneElement, isValidElement } from 'react';
import {
    type ArrayPath,
    Controller,
    type ControllerRenderProps,
    type FieldValues,
    type Path,
    type PathValue
} from 'react-hook-form';

export function FieldInput<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues> | ArrayPath<TFieldValues>
>({
    fieldPath,
    name,
    children,
    form,
    description,
    validate,
    setTouched,
    childRef,
    className,
    ariaInvalid,
    ariaDescribedBy
}: FieldInputProps): ReactElement {
    const isCheckbox = isValidElement(children) && (children as ReactElement).props.type === 'checkbox';

    /**
     * Handles the onChange event for the field
     */
    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    ): Promise<void> => {
        const value = isCheckbox ? e.target.checked : e.target.value;

        // For checkboxes, use the checked value instead of the value
        if (isCheckbox) {
            form.setValue(name, value as PathValue<TFieldValues, TName>);
        } else {
            form.setValue(name, value as PathValue<TFieldValues, TName>);
        }

        // Trigger validation
        if (validate) {
            await validate(value);
        }

        if (onChange) {
            onChange(e);
        }
    };

    /**
     * Handles the onBlur event for the field
     */
    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>,
        onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    ): void => {
        if (setTouched) {
            setTouched(true);
        }
        form.trigger(name);

        if (onBlur) {
            onBlur(e);
        }
    };

    if (!isValidElement(children)) {
        return <></>;
    }

    /**
     * Renders the child element with the field properties
     */
    const renderChildElement = (field: ControllerRenderProps<TFieldValues, TName>): ReactElement => {
        // Properties specific to checkboxes
        const checkboxProps = isCheckbox ? { checked: !!field.value } : {};

        // Filter out non-DOM props
        const childProps = typeof children.props === 'object' && children.props !== null ? { ...children.props } : {};

        const fieldProps = {
            ...childProps,
            ...field,
            ...checkboxProps,
            className,
            value: isCheckbox ? field.value : (field.value ?? ''),
            id: fieldPath,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e, (children as ReactElement).props.onChange),
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, (children as ReactElement).props.onBlur),
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
        <div className='relative'>
            <Controller
                control={form.control}
                name={fieldPath as TName}
                render={({ field }) => renderChildElement(field)}
            />
        </div>
    );
}
