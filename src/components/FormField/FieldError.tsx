import { FieldErrorIcon } from '@/components/Icons';
import type { FieldErrorProps } from '@/types/field';
import type { JSX } from 'react';

/**
 * FieldError component for displaying field validation errors
 * @param props - Component properties
 * @returns Form field error component
 */
export function FieldError({ message }: FieldErrorProps): JSX.Element | null {
    if (!message) {
        return null;
    }

    return (
        <div className='mt-1 flex items-center gap-1 text-red-600 text-sm'>
            <FieldErrorIcon />
            <span>{message}</span>
        </div>
    );
}
