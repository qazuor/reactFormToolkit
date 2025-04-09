import type { FieldAsyncValidationProps } from '@/types';
import type { JSX } from 'react';
import { memo } from 'react';
import { ValidationStatusIcon } from '../Icons';

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
    if (state === 'validating') {
        return (
            <div
                className='items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3'
                aria-hidden='true'
                data-testid='invalid-indicator-validating'
            >
                {textWhenValidating && <span className='mr-2 text-blue-400 text-xs'>{textWhenValidating}</span>}
                {showLoadingSpinner && <ValidationStatusIcon status='loading' />}
            </div>
        );
    }
    if (state === 'valid') {
        return (
            <div
                className='items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3'
                aria-hidden='true'
                data-testid='invalid-indicator-valid'
            >
                {showValidationIcons && <ValidationStatusIcon status='success' />}
            </div>
        );
    }
    if (state === 'invalid') {
        return (
            <div
                className='items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3'
                aria-hidden='true'
                data-testid='invalid-indicator-invalid'
            >
                {!isValidating && hasError && <span className='mr-2 text-red-500 text-xs'>{error}</span>}
                {showValidationIcons && <ValidationStatusIcon status='error' />}
            </div>
        );
    }
    // idle
    return (
        <div
            className='items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3'
            aria-hidden='true'
            data-testid='invalid-indicator-idle'
        >
            {textWhenBeforeStartValidating && !hasError && (
                <span className='mr-2 text-gray-400 text-xs'>{textWhenBeforeStartValidating}</span>
            )}
        </div>
    );
});
