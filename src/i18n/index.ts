/**
 * Internationalization (i18n) configuration for React Form Toolkit.
 * This module sets up i18next with the necessary resources and configuration.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { TranslationResources } from '../types';
// Import locales
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

export const resources: TranslationResources = {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    pt: { translation: pt }
};

// Flag to track if i18n has been initialized
let isInitialized = false;

/* Initialize i18next with default configuration.
 * This is used internally by the library, but can be overridden by the user.
 *
 * @param customResources - Optional custom resources to merge with the default resources
 * @param lng - Optional language to use (defaults to 'en')
 * @returns The initialized i18next instance
 */
export const initI18n = (customResources?: TranslationResources, lng = 'en') => {
    // Merge custom resources with default resources
    const mergedResources = customResources
        ? Object.keys(resources).reduce(
              (acc, lang) => {
                  acc[lang] = {
                      translation: {
                          ...resources[lang].translation,
                          ...(customResources[lang]?.translation || {})
                      }
                  };
                  return acc;
              },
              {} as typeof resources
          )
        : resources;

    // Initialize i18next only if it hasn't been initialized yet or if we're in a test environment
    // biome-ignore lint/nursery/noProcessEnv: <explanation>
    if (!isInitialized || process.env.NODE_ENV === 'test') {
        i18n.use(initReactI18next).init({
            resources: mergedResources,
            lng,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false // React already escapes values
            },
            react: {
                useSuspense: false // This is important for tests
            }
        });

        isInitialized = true;
    } else {
        // If already initialized, just update the resources and language
        for (const lang of Object.keys(mergedResources)) {
            i18n.addResourceBundle(lang, 'translation', mergedResources[lang].translation, true, true);
        }

        if (lng) {
            i18n.changeLanguage(lng);
        }
    }

    return i18n;
};

// Initialize with default settings
initI18n();

// biome-ignore lint/style/noDefaultExport: <explanation>
export default i18n;
