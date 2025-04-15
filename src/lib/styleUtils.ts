import type { FieldStyleOptions, FormProviderStyleOptions, UILibraryOptions } from '@/types';
import { defaultStyles } from './styles';
import { mergeStyles } from './styles';
import { getUiLibraryCompatibleStyles } from './ui-library';
import { cn } from './utils';

/**
 * Prepares merged styles for form components based on provider styles, UI library settings, and component styles.
 * This is a utility function used by FormField, DependantField, and other components.
 *
 * @param providerStyles - Styles from the FormProvider
 * @param uiLibrary - UI library configuration
 * @param componentStyles - Component-specific style overrides
 * @returns Merged styles object
 */
export function prepareStyles(
    providerStyles?: FormProviderStyleOptions,
    uiLibrary?: UILibraryOptions,
    componentStyles?: Record<string, string>
): FormProviderStyleOptions {
    // If using a UI library, use the modified styles that don't style inputs
    const baseStyles = uiLibrary?.enabled ? getUiLibraryCompatibleStyles(defaultStyles) : defaultStyles;

    // Filter provider styles if using a UI library
    const filteredProviderStyles = uiLibrary?.enabled ? getUiLibraryCompatibleStyles(providerStyles) : providerStyles;

    // Merge styles
    return mergeStyles(baseStyles, filteredProviderStyles || {}, componentStyles);
}

/**
 * Extracts field styles from merged styles for passing to render functions.
 *
 * @param mergedStyles - The merged styles object
 * @returns Field styles object with input, select, etc. properties
 */
export function extractFieldStyles(mergedStyles?: FormProviderStyleOptions): FieldStyleOptions {
    if (!mergedStyles?.field) {
        return {};
    }

    return {
        input: mergedStyles.field?.input ? String(cn(mergedStyles.field.input)) : undefined,
        select: mergedStyles.field?.select ? String(cn(mergedStyles.field.select)) : undefined,
        textarea: mergedStyles.field?.textarea ? String(cn(mergedStyles.field.textarea)) : undefined,
        checkbox: mergedStyles.field?.checkbox ? String(cn(mergedStyles.field.checkbox)) : undefined,
        isValid: mergedStyles.field?.isValid ? String(cn(mergedStyles.field.isValid)) : undefined,
        isInvalid: mergedStyles.field?.isInvalid ? String(cn(mergedStyles.field.isInvalid)) : undefined,
        isValidating: mergedStyles.field?.isValidating ? String(cn(mergedStyles.field.isValidating)) : undefined,
        isLoading: mergedStyles.field?.isLoading ? String(cn(mergedStyles.field.isLoading)) : undefined
    };
}
