import { vi } from 'vitest';
import { QRFTTranslations } from '../../i18n/locales';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const resources: Record<string, Record<string, any>> = {};

export const getMockI18n = () => {
    const mockI18n = {
        t: (key: string, params?: Record<string, string | number>) => {
            if (params) {
                return `${key} ${JSON.stringify(params)}`;
            }
            const parts = key.split('.');
            let value = QRFTTranslations.en;
            for (const part of parts) {
                value = value?.[part];
            }
            return value || key;
        },
        language: 'en',
        isInitialized: false,
        use: vi.fn().mockReturnThis(),
        init: vi.fn().mockImplementation((options: { resources?: Record<string, Record<string, string | number>> }) => {
            for (const [lang, namespaces] of Object.entries(options.resources || {})) {
                resources[lang] = namespaces;
            }
            mockI18n.isInitialized = true;
            return mockI18n;
        }),
        getResource: vi.fn().mockImplementation((lang, ns, key) => {
            return resources[lang]?.[ns]?.[key];
        }),
        addResource: vi.fn().mockImplementation((lang, ns, key, value) => {
            resources[lang] = resources[lang] || {};
            resources[lang][ns] = resources[lang][ns] || {};
            resources[lang][ns][key] = value;
        }),
        addResources: vi.fn().mockImplementation((lang, ns, bundle) => {
            resources[lang] = resources[lang] || {};
            resources[lang][ns] = { ...(resources[lang][ns] || {}), ...bundle };
        }),
        addResourceBundle: vi.fn().mockImplementation((lang, ns, bundle, deep = false, overwrite = false) => {
            if (!resources[lang]) {
                resources[lang] = {};
            }
            if (!resources[lang][ns] || overwrite) {
                resources[lang][ns] = bundle;
            } else if (deep) {
                resources[lang][ns] = { ...resources[lang][ns], ...bundle };
            }
        }),
        changeLanguage: vi.fn(),
        options: {
            defaultNS: 'translation',
            fallbackLng: 'en',
            supportedLngs: ['en', 'es'],
            interpolation: { escapeValue: false }
        }
    };
    return mockI18n;
};
