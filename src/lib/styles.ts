import type { FormProviderStyleOptions } from '@/types';
import { cn } from './utils';

/**
 * Default styles for the form components
 */
export const defaultStyles: FormProviderStyleOptions = {
    field: {
        wrapper: 'space-y-2 dark:text-gray-200',
        label: 'group mb-2 block font-medium text-gray-700 text-sm dark:text-gray-200',
        description: 'text-gray-500 text-sm dark:text-gray-400',
        error: 'mt-1 flex items-center gap-1 text-red-600 text-sm dark:text-red-400',
        requiredMark: 'ml-1 text-red-500 dark:text-red-400',
        input: 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400',
        select: 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400',
        textarea:
            'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400',
        checkbox:
            'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-800 dark:focus:ring-blue-400',
        isValid:
            'border-green-500 focus:border-green-600 focus:ring-green-600 dark:border-green-400 dark:focus:border-green-500 dark:focus:ring-green-500',
        isInvalid:
            'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400',
        isValidating:
            'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400',
        isLoading: 'cursor-not-allowed bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
    },
    form: {
        wrapper: 'space-y-6 dark:text-gray-200'
    },
    buttons: {
        submit: 'bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600',
        cancel: 'bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500',
        reset: 'bg-red-100 px-4 py-2 rounded-md text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 dark:focus:ring-red-600'
    },
    tooltip: {
        icon: 'ml-1 inline-flex cursor-help items-center text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
        content:
            'z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
    }
};

/**
 * Merges style options with default styles
 */
export function mergeStyles(
    defaultStyles: FormProviderStyleOptions,
    providerStyles?: FormProviderStyleOptions,
    componentStyles?: Record<string, string>
): FormProviderStyleOptions {
    const merged = { ...defaultStyles };

    // Merge provider styles
    if (providerStyles) {
        for (const key of Object.keys(providerStyles)) {
            if (key in merged) {
                merged[key as keyof FormProviderStyleOptions] = {
                    ...merged[key as keyof FormProviderStyleOptions],
                    ...providerStyles[key as keyof FormProviderStyleOptions]
                };
            }
        }
    }

    // Merge component styles
    if (componentStyles) {
        for (const key of Object.keys(componentStyles)) {
            if (merged.field && key in merged.field) {
                merged.field = merged.field ?? {};
                merged.field[key as keyof typeof merged.field] = cn(
                    merged.field[key as keyof typeof merged.field] ?? '',
                    componentStyles[key]
                );
            }
        }
    }

    return merged;
}
