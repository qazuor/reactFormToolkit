import type { RegisterOptions } from 'react-hook-form';

/**
 * Type for async validation function
 */
export type AsyncValidateFunction<T = unknown> = (value: T) => Promise<boolean | string>;

/**
 * Extended validation rules for form fields
 */
export interface ValidationRules extends Omit<RegisterOptions, 'validate'> {
    /** Custom validation functions */
    validate?: {
        /** Synchronous validation function */
        [key: string]: ((value: unknown) => boolean | string) | AsyncValidateFunction;
    };
}
