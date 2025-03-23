import { render, screen } from '@testing-library/react';
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { GroupedErrors } from '../../components/FormProvider/GroupedErrors';
import i18n from '../setupTest';

describe('GroupedErrors', () => {
    const errors = {
        email: 'Invalid email',
        password: 'Password too short',
        username: 'Username required'
    };

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    );

    const renderWithI18n = (ui: React.ReactElement) => {
        return render(ui, { wrapper: TestWrapper });
    };

    it('should not render when no errors are provided', () => {
        const { container } = renderWithI18n(<GroupedErrors errors={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render all errors by default', () => {
        renderWithI18n(<GroupedErrors errors={errors} />);
        expect(screen.getAllByTestId('error-item')).toHaveLength(3);
        expect(screen.getByText('email:')).toBeInTheDocument();
        expect(screen.getByText('password:')).toBeInTheDocument();
        expect(screen.getByText('username:')).toBeInTheDocument();
    });

    it('should limit number of errors shown when maxErrors is set', () => {
        renderWithI18n(
            <GroupedErrors
                errors={errors}
                maxErrors={2}
            />
        );
        expect(screen.getAllByTestId('error-item')).toHaveLength(2);
        expect(screen.getByTestId('remaining-errors')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        renderWithI18n(
            <GroupedErrors
                errors={errors}
                className='custom-errors'
            />
        );
        expect(screen.getByTestId('grouped-errors')).toHaveClass('custom-errors');
    });

    it('should not limit errors when maxErrors is 0 or negative', () => {
        const { unmount } = renderWithI18n(
            <GroupedErrors
                errors={errors}
                maxErrors={0}
            />
        );
        expect(screen.getAllByTestId('error-item')).toHaveLength(3);
        unmount();

        renderWithI18n(
            <GroupedErrors
                errors={errors}
                maxErrors={-1}
            />
        );
        expect(screen.getAllByTestId('error-item')).toHaveLength(3);
    });

    it('should show error field names and messages', () => {
        renderWithI18n(<GroupedErrors errors={errors} />);
        for (const [field, message] of Object.entries(errors)) {
            expect(screen.getByText(`${field}:`)).toBeInTheDocument();
            expect(screen.getByText(message)).toBeInTheDocument();
        }
    });
});
