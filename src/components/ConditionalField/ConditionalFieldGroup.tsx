import { useFormContext } from '@/context/FormContext';
import { useConditionalFieldGroup } from '@/hooks/useConditionalField';
import { cn } from '@/lib/utils';
import type { ConditionalFieldGroupProps } from '@/types';
import type { ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * A component that renders different groups of form fields based on the value of another field.
 *
 * @example
 * ```tsx
 * <ConditionalFieldGroup
 *   watchField="accountType"
 *   conditions={{
 *     personal: (
 *       <>
 *         <FormField name="firstName" label="First Name">
 *           <input type="text" />
 *         </FormField>
 *         <FormField name="lastName" label="Last Name">
 *           <input type="text" />
 *         </FormField>
 *       </>
 *     ),
 *     business: (
 *       <>
 *         <FormField name="companyName" label="Company Name">
 *           <input type="text" />
 *         </FormField>
 *         <FormField name="taxId" label="Tax ID">
 *           <input type="text" />
 *         </FormField>
 *       </>
 *     )
 *   }}
 * />
 * ```
 */
export function ConditionalFieldGroup<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    watchField,
    conditions,
    fallback = null,
    className = '',
    keepRegistered = false
}: ConditionalFieldGroupProps<TFieldValues, TName>): ReactElement {
    const { form } = useFormContext<TFieldValues>();

    const { currentValue } = useConditionalFieldGroup({
        form,
        watchField,
        conditions: conditions,
        keepRegistered: keepRegistered,
        content: conditions
    });

    // Get the content to render based on the current value
    const contentToRender = conditions[currentValue] || fallback;
    return <div className={cn('space-y-2', className)}>{contentToRender}</div>;
}
