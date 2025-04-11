import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';
import { getFieldSchema } from './utils';

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
    isFieldRequired: <TFieldValues extends FieldValues = FieldValues>(
        fieldName: keyof TFieldValues & string,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        schema?: any
    ): boolean => {
        if (!schema) {
            return false;
        }

        let fieldSchema = getFieldSchema(schema, fieldName);
        if (!fieldSchema) {
            fieldSchema = schema.shape[fieldName];
        }

        try {
            // Check if field is required by attempting to parse undefined
            try {
                if (fieldSchema) {
                    fieldSchema.parse(undefined);
                }
                return false; // If parsing undefined succeeds, field is optional
            } catch {
                return true; // If parsing undefined fails, field is required
            }
        } catch (error) {
            console.warn('Error getting field is optional validation:', error);
            return false;
        }
    },

    /**
     * Gets field validation rules from schema
     */
    getFieldValidation: <TFieldValues extends FieldValues = FieldValues>(
        fieldName: keyof TFieldValues & string,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        schema?: any
    ) => {
        if (!schema) {
            return {};
        }
        let fieldSchema = getFieldSchema(schema, fieldName);
        if (!fieldSchema) {
            fieldSchema = schema.shape[fieldName];
        }
        try {
            // Return validation rules if they exist
            return fieldSchema && '_def' in fieldSchema ? fieldSchema._def.checks || {} : {};
        } catch (error) {
            console.warn('Error getting field validation:', error);
            return {};
        }
    }
};
