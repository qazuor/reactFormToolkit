import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

interface UseFieldPropsParams<T extends FieldValues> {
    field: ControllerRenderProps<T, Path<T>>;
    isCheckbox: boolean;
    fieldPath: Path<T>;
    className: string;
    ariaInvalid: boolean;
    ariaDescribedBy?: string;
    childProps: Record<string, unknown>;
}

/**
 * Hook for generating field props based on field type and state
 * @param params Field configuration and state
 * @returns Props object for the field element
 */
export function useFieldProps<T extends FieldValues>({
    field,
    isCheckbox,
    fieldPath,
    className,
    ariaInvalid,
    ariaDescribedBy,
    childProps
}: UseFieldPropsParams<T>) {
    return {
        ...childProps,
        ...field,
        ...(isCheckbox ? { checked: !!field.value } : {}),
        className,
        value: isCheckbox ? field.value : (field.value ?? ''),
        id: fieldPath,
        'data-testid': fieldPath,
        'aria-invalid': ariaInvalid,
        'aria-describedby': ariaDescribedBy
    } as const;
}
