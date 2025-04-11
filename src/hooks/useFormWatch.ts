import { useFormContext } from '@/context/FormContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * Options for the useFormWatch hook
 */
interface UseFormWatchOptions<TFieldValues extends FieldValues = FieldValues> {
    /**
     * The field name to watcha
     */
    name: FieldPath<TFieldValues>;

    /**
     * Callback function to execute when the watched field changes
     */
    onChange: (value: unknown) => void;

    /**
     * Whether to execute the callback on mount
     * @default true
     */
    executeOnMount?: boolean;

    /**
     * Whether to skip the callback if the value hasn't changed
     * @default true
     */
    skipIfSameValue?: boolean;
}

/**
 * Hook for watching form field changes with optimized subscriptions
 *
 * @example
 * ```tsx
 * useFormWatch({
 *   name: 'country',
 *   onChange: (value) => {
 *     console.log('Country changed to:', value);
 *     // Fetch states for the selected country
 *   }
 * });
 * ```
 */
export function useFormWatch<TFieldValues extends FieldValues = FieldValues>({
    name,
    onChange,
    executeOnMount = true,
    skipIfSameValue = true
}: UseFormWatchOptions<TFieldValues>) {
    const { form } = useFormContext<TFieldValues>();
    const [currentValue, setCurrentValue] = useState<unknown>(() => form.getValues(name));
    const watchSubscriptionRef = useRef<{ unsubscribe: () => void }>();
    const previousValueRef = useRef<unknown>(null);
    const initialMountRef = useRef<boolean>(true);
    const isProcessingRef = useRef<boolean>(false);

    const handleFieldChange = useCallback(
        (value: unknown) => {
            // Prevent recursive calls
            if (isProcessingRef.current) {
                return;
            }

            // Skip if value hasn't changed and skipIfSameValue is true
            if (skipIfSameValue && value === previousValueRef.current && !initialMountRef.current) {
                return;
            }

            isProcessingRef.current = true;

            // Update previous value reference
            previousValueRef.current = value;
            initialMountRef.current = false;
            setCurrentValue(value);

            // Execute the onChange callback
            onChange(value);

            isProcessingRef.current = false;
        },
        [onChange, skipIfSameValue]
    );

    useEffect(() => {
        // Get initial value
        const initialValue = form.getValues(name);

        // Execute onChange with initial value if requested
        if (executeOnMount) {
            handleFieldChange(initialValue);
        } else {
            // Still store the initial value as previous value
            previousValueRef.current = initialValue;
            initialMountRef.current = false;
        }

        // Set up subscription for future changes
        watchSubscriptionRef.current = form.watch((_values, { name: fieldName }) => {
            // Only update if the watched field changed or if it's the initial watch
            if (fieldName === name || fieldName === undefined) {
                const watchedValue = form.getValues(name);
                handleFieldChange(watchedValue);
            }
        });

        // Cleanup subscription on unmount
        return () => {
            watchSubscriptionRef.current?.unsubscribe();
        };
    }, [form, name, handleFieldChange, executeOnMount]);

    // Return the current value from state
    return currentValue;
}
