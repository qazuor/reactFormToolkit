import type { ReactNode } from 'react';
import React from 'react';

/**
 * Checks if a React element is a FormField component with a name prop
 * @param element The React element to check
 * @returns The field name if found, undefined otherwise
 */
function getFieldNameFromElement(element: React.ReactElement): string | undefined {
    if (
        element.type &&
        typeof element.type !== 'string' &&
        'name' in element.props &&
        typeof element.props.name === 'string'
    ) {
        return element.props.name;
    }
    return undefined;
}

/**
 * Processes children of a React element to find field names
 * @param children The children to process
 * @returns Array of field names found
 */
function processChildren(children: ReactNode): string[] {
    if (!children) {
        return [];
    }

    if (Array.isArray(children)) {
        return processNodeArray(children);
    }

    return findFieldNames(children);
}

/**
 * Processes an array of React nodes to find field names
 * @param nodeArray The array of nodes to process
 * @returns Array of field names found
 */
function processNodeArray(nodeArray: ReactNode[]): string[] {
    const fieldNames: string[] = [];

    for (const child of nodeArray) {
        const names = findFieldNames(child);
        fieldNames.push(...names);
    }

    return fieldNames;
}

/**
 * Helper function to find all field names within a React node tree.
 * This is used to unregister fields when they are hidden.
 */
export function findFieldNames(node: ReactNode): string[] {
    const fieldNames: string[] = [];

    // Process React elements
    if (React.isValidElement(node)) {
        // Check if this is a FormField component with a name prop
        const fieldName = getFieldNameFromElement(node);
        if (fieldName) {
            fieldNames.push(fieldName);
        }

        // Process children
        const childFieldNames = processChildren(node.props?.children);
        fieldNames.push(...childFieldNames);
    }

    // Process arrays of nodes
    if (Array.isArray(node)) {
        const arrayFieldNames = processNodeArray(node);
        fieldNames.push(...arrayFieldNames);
    }

    return fieldNames;
}

/**
 * Evaluates a condition against a value.
 * The condition can be a value to match or a function that returns a boolean.
 *
 * @param value The value to evaluate
 * @param condition The condition to evaluate against
 * @returns True if the condition is met, false otherwise
 */
export function evaluateCondition(value: unknown, condition: unknown): boolean {
    if (typeof condition === 'function') {
        return (condition as (value: unknown) => boolean)(value);
    }
    return value === condition;
}
