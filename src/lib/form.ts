import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Utility type for form configuration
 */
export interface FormConfig<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues>;
    schema?: ZodType<TFieldValues>;
}

/**
 * Utility functions for form handling
 */
export const formUtils = {
    /**
     * Validates if a field is required based on schema
     */
    isFieldRequired: <TFieldValues extends FieldValues>(
        fieldName: keyof TFieldValues,
        schema?: ZodType<TFieldValues>
    ): boolean => {
        if (!schema) {
            return false;
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const shape = (schema as any)._def.shape();
        return shape?.[fieldName]?._def?.typeName === 'ZodString' && !shape[fieldName]._def.isOptional;
    },

    /**
     * Gets field validation rules from schema
     */
    getFieldValidation: <TFieldValues extends FieldValues>(
        fieldName: keyof TFieldValues,
        schema?: ZodType<TFieldValues>
    ) => {
        if (!schema) {
            return {};
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const shape = (schema as any)._def.shape?.();
        return shape?.[fieldName]?._def?.checks || {};
    }
};
