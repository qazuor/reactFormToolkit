// This file is used to set up the test environment
// It's imported by Vitest before running tests
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { vi } from 'vitest';
import { i18nUtils } from '../lib/i18n';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}));

// Configure testing library
configure({
    asyncUtilTimeout: 2000,
    computedStyleSupportsPseudoElements: false,
    defaultHidden: false,
    showOriginalStackTrace: true,
    testIdAttribute: 'data-testid'
});

// Create a new i18next instance for testing
const i18nInstance = i18nUtils.initializeI18n();
export default i18nInstance;
