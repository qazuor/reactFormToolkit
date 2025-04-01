import { findFieldNames } from '@/lib/conditional-field';
import type { UseConditionalFieldOptions } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    const watchSubscriptionRef = useRef<{ unsubscribe: () => void }>();
    const initialValueRef = useRef<boolean>(true);

    const evaluateCondition = useCallback(
        (value: unknown) => {
            return typeof condition === 'function'
                ? (condition as (value: unknown) => boolean)(value)
                : value === condition;
        },
        [condition]
    );

    // Update condition state when watched field changes
    useEffect(() => {
        // Initial evaluation
        const watchedValue = form.getValues(watchField);
        const initialConditionMet = evaluateCondition(watchedValue);

        if (initialValueRef.current) {
            setIsConditionMet(initialConditionMet);
            setPreviousCondition(initialConditionMet);
            initialValueRef.current = false;
        }

        // Setup watch subscription
        watchSubscriptionRef.current = form.watch((_values, { name }) => {
            // Only update if the watched field changed or if it's the initial watch
            if (name === watchField || name === undefined) {
                const watchedValue = form.getValues(watchField);
                const newConditionMet = evaluateCondition(watchedValue);
                setIsConditionMet(newConditionMet);
            }
        });

        return () => watchSubscriptionRef.current?.unsubscribe();
    }, [form, watchField, evaluateCondition]);

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

    // Cleanup on unmount
    useEffect(() => {
        return () => watchSubscriptionRef.current?.unsubscribe();
    }, []);

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
    const previousValueRef = useRef<string>(currentValue);
    const watchedValueRef = useRef<string | null>(null);

    // Memoize the watch callback
    const watchCallback = useCallback(
        (_values: unknown, { name }: { name?: string }) => {
            if (name !== watchField && name !== undefined) {
                return;
            }

            const watchedValue = form.getValues(watchField) as string;
            if (watchedValue === watchedValueRef.current) {
                return;
            }

            watchedValueRef.current = watchedValue;
            setCurrentValue(watchedValue);
        },
        [form, watchField]
    );

    // Set up watch subscription
    useEffect(() => {
        const subscription = form.watch(watchCallback);
        watchCallback({}, { name: watchField });
        return () => subscription.unsubscribe();
    }, [form, watchField, watchCallback]);

    // Handle field registration/unregistration when visibility changes
    useEffect(() => {
        const previousValue = previousValueRef.current;
        previousValueRef.current = currentValue;

        if (!keepRegistered && currentValue !== previousValue) {
            // Collect field names to unregister
            const fieldsToUnregister = collectFieldNamesForUnregistration(conditions, currentValue);

            if (fieldsToUnregister.size > 0) {
                for (const fieldName of fieldsToUnregister) {
                    form.unregister(fieldName as FieldPath<TFieldValues>);
                }
            }
        }
    }, [form, currentValue, conditions, keepRegistered]);

    return { currentValue, conditions };
}
