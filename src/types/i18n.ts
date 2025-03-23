/**
 * Options for internationalization (i18n).
 */
export type SupportedLanguage = 'en' | 'es';

export type ValidationType = 'email' | 'url' | 'uuid' | 'cuid' | 'regex' | 'datetime';

export type ZodErrorType =
    | 'invalid_type'
    | 'invalid_literal'
    | 'unrecognized_keys'
    | 'invalid_union'
    | 'invalid_union_discriminator'
    | 'invalid_enum_value'
    | 'invalid_arguments'
    | 'invalid_return_type'
    | 'invalid_date'
    | 'custom'
    | 'invalid_intersection_types'
    | 'not_multiple_of'
    | 'not_finite';

export interface I18nOptions<T extends SupportedLanguage = SupportedLanguage> {
    /** Custom resources to merge with the default resources */
    resources?: Partial<Record<T, ResourceContent>>;
    /** Language to use (defaults to 'en') */
    lng?: T;
    /** Custom i18next instance */
    i18n?: import('i18next').i18n;
}

export interface ResourceContent {
    zod?: {
        errors?: Partial<Record<ZodErrorType, string | Record<string, string | Record<string, string>>>>;
        validations?: Partial<Record<ValidationType, string>>;
        types?: Record<string, string>;
    };
    form?: Record<string, string>;
    [key: string]: unknown;
}

export type TranslationResources = Record<SupportedLanguage, ResourceContent>;
