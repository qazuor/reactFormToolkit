import { useFormContext } from '@/context/FormContext';
import { get } from '@/lib/utils';
import { useEffect, useState } from 'react';

/**
 * Hook to manage field status including validation state for both regular and array fields
 * @param fieldName - Name of the form field (supports dot notation for array fields)
 * @returns Object containing field status information
 */
export function useFieldStatus(fieldName: string) {
    const { form } = useFormContext();
    const {
        formState: { errors, touchedFields, dirtyFields, isValidating: formIsValidating }
    } = form;

    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        setIsValidating(formIsValidating);
    }, [formIsValidating]);

    // Get the error using the full path
    const error = get(errors, fieldName);
    const isTouched = !!get(touchedFields, fieldName);
    const isDirty = !!get(dirtyFields, fieldName);

    return {
        error,
        isTouched,
        isDirty,
        hasError: !!error,
        isValidating
    };
}
