import { useDebounce } from '@/hooks/useDebounce';
import { useFormWatch } from '@/hooks/useFormWatch';
import type { DependentOption, UseDependantFieldOptions } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * Normalizes the result to ensure it's an array of DependentOption objects
 */
function normalizeResult(result: unknown[]): DependentOption[] {
    return result.map((item) => {
        if (typeof item === 'object' && item !== null && 'value' in item && 'label' in item) {
            return item as DependentOption;
        }
        return { value: String(item), label: String(item) };
    });
}

/**
 * Handles fetching dependent values with error handling
 */
async function fetchValues(
    value: unknown,
    dependentValuesCallback: (value: unknown) => Promise<DependentOption[]> | DependentOption[],
    setIsLoading: (loading: boolean) => void,
    setDependentValues: (values: DependentOption[]) => void
): Promise<DependentOption[]> {
    try {
        setIsLoading(true);

        // Handle both synchronous and asynchronous callbacks
        const resultPromise = dependentValuesCallback(value);
        const result = resultPromise instanceof Promise ? await resultPromise : resultPromise;

        // Normalize the result
        const normalizedResult = Array.isArray(result) ? normalizeResult(result) : [];

        setDependentValues(normalizedResult);
        return normalizedResult;
    } catch (error) {
        console.error('Error fetching dependent values:', error);
        setDependentValues([]);
        return [];
    } finally {
        setIsLoading(false);
    }
}

/**
 * Hook for handling dependent field values based on another field's value
 *
 * @example
 * ```tsx
 * const { dependentValues, isLoading } = useDependantField({
 *   dependsOnField: 'country',
 *   dependentValuesCallback: getStatesByCountry,
 *   loadingDelay: 300,
 *   cacheResults: true
 * });
 * ```
 */
export function useDependantField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    dependsOnField,
    dependentValuesCallback,
    loadingDelay = 300,
    cacheResults = true
}: Omit<UseDependantFieldOptions<TFieldValues, TName>, 'form'>) {
    const [dependentValues, setDependentValues] = useState<DependentOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cacheRef = useRef<Record<string, DependentOption[]>>({});

    // Debounce the loading state to prevent flickering for fast responses
    const debouncedIsLoading = useDebounce(isLoading, loadingDelay);

    // Track if we're currently fetching to prevent duplicate requests
    const isFetchingRef = useRef<boolean>(false);

    /**
     * Fetch dependent values based on the parent field value
     */
    const fetchDependentValues = useCallback(
        async (value: unknown) => {
            // If value is empty, null, or undefined, reset dependent values
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

            isFetchingRef.current = true;

            try {
                const result = await fetchValues(value, dependentValuesCallback, setIsLoading, setDependentValues);

                // Cache the result if caching is enabled
                if (cacheResults) {
                    cacheRef.current[cacheKey] = result;
                }
            } finally {
                isFetchingRef.current = false;
            }
        },
        [dependentValuesCallback, cacheResults]
    );

    // Use the useFormWatch hook to watch for changes
    const currentValue = useFormWatch({
        name: dependsOnField,
        onChange: (value) => {
            // Ensure we're working with the latest value
            fetchDependentValues(value);
        },
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
