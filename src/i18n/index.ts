import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { zodTranslations } from './locales';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: Object.entries(zodTranslations).reduce(
            (acc: { [key: string]: { translation: typeof value } }, [lang, value]) => {
                acc[lang] = { translation: value };
                return acc;
            },
            {}
        ),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        returnNull: false
    });

export * from './zodErrorMap';
