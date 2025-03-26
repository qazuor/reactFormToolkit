import { useFormContext } from '@/context/FormContext';
import { get } from '@/lib/utils';
import { useEffect, useState } from 'react';

/**
 * Hook to manage field state including validation and touch status
 * @param fieldName - Name of the form field
 * @returns Field state information
 *
 * @example
 * ```tsx
 * const { isTouched, isDirty, isValidating } = useFieldState('email');
 * ```
 */
export function useFieldState(fieldName: string) {
    const { form } = useFormContext();
    const {
        formState: { errors, touchedFields, dirtyFields, isValidating: formIsValidating }
    } = form;

    const [isValidating, setIsValidating] = useState(false);

    // Update validating state when form state changes
    useEffect(() => {
        setIsValidating(formIsValidating);
    }, [formIsValidating]);

    const error = get(errors, fieldName);
    return {
        error,
        hasError: !!error,
        isTouched: !!get(touchedFields, fieldName),
        isDirty: !!get(dirtyFields, fieldName),
        isValidating
    };
}
