import type { i18n } from 'i18next';
import { type ZodErrorMap, ZodIssueCode } from 'zod';
import { type SupportedLangs, zodTranslations } from './locales';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getTranslationByStringPath(obj: any, pathStr: string, params: any = null): string | undefined {
    const message = pathStr.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    if (message) {
        if (!params) {
            return message;
        }
        return fillTemplate(message, {
            ...params
        });
    }
}

function fillTemplate(template: string, variables: Record<string, string>) {
    return Object.entries(variables).reduce((acc, [key, value]) => {
        const pattern = new RegExp(`{{${key}}}`, 'g');
        return acc.replace(pattern, value);
    }, template);
}

export function getI18nextZodErrorMap(i18n: i18n): ZodErrorMap {
    return (issue, ctx) => {
        const { code } = issue;
        let message: string | undefined;
        const lang = (i18n.resolvedLanguage || 'en') as SupportedLangs;
        console.log(`issue for field ${issue.path[0]}:`, JSON.stringify(issue));
        switch (code) {
            case ZodIssueCode.invalid_type:
                message = getTranslationByStringPath(zodTranslations[lang], 'zodErrors.invalid_type', {
                    expected: issue.expected,
                    received: issue.received
                });
                break;
            case ZodIssueCode.invalid_string:
                if (issue.validation === 'email') {
                    message = getTranslationByStringPath(zodTranslations[lang], 'zodErrors.invalid_string.email');
                } else {
                    message = getTranslationByStringPath(zodTranslations[lang], 'zodErrors.invalid_type');
                }
                break;
            case ZodIssueCode.too_small:
                message = getTranslationByStringPath(zodTranslations[lang], 'zodErrors.tooSmall');
                break;
            // ... y así con otros casos
            default:
                message = getTranslationByStringPath(zodTranslations[lang], 'zodErrors.defaultError');
                break;
        }
        if (!message) {
            return { message: ctx.defaultError };
        }
        return { message };
    };
}
