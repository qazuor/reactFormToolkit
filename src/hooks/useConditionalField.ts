import { findFieldNames } from '@/lib/conditional-field';
import type { Form, UseConditionalFieldOptions } from '@/types';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * Hook for handling conditional field logic based on a single condition
 */
export function useConditionalField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    options: UseConditionalFieldOptions<TFieldValues, TName> & {
        /**
         * The condition to evaluate
         * Can be a value to match or a function that returns a boolean
         */
        condition: unknown | ((value: unknown) => boolean);
    }
) {
    const { form, watchField, condition, keepRegistered = false, content } = options;
    const [isConditionMet, setIsConditionMet] = useState<boolean>(false);
    const [previousCondition, setPreviousCondition] = useState<boolean>(false);

    // Update condition state when watched field changes
    useEffect(() => {
        const subscription = form.watch((_values, { name }) => {
            // Only update if the watched field changed or if it's the initial watch
            if (name === watchField || name === undefined) {
                const watchedValue = form.getValues(watchField);
                const newConditionMet =
                    typeof condition === 'function'
                        ? (condition as (value: unknown) => boolean)(watchedValue)
                        : watchedValue === condition;

                setIsConditionMet(newConditionMet);
            }
        });

        // Initial evaluation
        const watchedValue = form.getValues(watchField);
        const initialConditionMet =
            typeof condition === 'function'
                ? (condition as (value: unknown) => boolean)(watchedValue)
                : watchedValue === condition;

        setIsConditionMet(initialConditionMet);
        setPreviousCondition(initialConditionMet);

        return () => subscription.unsubscribe();
    }, [form, watchField, condition]);

    // Handle field registration/unregistration when visibility changes
    useEffect(() => {
        // Only unregister when condition changes from true to false
        if (!keepRegistered && previousCondition && !isConditionMet) {
            // Find all form fields within content and unregister them
            const fieldNames = Array.isArray(content)
                ? content.flatMap(findFieldNames)
                : typeof content === 'object'
                  ? Object.values(content ?? {}).flatMap(findFieldNames)
                  : findFieldNames(content);

            if (fieldNames.length > 0) {
                // Use timeout to ensure unregister happens after render cycle
                setTimeout(() => {
                    for (const fieldName of fieldNames) {
                        form.unregister(fieldName as FieldPath<TFieldValues>);
                    }
                }, 0);
            }
        }

        // Update previous condition
        setPreviousCondition(isConditionMet);
    }, [form, isConditionMet, keepRegistered, content, previousCondition]);

    return { isConditionMet };
}

/**
 * Collects field names from conditions that don't match the current value
 */
function collectFieldNamesForUnregistration(conditions: Record<string, ReactNode>, currentValue: string): Set<string> {
    const allFieldNames = new Set<string>();

    for (const [key, conditionContent] of Object.entries(conditions)) {
        // Only collect field names for conditions that don't match the current value
        if (key !== currentValue) {
            for (const name of findFieldNames(conditionContent)) {
                allFieldNames.add(name);
            }
        }
    }

    return allFieldNames;
}

/**
 * Unregisters fields that are not in the current condition
 */
function unregisterFields<TFieldValues extends FieldValues>(form: Form<TFieldValues>, fieldNames: Set<string>): void {
    if (fieldNames.size > 0) {
        // Use timeout to ensure unregister happens after render cycle
        setTimeout(() => {
            for (const fieldName of fieldNames) {
                form.unregister(fieldName as FieldPath<TFieldValues>);
            }
        }, 0);
    }
}

/**
 * Determines if fields should be unregistered based on current state
 */
function shouldUnregisterFields(
    keepRegistered: boolean,
    initialized: boolean,
    currentValue: string,
    previousValue: string
): boolean {
    return !keepRegistered && (currentValue !== previousValue || !initialized);
}

/**
 * Hook for handling conditional field group logic based on multiple conditions
 */
export function useConditionalFieldGroup<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    options: UseConditionalFieldOptions<TFieldValues, TName> & {
        /**
         * Object mapping field values to the content to render
         */
        conditions: Record<string, ReactNode>;
    }
) {
    const { form, watchField, conditions, keepRegistered = false } = options;
    const [currentValue, setCurrentValue] = useState<string>('');
    const [previousValue, setPreviousValue] = useState<string>('');
    const [initialized, setInitialized] = useState(false);

    // Update current value when watched field changes
    useEffect(() => {
        const subscription = form.watch((_values, { name }) => {
            // Only update if the watched field changed or if it's the initial watch
            if (name === watchField || name === undefined) {
                const watchedValue = form.getValues(watchField) as string;
                setCurrentValue(watchedValue);
            }
        });

        // Initial value
        const initialValue = form.getValues(watchField) as string;
        setCurrentValue(initialValue);
        setPreviousValue(initialValue);

        return () => subscription.unsubscribe();
    }, [form, watchField]);

    // Handle field registration/unregistration when visibility changes
    useEffect(() => {
        // Skip the first render to avoid unregistering fields on mount
        if (!initialized) {
            setInitialized(true);
            return;
        }

        if (shouldUnregisterFields(keepRegistered, initialized, currentValue, previousValue)) {
            // Collect field names to unregister
            const fieldsToUnregister = collectFieldNamesForUnregistration(conditions, currentValue);

            // Unregister fields
            unregisterFields(form, fieldsToUnregister);

            // Update previous value
            setPreviousValue(currentValue);
        }
    }, [form, currentValue, previousValue, conditions, keepRegistered, initialized]);

    return { currentValue, conditions };
}
