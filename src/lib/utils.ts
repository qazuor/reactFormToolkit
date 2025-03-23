import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Gets a value from an object using dot notation
 * @param obj - Object to get value from
 * @param path - Path to value using dot notation
 * @returns Value at path or undefined if not found
 */
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
