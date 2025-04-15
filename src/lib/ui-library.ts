import type { FormProviderStyleOptions, UILibraryOptions } from '@/types';
import { defaultStyles } from './styles';

/**
 * Determines if default input styles should be applied based on UI library configuration.
 * When a UI library is enabled, we don't want to apply our default styles to inputs.
 *
 * @param uiLibrary - UI library configuration options
 * @returns Whether default input styles should be applied
 */
export function shouldApplyInputStyles(uiLibrary?: UILibraryOptions): boolean {
    return !uiLibrary?.enabled;
}

/**
 * Returns a modified version of the default styles that only includes styles for
 * descriptions, errors, and labels, but not for input elements themselves.
 * This is useful when integrating with UI libraries that provide their own input styling.
 *
 * @param defaultStyles - The default styles object
 * @returns A modified styles object with input-related styles removed
 */
export function getUiLibraryCompatibleStyles(
    styles: FormProviderStyleOptions = defaultStyles
): FormProviderStyleOptions {
    return {
        ...styles,
        field: {
            ...styles.field,
            // Remove input-specific styles
            input: undefined,
            select: undefined,
            textarea: undefined,
            checkbox: undefined,
            // Remove validation state styles for inputs
            isValid: undefined,
            isInvalid: undefined,
            isValidating: undefined,
            isLoading: undefined
        }
    };
}
