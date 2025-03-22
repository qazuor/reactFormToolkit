import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it } from 'vitest';
import { FieldError } from '../../components/FormField/FieldError';
import i18nInstance from '../../tests/setupTest';

const TestWrapper = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
);

describe('FieldError', () => {
    beforeEach(() => {
        i18nInstance.changeLanguage('en');
    });

    it('renders error message when provided', () => {
        render(<FieldError message='Invalid input' />, { wrapper: TestWrapper });
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('renders error icon alongside message', () => {
        const { container } = render(<FieldError message='Invalid input' />, { wrapper: TestWrapper });
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.querySelector('title')?.textContent).toBe('Field Error');
    });

    it('returns null when no message is provided', () => {
        const { container } = render(<FieldError />, { wrapper: TestWrapper });
        expect(container.firstChild).toBeNull();
    });
});
