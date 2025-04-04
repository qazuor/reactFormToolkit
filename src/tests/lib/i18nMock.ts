import { vi } from 'vitest';
import { QRFTTranslations } from '../../i18n/locales';

const DEFAULT_LANGUAGE = 'en';
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let resources: Record<string, Record<string, any>> = {};
let currentLanguage = DEFAULT_LANGUAGE;

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
        get language() {
            return currentLanguage;
        },
        set language(value: string) {
            currentLanguage = value;
        },
        isInitialized: false,
        use: vi.fn().mockReturnThis(),
        init: vi.fn().mockImplementation((options: { resources?: Record<string, Record<string, string | number>> }) => {
            for (const [lang, namespaces] of Object.entries(options.resources || {})) {
                resources[lang] = namespaces;
            }
            currentLanguage = options.lng || DEFAULT_LANGUAGE;
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
        changeLanguage: vi.fn().mockImplementation((lng: string) => {
            currentLanguage = lng;
            return Promise.resolve(currentLanguage);
        }),
        options: {
            defaultNS: 'translation',
            fallbackLng: DEFAULT_LANGUAGE,
            supportedLngs: ['en', 'es'],
            interpolation: { escapeValue: false }
        }
    };

    // Reset resources for clean state
    resources = {};
    currentLanguage = DEFAULT_LANGUAGE;

    return mockI18n;
};
