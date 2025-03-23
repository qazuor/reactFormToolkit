import { describe, expect, it } from 'vitest';
import { defaultStyles, mergeStyles } from '../../lib/styles';
import type { FormProviderStyleOptions } from '../../types/styles';

describe('Style System', () => {
    describe('defaultStyles', () => {
        it('should have all required style categories', () => {
            expect(defaultStyles).toHaveProperty('field');
            expect(defaultStyles).toHaveProperty('form');
            expect(defaultStyles).toHaveProperty('buttons');
            expect(defaultStyles).toHaveProperty('tooltip');
        });

        it('should have all required field styles', () => {
            expect(defaultStyles.field).toHaveProperty('wrapper');
            expect(defaultStyles.field).toHaveProperty('label');
            expect(defaultStyles.field).toHaveProperty('input');
            expect(defaultStyles.field).toHaveProperty('isValid');
            expect(defaultStyles.field).toHaveProperty('isInvalid');
        });
    });

    describe('mergeStyles', () => {
        it('should merge provider styles with defaults', () => {
            const providerStyles: FormProviderStyleOptions = {
                field: {
                    input: 'custom-input',
                    label: 'custom-label'
                }
            };

            const merged = mergeStyles(defaultStyles, providerStyles);
            expect(merged.field?.input).toBe('custom-input');
            expect(merged.field?.label).toBe('custom-label');
            expect(merged.field?.wrapper).toBe(defaultStyles.field?.wrapper);
        });

        it('should merge component styles with provider styles', () => {
            const providerStyles: FormProviderStyleOptions = {
                field: {
                    input: 'provider-input'
                }
            };

            const componentStyles = {
                input: 'component-input'
            };

            const merged = mergeStyles(defaultStyles, providerStyles, componentStyles);
            expect(merged.field?.input).toContain('component-input');
        });

        it('should preserve default styles when no overrides provided', () => {
            const merged = mergeStyles(defaultStyles);
            expect(merged).toEqual(defaultStyles);
        });
    });
});
