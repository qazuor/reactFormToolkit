import { useFormContext } from '@/context/FormContext';
import { useConditionalField } from '@/hooks';
import type { ConditionalFieldProps } from '@/types';
import type { ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * A component that conditionally renders form fields based on the value of another field.
 *
 * @example
 * ```tsx
 * <ConditionalField watchField="shippingType" condition="pickup">
 *   <FormField name="storeLocation" label="Select Store">
 *     <select>
 *       <option value="store1">Store 1</option>
 *       <option value="store2">Store 2</option>
 *     </select>
 *   </FormField>
 * </ConditionalField>
 * ```
 */
export function ConditionalField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    watchField,
    condition,
    children,
    fallback = null,
    keepRegistered = false
}: ConditionalFieldProps<TFieldValues, TName>): ReactElement | null {
    const { form } = useFormContext();

    const { isConditionMet } = useConditionalField({
        form,
        watchField,
        condition,
        keepRegistered,
        content: children
    });

    // Render the appropriate content based on the condition
    return isConditionMet ? <>{children}</> : <>{fallback}</>;
}
