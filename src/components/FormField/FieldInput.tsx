import type React from 'react';
import { type ReactElement, cloneElement, isValidElement } from 'react';
import {
    Controller,
    type ControllerRenderProps,
    type PathValue,
    type FieldValues as TFieldValues,
    type UseFormReturn
} from 'react-hook-form';

interface FieldInputProps {
    /* Field path in the form data */
    fieldPath: string;

    /* Field name */
    name: string;

    /* Child components */
    children: ReactElement;

    /* Form instance */
    form: UseFormReturn<TFieldValues>;

    /* Field description */
    description?: string;

    /* Validation function */
    validate?: () => void;

    /* Sets the field as touched */
    setTouched?: (touched: boolean) => void;

    /* Ref for the child element */
    childRef?: React.RefObject<HTMLInputElement>;

    /* Custom CSS class */
    className?: string;

    /* Aria invalid attribute */
    ariaInvalid?: boolean;

    /* Aria described by attribute */
    ariaDescribedBy?: string;
}

export function FieldInput<TName extends string>({
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
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    ): void => {
        // For checkboxes, use the checked value instead of the value
        if (isCheckbox) {
            form.setValue(name, e.target.checked as PathValue<TFieldValues, TName>);
        } else {
            form.setValue(name, e.target.value as PathValue<TFieldValues, TName>);
        }

        // Trigger validation
        if (validate) {
            validate();
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
        // const baseStyle = getFieldStyle(fieldType, styles, isCheckbox);
        // const customClass = children.props.className || '';

        // // Filter out non-DOM props to avoid React warnings
        // const { tooltipPosition, errorDisplay, ...childProps } = children.props;
        // return cloneElement(children, {
        //     ...childProps,
        //     ...field,
        //     ...checkboxProps,
        //     value: isCheckbox ? field.value : (field.value ?? ''),
        //     id: name,
        //     onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, children.props.onChange),
        //     onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, children.props.onBlur),
        //     'aria-invalid': !!error,
        //     'aria-describedby': description ? `${name}-description` : undefined,
        //     className: buildClassName(baseStyle, customClass)
        // });

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
                name={fieldPath}
                render={({ field }) => renderChildElement(field as ControllerRenderProps<TFieldValues, TName>)}
            />
        </div>
    );
}
