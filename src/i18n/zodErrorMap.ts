import type { i18n } from 'i18next';
import {
    type ErrorMapCtx,
    type ZodCustomIssue,
    type ZodErrorMap,
    type ZodInvalidArgumentsIssue,
    type ZodInvalidDateIssue,
    type ZodInvalidEnumValueIssue,
    type ZodInvalidIntersectionTypesIssue,
    type ZodInvalidLiteralIssue,
    type ZodInvalidReturnTypeIssue,
    type ZodInvalidStringIssue,
    type ZodInvalidTypeIssue,
    type ZodInvalidUnionDiscriminatorIssue,
    type ZodInvalidUnionIssue,
    ZodIssueCode,
    type ZodIssueOptionalMessage,
    type ZodNotFiniteIssue,
    type ZodNotMultipleOfIssue,
    ZodParsedType,
    type ZodTooBigIssue,
    type ZodTooSmallIssue,
    type ZodUnrecognizedKeysIssue
} from 'zod';
import { type SupportedLangs, zodTranslations } from './locales';

// TODO: Move this to a shared utils file
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const jsonStringifyReplacer = (_: string, value: any): any => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const joinValues = <T extends any[]>(array: T, separator = ' | '): string => {
    return array.map((val) => (typeof val === 'string' ? `'${val}'` : val)).join(separator);
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    for (const key in value) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) {
            return false;
        }
    }

    return true;
};

const getKeyAndValues = (
    param: unknown,
    defaultKey: string
): {
    values: Record<string, unknown>;
    key: string;
} => {
    if (typeof param === 'string') {
        return { key: param, values: {} };
    }

    if (isRecord(param)) {
        const key = 'key' in param && typeof param.key === 'string' ? param.key : defaultKey;
        const values = 'values' in param && isRecord(param.values) ? param.values : {};
        return { key, values };
    }

    return { key: defaultKey, values: {} };
};

export function getTranslationByStringPath(
    lang: SupportedLangs,
    pathStr: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    params?: Record<string, any>
): string | undefined {
    const translationRoot = zodTranslations[lang];
    const translation = pathStr.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), translationRoot);
    if (typeof translation !== 'string') {
        return undefined;
    }
    return params ? fillTemplate(translation, params) : translation;
}

function fillTemplate(template: string, params: Record<string, string>) {
    return Object.entries(params).reduce((acc, [key, value]) => {
        const pattern = new RegExp(`{{${key}}}`, 'g');
        return acc.replace(pattern, value);
    }, template);
}

export function getI18nextZodErrorMap(i18n: i18n): ZodErrorMap {
    return (issue, ctx) => {
        const { code } = issue;
        let message: string | undefined;
        const lang = (i18n.resolvedLanguage || 'en') as SupportedLangs;
        switch (code) {
            case ZodIssueCode.invalid_type:
                message = actForInvalidType(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_literal:
                message = actForInvalidLiteral(issue, ctx, lang);
                break;
            case ZodIssueCode.unrecognized_keys:
                message = actForUnrecognizedKeys(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_union:
                message = actForInvalidUnion(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_union_discriminator:
                message = actForInvalidUnionDiscriminator(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_enum_value:
                message = actForInvalidEnumValue(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_arguments:
                message = actForInvalidArguments(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_return_type:
                message = actForInvalidReturnType(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_date:
                message = actForInvalidDate(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_string:
                message = actForInvalidString(issue, ctx, lang);
                break;
            case ZodIssueCode.too_small:
                message = actForTooSmall(issue, ctx, lang);
                break;
            case ZodIssueCode.too_big:
                message = actForTooBig(issue, ctx, lang);
                break;
            case ZodIssueCode.custom:
                message = actForCustom(issue, ctx, lang);
                break;
            case ZodIssueCode.invalid_intersection_types:
                message = actForInvalidIntersectionTypes(issue, ctx, lang);
                break;
            case ZodIssueCode.not_multiple_of:
                message = actForNotMultipleOf(issue, ctx, lang);
                break;
            case ZodIssueCode.not_finite:
                message = actForNotFinite(issue, ctx, lang);
                break;
            default:
                message = actForDefaultError(issue, ctx, lang);
                break;
        }
        if (!message) {
            return { message: `${ctx.defaultError} - ([Missing translation] ${code})` };
        }
        return {
            message
        };
    };
}


const actForDefaultError = (
    issue: ZodIssueOptionalMessage,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.default_error', { path: issue.path });
};

const actForInvalidType = (issue: ZodInvalidTypeIssue, _ctx: ErrorMapCtx, lang: SupportedLangs): string | undefined => {
    if (issue.received === ZodParsedType.undefined) {
        return getTranslationByStringPath(lang, 'zodErrors.invalid_type_received_undefined', { path: issue.path });
    }
    if (issue.received === ZodParsedType.null) {
        return getTranslationByStringPath(lang, 'zodErrors.invalid_type_received_null', { path: issue.path });
    }
    return getTranslationByStringPath(lang, 'zodErrors.invalid_type', {
        path: issue.path,
        expected:
            getTranslationByStringPath(lang, `types.${issue.expected}`) ||
            (issue.expected as keyof typeof zodTranslations.en.types),
        received:
            getTranslationByStringPath(lang, `types.${issue.received}`) ||
            (issue.received as keyof typeof zodTranslations.en.types)
    });
};

const actForInvalidLiteral = (
    issue: ZodInvalidLiteralIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_literal', {
        path: issue.path,
        expected: JSON.stringify(issue.expected, jsonStringifyReplacer)
    });
};

const actForUnrecognizedKeys = (
    issue: ZodUnrecognizedKeysIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.unrecognized_keys', {
        path: issue.path,
        keys: joinValues(issue.keys, ', '),
        count: issue.keys.length
    });
};

const actForInvalidUnion = (
    issue: ZodInvalidUnionIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_union', { path: issue.path });
};

const actForInvalidUnionDiscriminator = (
    issue: ZodInvalidUnionDiscriminatorIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_union_discriminator', {
        path: issue.path,
        options: joinValues(issue.options)
    });
};

const actForInvalidEnumValue = (
    issue: ZodInvalidEnumValueIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_enum_value', {
        path: issue.path,
        options: joinValues(issue.options),
        received: issue.received
    });
};

