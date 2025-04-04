import { describe, expect, it } from 'vitest';
import { getUiLibraryCompatibleStyles, shouldApplyInputStyles } from '../../lib/ui-library';

describe('UI Library Utilities', () => {
    describe('shouldApplyInputStyles', () => {
        it('should return true when uiLibrary is undefined', () => {
            expect(shouldApplyInputStyles(undefined)).toBe(true);
        });

        it('should return true when uiLibrary.enabled is false', () => {
            expect(shouldApplyInputStyles({ enabled: false })).toBe(true);
        });

        it('should return false when uiLibrary.enabled is true', () => {
            expect(shouldApplyInputStyles({ enabled: true })).toBe(false);
        });

        it('should return true when uiLibrary.enabled is undefined', () => {
            expect(shouldApplyInputStyles({})).toBe(true);
        });

        it('should return false when using a named UI library', () => {
            expect(shouldApplyInputStyles({ enabled: true, name: 'material-ui' })).toBe(false);
        });
    });

    describe('getUiLibraryCompatibleStyles', () => {
        it('should remove input-specific styles', () => {
            const mockDefaultStyles = {
                field: {
                    wrapper: 'wrapper-class',
                    label: 'label-class',
                    input: 'input-class',
                    select: 'select-class',
                    textarea: 'textarea-class',
                    checkbox: 'checkbox-class',
                    description: 'description-class',
                    error: 'error-class',
                    isValid: 'valid-class',
                    isInvalid: 'invalid-class'
                },
                form: {
                    wrapper: 'form-wrapper-class'
                }
            };

            const result = getUiLibraryCompatibleStyles(mockDefaultStyles);

            // Should keep non-input styles
            expect(result.field.wrapper).toBe('wrapper-class');
            expect(result.field.label).toBe('label-class');
            expect(result.field.description).toBe('description-class');
            expect(result.field.error).toBe('error-class');

            // Should remove input styles
            expect(result.field.input).toBeUndefined();
            expect(result.field.select).toBeUndefined();
            expect(result.field.textarea).toBeUndefined();
            expect(result.field.checkbox).toBeUndefined();

            // Should remove validation state styles for inputs
            expect(result.field.isValid).toBeUndefined();
            expect(result.field.isInvalid).toBeUndefined();

            // Should preserve other sections
            expect(result.form.wrapper).toBe('form-wrapper-class');
        });
    });
});
