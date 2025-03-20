import { useFormContext } from '@/context/FormContext';

/**
 * Hook to manage field status including validation state
 * @param fieldName - Name of the form field
 * @returns Object containing field status information
 */
export function useFieldStatus(fieldName: string) {
    const { form } = useFormContext();
    const {
        formState: { errors, touchedFields, dirtyFields }
    } = form;

    return {
        error: errors[fieldName],
        isTouched: !!touchedFields[fieldName],
        isDirty: !!dirtyFields[fieldName],
        hasError: !!errors[fieldName]
    };
}
