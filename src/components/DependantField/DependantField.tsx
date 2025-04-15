import { useFormContext } from '@/context/FormContext';
import { useDependantField } from '@/hooks/useDependantField';
import { prepareStyles } from '@/lib';
import type { DependantFieldProps } from '@/types';
import React, { cloneElement, isValidElement, type ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * A component that loads dependent values based on another field's value.
 *
 * @example
 * ```tsx
 * <DependantField
 *   dependsOnField="country"
 *   dependentValuesCallback={getStatesByCountry}
 * >
 *   <FormField name="state" label="State">
 *     {({ field }, dependentValues, isLoading) => (
 *       <select
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *       >
 *         {isLoading ? (
 *           <option>Loading...</option>
 *         ) : (
 *           <>
 *             <option value="">Select a state</option>
 *             {dependentValues?.map((state) => (
 *               <option key={state.value} value={state.value}>
 *                 {state.label}
 *               </option>
 *             ))}
 *           </>
 *         )}
 *       </select>
 *     )}
 *   </FormField>
 * </DependantField>
 * ```
 */
export function DependantField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    dependsOnField,
    dependentValuesCallback,
    children,
    loadingDelay = 300,
    cacheResults = true
}: DependantFieldProps<TFieldValues, TName>): ReactElement {
    const { styleOptions: providerStyles, uiLibrary } = useFormContext();

    const { dependentValues, isLoading } = useDependantField<TFieldValues>({
        dependsOnField,
        dependentValuesCallback,
        loadingDelay,
        cacheResults
    });

    // Use the shared utility function to prepare styles
    const styleOptions = prepareStyles(providerStyles, uiLibrary);

    // Function to enhance children with dependent values and loading state
    // Clone the children and inject the dependent values and loading state
    const childrenWithProps = React.Children.map(children, (child) => {
        if (!isValidElement(child)) {
            return child;
        }

        // Check if the child has a render function
        if (typeof child.props.children === 'function') {
            // Create a new render function that includes dependentValues and isLoading
            const originalRender = child.props.children;
            const newRender = (fieldProps: Record<string, unknown>) => {
                return originalRender(fieldProps, dependentValues, isLoading, styleOptions);
            };

            // Clone the child with the new render function
            return cloneElement(child, {
                ...child.props,
                children: newRender
            });
        }

        // If the child doesn't have a render function, just return it
        return child;
    });

    return <>{childrenWithProps}</>;
}
