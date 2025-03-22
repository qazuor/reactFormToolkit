import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formUtils } from '../../lib/form';

describe('formUtils', () => {
    const schema = z.object({
        required: z.string(),
        optional: z.string().optional(),
        number: z.number()
    });

    describe('isFieldRequired', () => {
        it('should correctly identify required fields', () => {
            expect(formUtils.isFieldRequired('required', schema)).toBe(true);
            expect(formUtils.isFieldRequired('optional', schema)).toBe(false);
        });

        it('should handle non-string fields', () => {
            expect(formUtils.isFieldRequired('number', schema)).toBe(false);
        });

        it('should handle undefined schema', () => {
            expect(formUtils.isFieldRequired('field', undefined)).toBe(false);
        });
    });

    describe('getFieldValidation', () => {
        it('should return validation rules for field', () => {
            const emailSchema = z.object({
                email: z.string().email().min(5)
            });

            const rules = formUtils.getFieldValidation('email', emailSchema);
            expect(rules).toHaveLength(2);
        });

        it('should handle undefined schema', () => {
            expect(formUtils.getFieldValidation('field', undefined)).toEqual({});
        });
    });
});
