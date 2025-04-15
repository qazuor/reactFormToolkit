import { cn } from '@/lib';
import type { FieldInputProps } from '@/types';
import type React from 'react';
import { type ReactElement, isValidElement, memo, useCallback } from 'react';
import { Controller, type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';
import { FieldInputRenderer } from './FieldInputRenderer';

// Minimal check to see if a component can safely receive `ref`.
//  - If child.type is a string (e.g. 'input', 'select'), it's a DOM element => ref is fine.
//  - If child.type.$$typeof === Symbol.for('react.forward_ref'), it accepts ref.
function canReceiveRef(child: ReactElement): boolean {
    // Case 1: It's a native HTML tag (e.g., 'input', 'select') => definitely can receive ref
    if (typeof child.type === 'string') {
        return true;
    }

    // We'll check for forwardRef or memo(forwardRef)
    const typeAsAny = child.type as React.ElementType & {
        $$typeof?: symbol;
        type?: React.ElementType & { $$typeof?: symbol };
    };

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
    originalOnChange?: (arg: unknown) => void,
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

    // Check if e is an event with target property before accessing it
    if (
        e &&
        typeof e === 'object' &&
        'target' in e &&
        e.target &&
        typeof e.target === 'object' &&
        'type' in e.target &&
        (e.target as HTMLInputElement).type === 'checkbox'
    ) {
        value = (e.target as HTMLInputElement).checked;
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

/**
 * FieldInput component for rendering form inputs with validation
 * This component handles the connection between React Hook Form and the input element
 */
export const FieldInput = memo(function FieldInput<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
    fieldPath,
    children,
    form,
    description,
    validate,
    childRef,
    className = '',
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

    /**
     * Prepares the field properties for the child element
     * @param field - The field from react-hook-form
     * @returns The props to pass to the child element
     */
    const prepareFieldProps = (field: ControllerRenderProps<TFieldValues, TName>) => {
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
            className: cn(className, childProps.className || ''),
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
            (props as typeof fieldProps & { ref?: React.Ref<unknown> }).ref = childRef;
        }

        return props;
    };

    return (
        <div className='relative'>
            <Controller
                control={form.control}
                name={fieldPath}
                render={({ field }) => {
                    const fieldProps = prepareFieldProps(field as ControllerRenderProps<TFieldValues, TName>);
                    return (
                        <FieldInputRenderer
                            fieldProps={fieldProps}
                            children={children}
                        />
                    );
                }}
            />
        </div>
    );
});
