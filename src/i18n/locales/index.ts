import en from './en.json';
import es from './es.json';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const zodTranslations: Record<SupportedLangs, Record<string, any>> = {
    en,
    es
};

export type SupportedLangs = 'en' | 'es';
