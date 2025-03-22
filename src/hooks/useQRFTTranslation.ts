import { i18nUtils } from '@/lib';
import type { UseTranslationOptions } from 'react-i18next';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for handling translations within the QRFT library
 * Uses the project's i18n instance if available, falls back to library's instance
 *
 * @param options - Optional configuration options for useTranslation
 * @returns Translation utilities with QRFT namespace
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t } = useQRFTTranslation();
 *   return <div>{t('field.error')}</div>;
 * }
 * ```
 */
export function useQRFTTranslation(options?: UseTranslationOptions<'QRFT'>) {
    const { t, i18n } = useTranslation('QRFT', {
        ...options,
        i18n: i18nUtils.getI18nInstance()
    });

    return { t, i18n };
}
