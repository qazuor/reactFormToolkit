import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

/**
 * Gets a value from an object using dot notation
 * @param obj - Object to get value from
 * @param path - Path to value using dot notation
 * @returns Value at path or undefined if not found
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function get(obj: any, path: string): any {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result === undefined || result === null) {
            return undefined;
        }
        result = result[key];
    }

    return result;
}

/**
 * Utility function to merge Tailwind CSS classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Utility function to check if any async validations are pending
 * @param asyncValidations - Class values to merge
 * @returns Merged class string
 */
export const hasPendingValidations = (asyncValidations: Record<string, boolean> | undefined) => {
    return Object.entries(asyncValidations || {}).some(([_fieldName, isValidating]) => {
        // Only count fields that are actually validating
        return isValidating;
    });
};

/**
 * Utility function to check if any async validations have errors
 * @param asyncErrors - Class values to merge
 * @returns Merged class string
 */
export const hasAsyncErrors = (asyncErrors: Record<string, boolean> | undefined) => {
    return Object.entries(asyncErrors || {}).some(([_fieldName, hasError]) => {
        // Only count fields that has errors
        return hasError;
    });
};

/**
 * Retrieves the Zod schema for a specific field if it exists.
 *
 * @param {ZodObject<ZodRawShape>} schema - The Zod schema object from which to retrieve the field schema.
 * @param {string} fieldName - The name of the field to find in the schema.
 * @returns {ZodTypeAny | undefined} The specific field schema or undefined if not found.
 */
export function getFieldSchema(schema: ZodObject<ZodRawShape>, fieldName: string): ZodTypeAny | undefined {
    const shape = schema.shape;
    if (!shape) {
        return undefined;
    }
    return shape[fieldName];
}
