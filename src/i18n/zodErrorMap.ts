import { i18nUtils } from '@/lib/i18n';
import type { i18n } from 'i18next';
import {
    type ErrorMapCtx,
    type ZodErrorMap,
    type ZodInvalidStringIssue,
    type ZodInvalidTypeIssue,
    ZodIssueCode,
    type ZodIssueOptionalMessage,
    ZodParsedType,
    type ZodTooBigIssue,
    type ZodTooSmallIssue
} from 'zod';
import { type SupportedLangs, zodTranslations } from './locales';

/**
 * Creates a Zod error map that uses i18n for error messages
 * @param i18n - i18next instance
 * @returns Zod error map function
 */
export function getI18nextZodErrorMap(i18nInstance: i18n): ZodErrorMap {
    // Initialize i18n with our error messages if needed
    i18nUtils.initializeI18n({ i18n: i18nInstance, resources: zodTranslations });

    return (issue: ZodIssueOptionalMessage, ctx: ErrorMapCtx): { message: string } => {
        const lang = (i18nInstance.language || 'en') as SupportedLangs;
        let message = '';

        switch (issue.code) {
            case ZodIssueCode.invalid_type:
                message = handleInvalidType(issue, lang, i18nInstance);
                break;
            case ZodIssueCode.invalid_string:
                message = handleInvalidString(issue, lang, i18nInstance);
                break;
            case ZodIssueCode.too_small:
                message = handleTooSmall(issue, lang, i18nInstance);
                break;
            case ZodIssueCode.too_big:
                message = handleTooBig(issue, lang, i18nInstance);
                break;
            case ZodIssueCode.invalid_literal:
                message = i18nInstance.t('zod.errors.invalid_literal', {
                    expected: JSON.stringify(issue.expected)
                });
                break;
            case ZodIssueCode.unrecognized_keys:
                message = i18nInstance.t('zod.errors.unrecognized_keys', {
                    keys: (issue.keys || []).join(', ')
                });
                break;
            case ZodIssueCode.invalid_union:
                message = i18nInstance.t('zod.errors.invalid_union');
                break;
            case ZodIssueCode.invalid_union_discriminator:
                message = i18nInstance.t('zod.errors.invalid_union_discriminator', {
                    options: (issue.options || []).join(' | ')
                });
                break;
            case ZodIssueCode.invalid_enum_value:
                message = i18nInstance.t('zod.errors.invalid_enum_value', {
                    options: (issue.options || []).join(' | '),
                    received: issue.received
                });
                break;
            case ZodIssueCode.invalid_arguments:
                message = i18nInstance.t('zod.errors.invalid_arguments');
                break;
            case ZodIssueCode.invalid_return_type:
                message = i18nInstance.t('zod.errors.invalid_return_type');
                break;
            case ZodIssueCode.invalid_date:
                message = i18nInstance.t('zod.errors.invalid_date');
                break;
            case ZodIssueCode.invalid_intersection_types:
                message = i18nInstance.t('zod.errors.invalid_intersection_types');
                break;
            case ZodIssueCode.not_multiple_of:
                message = i18nInstance.t('zod.errors.not_multiple_of', {
                    multipleOf: issue.multipleOf
                });
                break;
            case ZodIssueCode.not_finite:
                message = i18nInstance.t('zod.errors.not_finite');
                break;
            case ZodIssueCode.custom:
                message = i18nInstance.t('zod.errors.custom');
                break;
            default:
                message = ctx.defaultError;
        }

        return {
            message: message.charAt(0).toUpperCase() + message.slice(1) || ctx.defaultError
        };
    };
}

function handleInvalidType(issue: ZodInvalidTypeIssue, _lang: SupportedLangs, i18n: i18n): string {
    if (issue.received === ZodParsedType.undefined) {
        return i18n.t('zod.errors.invalid_type_received_undefined');
    }
    if (issue.received === ZodParsedType.null) {
        return i18n.t('zod.errors.invalid_type_received_null');
    }
    return i18n.t('zod.errors.invalid_type', {
        expected: i18n.t(`zod.types.${issue.expected}`),
        received: i18n.t(`zod.types.${issue.received}`)
    });
}

function handleInvalidString(issue: ZodInvalidStringIssue, _lang: SupportedLangs, i18n: i18n): string {
    if (typeof issue.validation === 'object') {
        if ('startsWith' in issue.validation) {
            return i18n.t('zod.errors.invalid_string.startsWith', {
                startsWith: issue.validation.startsWith
            });
        }
        if ('endsWith' in issue.validation) {
            return i18n.t('zod.errors.invalid_string.endsWith', {
                endsWith: issue.validation.endsWith
            });
        }
    }
    return i18n.t(`zod.errors.invalid_string.${issue.validation}`, {
        validation: i18n.t(`zod.validations.${issue.validation}`)
    });
}

function handleTooSmall(issue: ZodTooSmallIssue, _lang: SupportedLangs, i18n: i18n): string {
    const key = `zod.errors.too_small.${issue.type}.${
        issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'
    }`;
    return i18n.t(key, {
        minimum: typeof issue.minimum === 'bigint' ? Number(issue.minimum) : issue.minimum,
        type: issue.type,
        inclusive: issue.inclusive,
        count: typeof issue.minimum === 'bigint' ? Number(issue.minimum) : issue.minimum
    });
}

function handleTooBig(issue: ZodTooBigIssue, _lang: SupportedLangs, i18n: i18n): string {
    const key = `zod.errors.too_big.${issue.type}.${
        issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'
    }`;
    return i18n.t(key, {
        maximum: typeof issue.maximum === 'bigint' ? Number(issue.maximum) : issue.maximum,
        type: issue.type,
        inclusive: issue.inclusive,
        count: typeof issue.maximum === 'bigint' ? Number(issue.maximum) : issue.maximum
    });
}
