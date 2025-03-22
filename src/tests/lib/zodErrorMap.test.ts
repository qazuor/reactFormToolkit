import type { TFunction, i18n } from 'i18next';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { ErrorMapCtx } from 'zod';
import { getI18nextZodErrorMap } from '../../i18n/zodErrorMap';
import { getMockI18n } from './i18nMock';

describe('getI18nextZodErrorMap', () => {
    const mockT: TFunction = ((key: string, params?: Record<string, unknown>) => {
        if (key === 'zod.errors.invalid_type') {
            return `Expected ${params?.expected}, received ${params?.received}`;
        }
        if (key === 'zod.errors.too_small.string.inclusive') {
            return `Must be at least ${params?.minimum} characters`;
        }
        if (key === 'zod.errors.invalid_string.email') {
            return 'Invalid email';
        }
        if (key === 'zod.types.string') {
            return 'string';
        }
        if (key === 'zod.types.number') {
            return 'number';
        }
        return key;
    }) as TFunction;

    const mockI18n = getMockI18n();
    mockI18n.t = mockT;

    const errorMap = getI18nextZodErrorMap(mockI18n as unknown as i18n);

    const mockCtx: ErrorMapCtx = {
        defaultError: 'Default error',
        data: {}
    };

    describe('type validation', () => {
        it('should handle invalid type errors', () => {
            const schema = z.string();
            try {
                schema.parse(123);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const message = errorMap(error.issues[0], mockCtx).message;
                    expect(message).toContain('Expected string');
                }
            }
        });
    });

    describe('string validation', () => {
        it('should handle email validation', () => {
            const schema = z.string().email();
            try {
                schema.parse('invalid-email');
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const message = errorMap(error.issues[0], mockCtx).message;
                    expect(message).toBe('Invalid email');
                }
            }
        });

        it('should handle min length validation', () => {
            const schema = z.string().min(5);
            try {
                schema.parse('abc');
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const message = errorMap(error.issues[0], mockCtx).message;
                    expect(message).toContain('Must be at least 5 characters');
                }
            }
        });
    });
});
