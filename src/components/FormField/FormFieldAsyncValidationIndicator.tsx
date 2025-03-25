import type { FieldAsyncValidationProps } from '@/types';
import type { JSX } from 'react';
import { ValidationStatusIcon } from '../Icons';

/**
 * Async Validation indicator component for rendering async validation icons and messages
 * @param props - Component properties
 * @returns Form field async validation indicator component
 */
export function FormFieldAsyncValidationIndicator({
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
                {showLoadingSpinner && <ValidationStatusIcon status='loading' />}
                {textWhenValidating && <span className='-mt-1 ml-2 text-gray-500 text-sm'>{textWhenValidating}</span>}
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
                {showValidationIcons && <ValidationStatusIcon status='error' />}
                {!isValidating && hasError && <span className='teerrorxt-gray-500 -mt-1 ml-2 text-sm'>{error}</span>}
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
                <span className='-mt-1 ml-2 text-gray-500 text-sm'>{textWhenBeforeStartValidating}</span>
            )}
        </div>
    );
}
