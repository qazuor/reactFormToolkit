import type { I18nOptions, ResourceContent, SupportedLanguage } from '@/types';
import type { i18n } from 'i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { QRFTTranslations } from '../i18n/locales';

let globalI18nInstance: i18n | null = null;

const addNamespaceToTranslations = (translations: Record<string, ResourceContent>, namespace: string) => {
    return Object.entries(translations).reduce<Record<string, { [namespace]: ResourceContent }>>(
        (acc, [lang, value]) => {
            acc[lang] = { [namespace]: value };
            return acc;
        },
        {}
    );
};

/**
 * Utility functions for i18n handling
 */
export const i18nUtils = {
    /**
     * Get or create i18n instance
     */
    getI18nInstance: (): i18n => {
        if (globalI18nInstance) {
            return globalI18nInstance;
        }

        // Create new instance with default translations
        const i18nInstance = i18next.createInstance();
        i18nInstance
            .use(LanguageDetector)
            .use(initReactI18next)
            .init({
                resources: addNamespaceToTranslations(QRFTTranslations, 'QRFT'),
                fallbackLng: 'en',
                interpolation: {
                    escapeValue: false
                },
                returnNull: false
            });

        globalI18nInstance = i18nInstance;
        return i18nInstance;
    },

    /**
     * Initialize i18n instance with merged resources
     */
    initializeI18n: (options?: I18nOptions): i18n => {
        // Use provided instance or get/create global instance
        const i18nInstance = options?.i18n || i18nUtils.getI18nInstance();
        const targetLanguage = options?.lng || 'en';

        if (!i18nInstance.isInitialized) {
            const resources = options?.resources
                ? // biome-ignore lint/style/useNamingConvention: <explanation>
                  Object.entries(options.resources).reduce<Record<string, { QRFT: ResourceContent }>>(
                      (acc, [lang, value]) => {
                          // biome-ignore lint/style/useNamingConvention: <explanation>
                          acc[lang] = { QRFT: value };
                          return acc;
                      },
                      {}
                  )
                : {};

            // Initialize with target language
            i18nInstance.use(initReactI18next).init({
                lng: targetLanguage,
                fallbackLng: 'en',
                resources: {
                    ...QRFTTranslations,
                    ...resources
                },
                interpolation: {
                    escapeValue: false
                },
                returnNull: false
            });
        } else if (options?.resources) {
            // Add or update resources in existing instance under QRFT namespace
            for (const [lang, value] of Object.entries(options.resources)) {
                i18nInstance.addResourceBundle(lang, 'QRFT', value, true, true);
            }
        }

        // Always ensure language is set correctly
        if (options?.lng) {
            i18nInstance.changeLanguage(targetLanguage);
        }

        globalI18nInstance = i18nInstance;
        return i18nInstance;
    },

    /**
     * Gets translation by path with type safety
     */
    getTranslation: (i18n: i18n, path: string, params?: Record<string, string | number>): string => {
        const i18nInstance = i18n || i18nUtils.getI18nInstance();
        return i18nInstance.t(path, params) || path;
    },

    /**
     * Gets current language with type safety
     */
    getCurrentLanguage: (i18n: i18n): SupportedLanguage => {
        const i18nInstance = i18n || i18nUtils.getI18nInstance();
        return (i18nInstance.language || 'en') as SupportedLanguage;
    }
};
