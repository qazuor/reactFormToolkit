import type { FieldAsyncValidationProps } from '@/types';
import type { JSX } from 'react';
import { memo } from 'react';
import { FormFieldAsyncValidationRenderer } from './FormFieldAsyncValidationRenderer';

/**
 * Async Validation indicator component for rendering async validation icons and messages
 * @param props - Component properties
 * @returns Form field async validation indicator component
 */
export const FormFieldAsyncValidationIndicator = memo(function FormFieldAsyncValidationIndicator({
    isValidating,
    asyncValidatingStarted,
    showValidationIcons,
    showLoadingSpinner,
    hasError,
    error,
    textWhenValidating,
    textWhenBeforeStartValidating
}: FieldAsyncValidationProps): JSX.Element {
    type StateTypes = 'validating' | 'idle' | 'valid' | 'invalid';
    const getStateType = (): StateTypes => {
        if (isValidating && asyncValidatingStarted) {
            return 'validating';
        }
        if (asyncValidatingStarted && !isValidating && !hasError) {
            return 'valid';
        }
        if (asyncValidatingStarted && !isValidating && hasError) {
            return 'invalid';
        }
        return 'idle';
    };

    const state = getStateType();

    return (
        <FormFieldAsyncValidationRenderer
            state={state}
            textWhenValidating={textWhenValidating}
            showLoadingSpinner={showLoadingSpinner}
            showValidationIcons={showValidationIcons}
            hasError={hasError}
            error={error}
            isValidating={isValidating}
            textWhenBeforeStartValidating={textWhenBeforeStartValidating}
        />
    );
});
