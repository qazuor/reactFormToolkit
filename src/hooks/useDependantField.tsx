import { useDebounce } from '@/hooks/useDebounce';
import { useFormWatch } from '@/hooks/useFormWatch';
import type { DependentOption, UseDependantFieldOptions } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
export function useDependantField({
    dependsOnField,
    dependentValuesCallback,
    loadingDelay = 300,
    cacheResults = true
}: Omit<UseDependantFieldOptions, 'form'>) {
    const [dependentValues, setDependentValues] = useState<DependentOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cacheRef = useRef<Record<string, DependentOption[]>>({});

    // Track if we're currently fetching to prevent duplicate requests
    const isFetchingRef = useRef<boolean>(false);

    // Debounce the loading state to prevent flickering for fast responses
    const debouncedIsLoading = useDebounce(isLoading, loadingDelay);

    // Memoize the fetch function to prevent unnecessary re-creation
    const memoizedFetchDependentValues = useMemo(() => {
        return async (value: unknown) => {
            // If value is empty or null, reset dependent values
            if (value === '' || value === null || value === undefined) {
                setDependentValues([]);
                return;
            }

            // Prevent concurrent fetches for the same value
            if (isFetchingRef.current) {
                return;
            }

            // Check cache first if enabled
            const cacheKey = String(value);
            if (cacheResults && cacheRef.current[cacheKey]) {
                setDependentValues(cacheRef.current[cacheKey]);
                return;
            }

            try {
                isFetchingRef.current = true;
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
                isFetchingRef.current = false;
            }
        };
    }, [dependentValuesCallback, cacheResults]);

    /**
     * Fetch dependent values based on the parent field value
     */
    const fetchDependentValues = useCallback(
        (value: unknown) => {
            memoizedFetchDependentValues(value);
        },
        [memoizedFetchDependentValues]
    );

    // Use the useFormWatch hook to watch for changes
    const currentValue = useFormWatch({
        name: dependsOnField,
        onChange: fetchDependentValues,
        executeOnMount: true,
        skipIfSameValue: true
    });

    // Ensure we reset dependent values when the parent field is cleared
    useEffect(() => {
        if (currentValue === '' || currentValue === null || currentValue === undefined) {
            setDependentValues([]);
        }
    }, [currentValue]);

    return {
        dependentValues,
        isLoading: debouncedIsLoading
    };
}
