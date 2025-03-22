import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { useQRFTTranslation } from '../../hooks/useQRFTTranslation';
import i18nInstance from '../../tests/setupTest';

describe('useQRFTTranslation', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    );

    it('should return translation function and i18n instance', () => {
        const { result } = renderHook(() => useQRFTTranslation(), { wrapper });

        expect(result.current.t).toBeDefined();
        expect(result.current.i18n).toBeDefined();
    });

    it('should translate keys from QRFT namespace', () => {
        const { result } = renderHook(() => useQRFTTranslation(), { wrapper });

        const translated = result.current.t('field.error');
        expect(translated).toBe('Field Error');
    });

    it('should use provided i18n instance', () => {
        const { result } = renderHook(() => useQRFTTranslation(), { wrapper });
        expect(result.current.i18n.language.split('-')[0]).toBe('en');
    });
});
