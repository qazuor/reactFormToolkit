import { cn } from '@/lib/utils';
import type { FieldInputProps } from '@/types/field';
import { type JSX, type ReactElement, cloneElement, isValidElement } from 'react';

/**
 * FieldInput component for rendering form inputs with proper styling
 * @param props - Component properties
 * @returns Form field input component
 */
export function FieldInput({
    id,
    hasError,
    disabled,
    children,
    description
}: FieldInputProps & { children: ReactElement }): JSX.Element {
    const baseClasses = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors';
    const stateClasses = cn({
        'border-red-300 focus:border-red-500 focus:ring-red-500': hasError,
        'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !hasError,
        'cursor-not-allowed bg-gray-50 text-gray-500': disabled
    });

    if (isValidElement(children)) {
        return cloneElement(children, {
            id: id as string,
            className: cn(baseClasses, stateClasses, children.props.className),
            'aria-describedby': description ? `${id}-description` : undefined,
            disabled
        });
    }
    return <div />;
}
