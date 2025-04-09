import type { FieldInputRendererProps } from '@/types';
import { type ReactElement, cloneElement, isValidElement, memo } from 'react';

/**
 * FieldInputRenderer component for rendering form input elements
 * This component handles only the rendering logic, separated from state management
 *
 * @param {FieldInputRendererProps} props - Component props
 * @returns {ReactElement} Rendered form input
 *
 * @example
 * ```tsx
 * <FieldInputRenderer
 *   fieldProps={fieldProps}
 *   children={<input type="text" />}
 * />
 * ```
 */
export const FieldInputRenderer = memo(function FieldInputRenderer({
    children,
    fieldProps
}: FieldInputRendererProps): ReactElement {
    if (!isValidElement(children)) {
        return <>{children}</>;
    }

    return <div className='relative'>{cloneElement(children as ReactElement, fieldProps)}</div>;
});
