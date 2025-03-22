import type { FormProviderStyleOptions } from '@/types/styles';
import { cn } from './utils';

/**
 * Default styles for the form components
 */
export const defaultStyles: FormProviderStyleOptions = {
    field: {
        wrapper: 'space-y-2',
        label: 'group mb-2 block font-medium text-gray-700 text-sm',
        description: 'text-gray-500 text-sm',
        error: 'mt-1 flex items-center gap-1 text-red-600 text-sm',
        requiredMark: 'ml-1 text-red-500',
        input: 'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
        select: 'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
        textarea: 'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
        checkbox: 'h-4 w-4 rounded border-gray-300 text-blue-600',
        isValid: 'border-green-500 focus:border-green-600 focus:ring-green-600',
        isInvalid: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        isValidating: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
        isLoading: 'cursor-not-allowed bg-gray-50 text-gray-500'
    },
    form: {
        wrapper: 'space-y-6'
    },
    buttons: {
        submit: 'bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700',
        cancel: 'bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300',
        reset: 'bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-700'
    },
    tooltip: {
        icon: 'ml-1 inline-flex cursor-help items-center text-gray-400 group-hover:text-gray-500',
        content:
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md'
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
