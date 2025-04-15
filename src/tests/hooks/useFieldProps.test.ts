import type { FieldValues, Path } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { useFieldProps } from '../../hooks/useFieldProps';

describe('useFieldProps', () => {
    it('should return correct props for regular inputs', () => {
        const field = {
            name: 'testField',
            value: 'test value',
            onChange: () => {
                // Mock onChange
            },
            onBlur: () => {
                // Mock onBlur
            },
            ref: () => {
                // Mock ref
            }
        };

        const childProps = {
            placeholder: 'Enter value',
            className: 'child-class'
        };

        // Create expected className using the cn function
        const expectedClassName = 'parent-class child-class';

        const result = useFieldProps({
            field: field as any,
            isCheckbox: false,
            fieldPath: 'testField' as Path<any>,
            className: 'parent-class',
            ariaInvalid: false,
            ariaDescribedBy: 'test-description',
            childProps
        });

        expect(result).toEqual({
            name: 'testField',
            value: 'test value',
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
            placeholder: 'Enter value',
            className: expectedClassName,
            id: 'testField',
            'data-testid': 'testField',
            'aria-invalid': false,
            'aria-describedby': 'test-description'
        });
    });

    it('should handle checkbox inputs correctly', () => {
        const field = {
            name: 'checkboxField',
            value: true,
            onChange: () => {
                // Mock onChange
            },
            onBlur: () => {
                // Mock onBlur
            },
            ref: () => {
                // Mock ref
            }
        };

        const result = useFieldProps({
            field: field as any,
            isCheckbox: true,
            fieldPath: 'checkboxField' as Path<any>,
            className: 'checkbox-class',
            ariaInvalid: false,
            childProps: {}
        });

        expect(result).toEqual({
            name: 'checkboxField',
            value: true,
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
            checked: true,
            className: 'checkbox-class',
            id: 'checkboxField',
            'data-testid': 'checkboxField',
            'aria-invalid': false
        });
    });

    it('should handle undefined values', () => {
        const field = {
            name: 'testField',
            value: undefined,
            onChange: () => {
                // Mock onChange
            },
            onBlur: () => {
                // Mock onBlur
            },
            ref: () => {
                // Mock ref
            }
        };

        const result = useFieldProps<FieldValues>({
            field: field as any,
            isCheckbox: false,
            fieldPath: 'testField' as Path<any>,
            className: 'test-class',
            ariaInvalid: false,
            childProps: {}
        });

        expect(result.value).toBe('');
    });

    it('should handle null values', () => {
        const field = {
            name: 'testField',
            value: null,
            onChange: () => {
                // Mock onChange
            },
            onBlur: () => {
                // Mock onBlur
            },
            ref: () => {
                // Mock ref
            }
        };

        const result = useFieldProps<FieldValues>({
            field: field as any,
            isCheckbox: false,
            fieldPath: 'testField' as Path<any>,
            className: 'test-class',
            ariaInvalid: false,
            childProps: {}
        });

        expect(result.value).toBe('');
    });

    it('should merge aria attributes correctly', () => {
        const field = {
            name: 'testField',
            value: 'test',
            onChange: () => {
                // Mock onChange
            },
            onBlur: () => {
                // Mock onBlur
            },
            ref: () => {
                // Mock ref
            }
        };

        const childProps = {
            'aria-label': 'Test field',
            'aria-required': 'true'
        };

        const result = useFieldProps<FieldValues>({
            field: field as any,
            isCheckbox: false,
            fieldPath: 'testField' as Path<any>,
            className: 'test-class',
            ariaInvalid: true,
            ariaDescribedBy: 'test-description',
            childProps
        });

        expect(result['aria-label']).toBe('Test field');
        expect(result['aria-required']).toBe('true');
        expect(result['aria-invalid']).toBe(true);
        expect(result['aria-describedby']).toBe('test-description');
    });
});
