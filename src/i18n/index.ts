import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { mainTranslations, zodTranslations } from './locales';

const zodResources = Object.entries(zodTranslations).reduce(
    (acc: { [key: string]: { translation: typeof value } }, [lang, value]) => {
        acc[lang] = { translation: value };
        return acc;
    },
    {}
);

const mainResources = Object.entries(mainTranslations).reduce(
    (acc: { [key: string]: { translation: typeof value } }, [lang, value]) => {
        acc[lang] = { translation: value };
        return acc;
    },
    {}
);

const resources = Object.assign({}, mainResources, zodResources);

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        returnNull: false
    });

export * from './zodErrorMap';
