import type { FieldInputProps } from '@/types';
import type React from 'react';
import { type ReactElement, cloneElement, isValidElement, useCallback } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';

/**
 * Handles the onChange event for the field
 */
const handleChange = async <T extends FieldValues>(
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<T, Path<T>>,
    isCheckbox: boolean,
    isMultipleSelect: boolean,
    validate?: (value: unknown) => Promise<void>,
    originalOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
): Promise<void> => {
    // Call original onChange first to update the field value
    if (originalOnChange) {
        originalOnChange(e);
    }
    // const isMultipleSelect = isValidElement(children) && children.props.multiple === true;

    const value = isCheckbox
        ? e.target.checked
        : isMultipleSelect
          ? Array.from((e.target as unknown as HTMLSelectElement).selectedOptions).map((opt) => opt.value)
          : e.target.value;

    field.onChange(value);

    // Trigger validation
    if (validate) {
        await validate(value);
    }
};

/**
 * Handles the onBlur event for the field
 */
const handleBlur = <T extends FieldValues>(
    e: React.FocusEvent<HTMLInputElement>,
    field: ControllerRenderProps<T, Path<T>>,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
): void => {
    // Call original onBlur first
    if (onBlur) {
        onBlur(e);
    }
    field.onBlur();
};

export function FieldInput<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
    fieldPath,
    children,
    form,
    description,
    validate,
    childRef,
    className,
    ariaInvalid,
    ariaDescribedBy
}: FieldInputProps): ReactElement {
    const isCheckbox = isValidElement(children) && (children as ReactElement).props.type === 'checkbox';
    const isMultipleSelect = isValidElement(children) && (children as ReactElement).props.multiple === true;

    const onChangeHandler = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<TFieldValues, TName>) => {
            await handleChange(
                e,
                field,
                isCheckbox,
                isMultipleSelect,
                validate,
                (children as ReactElement).props.onChange
            );
        },
        [isCheckbox, isMultipleSelect, validate, children]
    );

    const onBlurHandler = useCallback(
        (e: React.FocusEvent<HTMLInputElement>, field: ControllerRenderProps<TFieldValues, TName>) => {
            handleBlur(e, field, (children as ReactElement).props.onBlur);
        },
        [children]
    );

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
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChangeHandler(e, field),
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => onBlurHandler(e, field),
            id: fieldPath,
            'data-testid': fieldPath,
            'aria-invalid': ariaInvalid,
            'aria-describedby': description ? ariaDescribedBy : undefined,
            value: isCheckbox ? field.value : (field.value ?? '')
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
                name={fieldPath}
                render={({ field }) => renderChildElement(field as ControllerRenderProps<TFieldValues, TName>)}
            />
        </div>
    );
}
