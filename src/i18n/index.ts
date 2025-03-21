import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    required: 'This field is required',
                    email: 'Please enter a valid email address',
                    minLength: 'Must be at least {{min}} characters',
                    maxLength: 'Must be at most {{max}} characters'
                }
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });
export * from './zodErrorMap';
export * from './locales';
