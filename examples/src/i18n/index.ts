import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en,
            es
        },
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator']
        }
    });
