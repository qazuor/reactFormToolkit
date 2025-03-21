/**
 * Options for internationalization (i18n).
 */
export interface I18nOptions {
    /** Custom resources to merge with the default resources */
    resources?: TranslationResources;
    /** Language to use (defaults to 'en') */
    lng?: string;
    /** Custom i18next instance */
    i18n?: import('i18next').i18n;
}

/**
 * Default i18next resources containing translations for all supported languages.
 */
export type TranslationResources = {
    [key: string]: {
        zod: {
            errors: {
                [key: string]: string | { [key: string]: string | { [key: string]: string } };
            };
            validations?: { [key: string]: string };
            types?: { [key: string]: string };
        };
    };
};
