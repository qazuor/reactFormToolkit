import { cn } from '@/lib';
import type { FieldInputProps } from '@/types';
import type React from 'react';
import { type ReactElement, cloneElement, isValidElement, useCallback } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';

// Minimal check to see if a component can safely receive `ref`.
//  - If child.type is a string (e.g. 'input', 'select'), it's a DOM element => ref is fine.
//  - If child.type.$$typeof === Symbol.for('react.forward_ref'), it accepts ref.
function canReceiveRef(child: ReactElement): boolean {
    // Case 1: It's a native HTML tag (e.g., 'input', 'select') => definitely can receive ref
    if (typeof child.type === 'string') {
        return true;
    }

    // We'll check for forwardRef or memo(forwardRef)
    const typeAsAny = child.type as any;

    // Direct forwardRef component
    if (typeAsAny?.$$typeof === Symbol.for('react.forward_ref')) {
        return true;
    }

    // If it's a memo(...) wrapping a forwardRef
    if (typeAsAny?.$$typeof === Symbol.for('react.memo')) {
        const inner = typeAsAny?.type; // the component passed to memo(...)
        if (inner?.$$typeof === Symbol.for('react.forward_ref')) {
            return true;
        }
    }

    // If neither condition is met, we assume it can't accept ref
    return false;
}

/**
 * Handles the onChange event for the field, supporting both native events and
 * custom libraries (e.g. onValueChange / onCheckedChange).
 */
const handleChange = async <T extends FieldValues>(
    e: React.ChangeEvent<HTMLInputElement> | unknown,
    field: ControllerRenderProps<T, Path<T>>,
    isCheckbox: boolean,
    isMultipleSelect: boolean,
    validate?: (value: unknown) => Promise<void>,
    originalOnChange?: (arg: any) => void,
    hasOnValueChange?: boolean,
    hasOnCheckedChange?: boolean
): Promise<void> => {
    if (originalOnChange) {
        originalOnChange(e);
    }

    let value: unknown;

    // If a component uses onValueChange / onCheckedChange, e is likely the new value directly
    if (hasOnValueChange || hasOnCheckedChange) {
        value = e;
    } else {
        // Otherwise, assume a standard SyntheticEvent
        const evt = e as React.ChangeEvent<HTMLInputElement>;
        value = isCheckbox
            ? evt.target.checked
            : isMultipleSelect
              ? Array.from((evt.target as unknown as HTMLSelectElement).selectedOptions).map((opt) => opt.value)
              : evt.target.value;
    }

    if (e.target.type === 'checkbox') {
        value = e.target.checked;
    }
    // Notify React Hook Form
    field.onChange(value);

    // Trigger validation if applicable
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
    // Call the original onBlur first (if any)
    if (onBlur) {
        onBlur(e);
    }
    // Notify React Hook Form that the field has blurred
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
    // Detect checkbox and multiple select as before
    const isCheckbox = isValidElement(children) && (children as ReactElement).props.type === 'checkbox';
    const isMultipleSelect = isValidElement(children) && (children as ReactElement).props.multiple === true;

    // Detect if the child might be using onValueChange / onCheckedChange (e.g. shadcn UI)
    const hasOnValueChange =
        isValidElement(children) && typeof (children as ReactElement).props.onValueChange === 'function';
    const hasOnCheckedChange =
        isValidElement(children) && typeof (children as ReactElement).props.onCheckedChange === 'function';

    const onChangeHandler = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<TFieldValues, TName>) => {
            await handleChange(
                e,
                field,
                isCheckbox,
                isMultipleSelect,
                validate,
                (children as ReactElement).props.onChange,
                hasOnValueChange,
                hasOnCheckedChange
            );
        },
        [isCheckbox, isMultipleSelect, validate, children, hasOnValueChange, hasOnCheckedChange]
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
        const checkboxProps = isCheckbox ? { checked: !!field.value } : {};

        // Shallow copy of child's props
        const childProps = typeof children.props === 'object' && children.props !== null ? { ...children.props } : {};

        // Merge props for React Hook Form
        const fieldProps = {
            ...childProps,
            ...field,
            ...checkboxProps,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChangeHandler(e, field),
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => onBlurHandler(e, field),
            className: cn(className, childProps.className),
            id: fieldPath,
            'data-testid': fieldPath,
            'aria-invalid': ariaInvalid,
            'aria-describedby': description ? ariaDescribedBy : undefined,
            value: isCheckbox ? field.value : (field.value ?? '')
        };

        // Only attach ref if the component can receive it
        // (i.e. a DOM element or a forwardRef component)
        const { ref, ...props } = fieldProps;
        if (canReceiveRef(children)) {
            (props as any).ref = childRef;
        }

        // console.log({ children, fieldProps });

        return cloneElement(children as ReactElement, props);
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
