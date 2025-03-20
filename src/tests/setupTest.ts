// This file is used to set up the test environment
// It's imported by Vitest before running tests

import '@testing-library/jest-dom';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18next for tests
i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
        en: {
            translation: {
                field: {
                    error: 'Field Error',
                    info: 'Information'
                },
                form: {
                    error: 'Form Error',
                    loading: 'Loading',
                    success: 'Success'
                }
            }
        }
    },
    interpolation: {
        escapeValue: false
    }
});
