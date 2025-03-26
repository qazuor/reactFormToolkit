import { useFormContext } from '@/context';
import { cn } from '@/lib';
import type { ValidationState } from '@/types';
import { useState } from 'react';

interface UseFieldStylesReturn {
    getFieldClasses: (isCheckbox: boolean) => string;
    setValidationState: (state: ValidationState) => void;
    validationState: ValidationState;
}

/**
 * Hook for managing field styles based on validation state
 * @returns Field style utilities and state
 *
 * @example
 * ```tsx
 * const { getFieldClasses, validationState } = useFieldStyles();
 * const className = getFieldClasses(false);
 * ```
 */
export function useFieldStyles(): UseFieldStylesReturn {
    const { styleOptions: mergedStyles } = useFormContext();
    const [validationState, setValidationState] = useState<ValidationState>({
        hasError: false,
        isValidating: false,
        error: undefined,
        validatingStarted: false
    });

    const getFieldClasses = (isCheckbox: boolean): string => {
        const inputType = isCheckbox ? 'checkbox' : 'input';
        const baseClasses = mergedStyles?.field?.[inputType as keyof typeof mergedStyles.field];

        const stateClasses = cn({
            [(mergedStyles?.field?.isInvalid as string) || '']: validationState.hasError,
            [(mergedStyles?.field?.isValid as string) || '']: !validationState.hasError,
            [(mergedStyles?.field?.isLoading as string) || '']: validationState.isValidating
        });

        return cn(baseClasses, stateClasses);
    };

    return {
        getFieldClasses,
        setValidationState,
        validationState
    };
}
