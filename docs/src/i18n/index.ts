import { getI18nextZodErrorMap } from '@qazuor/react-form-toolkit';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import en from './locales/en.json';
import es from './locales/es.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'en',
        resources: {
            en,
            es
        },
        supportedLngs: ['en', 'es'],
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false
        }
        // detection: {
        //     order: ['localStorage', 'navigator']
        // },
        // react: { useSuspense: true }
    });

z.setErrorMap(getI18nextZodErrorMap(i18n));

export default i18n;
