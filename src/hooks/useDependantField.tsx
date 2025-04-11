import { useDebounce } from '@/hooks/useDebounce';
import type { DependentOption, UseDependantFieldOptions } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

/**
 * Hook for handling dependent field values based on another field's value
 *
 * @example
 * ```tsx
 * const { dependentValues, isLoading } = useDependantField({
 *   form,
 *   dependsOnField: 'country',
 *   dependentValuesCallback: getStatesByCountry,
 *   loadingDelay: 300,
 *   cacheResults: true
 * });
 * ```
 */
export function useDependantField<TFieldValues extends FieldValues = FieldValues>({
    form,
    dependsOnField,
    dependentValuesCallback,
    loadingDelay = 300,
    cacheResults = true
}: UseDependantFieldOptions<TFieldValues>) {
    const [dependentValues, setDependentValues] = useState<DependentOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const watchSubscriptionRef = useRef<{ unsubscribe: () => void }>();
    const cacheRef = useRef<Record<string, DependentOption[]>>({});
    const initialValueRef = useRef<boolean>(true);
    const previousValueRef = useRef<unknown>(null);

    // Debounce the loading state to prevent flickering for fast responses
    const debouncedIsLoading = useDebounce(isLoading, loadingDelay);

    /**
     * Fetch dependent values based on the parent field value
     */
    const fetchDependentValues = useCallback(
        async (value: unknown) => {
            // Skip if the value is the same as the previous one
            if (value === previousValueRef.current && !initialValueRef.current) {
                return;
            }

            previousValueRef.current = value;
            initialValueRef.current = false;

            // If value is empty or null, reset dependent values
            if (value === '' || value === null || value === undefined) {
                setDependentValues([]);
                return;
            }

            // Check cache first if enabled
            const cacheKey = String(value);
            if (cacheResults && cacheRef.current[cacheKey]) {
                setDependentValues(cacheRef.current[cacheKey]);
                return;
            }

            try {
                setIsLoading(true);
                const result = await dependentValuesCallback(value);

                // Normalize the result to ensure it's an array of DependentOption objects
                const normalizedResult = Array.isArray(result)
                    ? result.map((item) => {
                          if (typeof item === 'object' && item !== null && 'value' in item && 'label' in item) {
                              return item as DependentOption;
                          }
                          return { value: String(item), label: String(item) };
                      })
                    : [];

                setDependentValues(normalizedResult);

                // Cache the result if caching is enabled
                if (cacheResults) {
                    cacheRef.current[cacheKey] = normalizedResult;
                }
            } catch (error) {
                console.error('Error fetching dependent values:', error);
                setDependentValues([]);
            } finally {
                setIsLoading(false);
            }
        },
        [dependentValuesCallback, cacheResults]
    );

    // Set up watch subscription
    useEffect(() => {
        // Initial fetch with current value
        const initialValue = form.getValues(dependsOnField);
        fetchDependentValues(initialValue);

        // Set up subscription for future changes
        watchSubscriptionRef.current = form.watch((_values, { name }) => {
            // Only update if the watched field changed or if it's the initial watch
            if (name === dependsOnField || name === undefined) {
                const watchedValue = form.getValues(dependsOnField);
                fetchDependentValues(watchedValue);
            }
        });

        return () => {
            watchSubscriptionRef.current?.unsubscribe();
        };
    }, [form, dependsOnField, fetchDependentValues]);

    return {
        dependentValues,
        isLoading: debouncedIsLoading
    };
}
