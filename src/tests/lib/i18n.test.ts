import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { i18nUtils } from '../../lib/i18n';
import type { I18nOptions, ResourceContent } from '../../types/i18n';
import { getMockI18n } from './i18nMock';

describe('i18nUtils', () => {
    const resources: Record<string, Record<string, any>> = {};

    const mockI18n = getMockI18n();

    beforeEach(() => {
        // Reset resources and mock state
        for (const key of Object.keys(resources)) {
            delete resources[key];
        }
        mockI18n.isInitialized = false;
        vi.clearAllMocks();
    });

    describe('initializeI18n', () => {
        it('should initialize new i18n instance with default values', () => {
            const i18n = i18nUtils.initializeI18n();
            expect(i18n.language.split('-')[0]).toBe('en');
        });

        it('should merge custom resources with defaults', () => {
            const options: I18nOptions = {
                resources: {
                    en: { key: 'value' }
                },
                i18n: mockI18n as unknown as i18n
            };
            const i18n = i18nUtils.initializeI18n(options);
            expect(i18n.getResource('en', 'QRFT', 'key')).toBe('value');
        });

        it('should use provided language', () => {
            i18nUtils.initializeI18n({ lng: 'es', i18n: mockI18n as unknown as i18n });
            expect(mockI18n.changeLanguage).toHaveBeenCalledWith('es');
        });

        it('should add resources to existing instance', () => {
            mockI18n.isInitialized = true;
            const options: I18nOptions = {
                i18n: mockI18n as unknown as i18n,
                resources: {
                    en: { key: 'value' } as ResourceContent
                }
            };
            i18nUtils.initializeI18n(options);
            expect(mockI18n.addResourceBundle).toHaveBeenCalledWith('en', 'QRFT', { key: 'value' }, true, true);
        });
    });

    describe('getTranslation', () => {
        it('should return translated string', () => {
            const result = i18nUtils.getTranslation(mockI18n as unknown as i18n, 'test.key');
            expect(result).toBe('test.key');
        });

        it('should handle parameters', () => {
            const result = i18nUtils.getTranslation(mockI18n as unknown as i18n, 'test.key', { value: 5 });
            expect(result).toBe('test.key {"value":5}');
        });
    });

    describe('getCurrentLanguage', () => {
        it('should return current language', () => {
            const lang = i18nUtils.getCurrentLanguage(mockI18n as unknown as i18n);
            expect(lang).toBe('en');
        });

        it('should default to en', () => {
            const lang = i18nUtils.getCurrentLanguage({ language: undefined } as any);
            expect(lang).toBe('en');
        });
    });
});