const actForInvalidArguments = (
    issue: ZodInvalidArgumentsIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_arguments', { path: issue.path });
};

const actForInvalidReturnType = (
    issue: ZodInvalidReturnTypeIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_return_type', { path: issue.path });
};

const actForInvalidDate = (issue: ZodInvalidDateIssue, _ctx: ErrorMapCtx, lang: SupportedLangs): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_date', { path: issue.path });
};

const actForInvalidString = (
    issue: ZodInvalidStringIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    if (typeof issue.validation === 'object') {
        if ('startsWith' in issue.validation) {
            return getTranslationByStringPath(lang, 'zodErrors.invalid_string.startsWith', {
                path: issue.path,
                startsWith: issue.validation.startsWith
            });
        }

        if ('endsWith' in issue.validation) {
            return getTranslationByStringPath(lang, 'zodErrors.invalid_string.endsWith', {
                path: issue.path,
                endsWith: issue.validation.endsWith
            });
        }
    }
    return getTranslationByStringPath(lang, `zodErrors.invalid_string.${issue.validation}`, {
        path: issue.path,
        validation:
            getTranslationByStringPath(lang, `validations.${issue.validation}`) ||
            (issue.validation as keyof typeof zodTranslations.en.validation)
    });
};

const actForTooSmall = (issue: ZodTooSmallIssue, _ctx: ErrorMapCtx, lang: SupportedLangs): string | undefined => {
    const minimum = issue.type === 'date' ? new Date(issue.minimum as number) : issue.minimum;
    return getTranslationByStringPath(
        lang,
        `zodErrors.too_small.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`,
        {
            path: issue.path,
            minimum,
            count: typeof minimum === 'number' ? minimum : undefined
        }
    );
};

const actForTooBig = (issue: ZodTooBigIssue, _ctx: ErrorMapCtx, lang: SupportedLangs): string | undefined => {
    const maximum = issue.type === 'date' ? new Date(issue.maximum as number) : issue.maximum;
    return getTranslationByStringPath(
        lang,
        `zodErrors.too_big.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`,
        {
            path: issue.path,
            maximum,
            count: typeof maximum === 'number' ? maximum : undefined
        }
    );
};

const actForCustom = (issue: ZodCustomIssue, _ctx: ErrorMapCtx, lang: SupportedLangs): string | undefined => {
    const { key, values } = getKeyAndValues(issue.params?.i18n, 'errors.custom');
    return getTranslationByStringPath(lang, key, {
        ...values,
        path: issue.path
    });
};

const actForInvalidIntersectionTypes = (
    issue: ZodInvalidIntersectionTypesIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.invalid_intersection_types', { path: issue.path });
};

const actForNotMultipleOf = (
    issue: ZodNotMultipleOfIssue,
    _ctx: ErrorMapCtx,
    lang: SupportedLangs
): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.not_multiple_of', {
        path: issue.path,
        multipleOf: issue.multipleOf
    });
};

const actForNotFinite = (issue: ZodNotFiniteIssue, _ctx: ErrorMapCtx, lang: SupportedLangs): string | undefined => {
    return getTranslationByStringPath(lang, 'zodErrors.notFinite', { path: issue.path });
};
