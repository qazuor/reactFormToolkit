import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { QRFTTranslations } from './locales';

const QRFTResources = Object.entries(QRFTTranslations).reduce(
    (acc: { [key: string]: { translation: typeof value } }, [lang, value]) => {
        acc[lang] = { translation: value };
        return acc;
    },
    {}
);

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: QRFTResources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        returnNull: false
    });

export * from './zodErrorMap';
