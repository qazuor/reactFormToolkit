import en from './en.json';
import es from './es.json';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const zodTranslations: Record<SupportedLangs, Record<string, any>> = {
    en: en.zod,
    es: es.zod
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const mainTranslations: Record<SupportedLangs, Record<string, any>> = {
    en: en.main,
    es: es.main
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const QRFTTranslations: Record<SupportedLangs, Record<string, any>> = {
    en,
    es
};

export type SupportedLangs = 'en' | 'es';
