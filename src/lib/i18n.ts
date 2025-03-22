import type { I18nOptions, ResourceContent, SupportedLanguage } from '@/types/i18n';
import type { i18n } from 'i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Utility functions for i18n handling
 */
export const i18nUtils = {
    /**
     * Initialize i18n instance with merged resources
     */
    initializeI18n: (options?: I18nOptions): i18n => {
        const i18nInstance = options?.i18n || i18next;
        if (!i18nInstance.isInitialized) {
            const resources = options?.resources
                ? Object.entries(options.resources).reduce<Record<string, { translation: ResourceContent }>>(
                      (acc, [lang, value]) => {
                          acc[lang] = { translation: value };
                          return acc;
                      },
                      {}
                  )
                : {};

            i18nInstance.use(initReactI18next).init({
                lng: options?.lng || 'en',
                fallbackLng: 'en',
                resources,
                interpolation: {
                    escapeValue: false
                },
                returnNull: false
            });
        } else if (options?.resources) {
            // Add or update resources in existing instance
            for (const [lang, value] of Object.entries(options.resources)) {
                i18nInstance.addResourceBundle(lang, 'QRFT', value, true, true);
            }
        }

        if (options?.lng) {
            i18nInstance.changeLanguage(options.lng);
        }

        return i18nInstance;
    },

    /**
     * Gets translation by path with type safety
     */
    getTranslation: (i18n: i18n, path: string, params?: Record<string, string | number>): string => {
        return i18n.t(path, params) || path;
    },

    /**
     * Gets current language with type safety
     */
    getCurrentLanguage: (i18n: i18n): SupportedLanguage => {
        return (i18n.language || 'en') as SupportedLanguage;
    }
};
