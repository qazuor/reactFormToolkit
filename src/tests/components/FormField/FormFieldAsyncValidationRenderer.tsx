import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FormFieldAsyncValidationRenderer } from '../../../components/FormField/FormFieldAsyncValidationRenderer';

// Mock ValidationStatusIcon component
vi.mock('../../../components/Icons', () => ({
    ValidationStatusIcon: ({ status }) => (
        <div
            data-testid={`validation-icon-${status}`}
            aria-label={`${status} icon`}
        >
            {status} icon
        </div>
    )
}));

describe('FormFieldAsyncValidationRenderer', () => {
    const defaultProps = {
        state: 'idle' as const,
        showValidationIcons: true,
        showLoadingSpinner: true,
        hasError: false,
        isValidating: false,
        textWhenValidating: 'Validating...',
        textWhenBeforeStartValidating: 'Will validate on input'
    };

    it('renders idle state correctly', () => {
        render(<FormFieldAsyncValidationRenderer {...defaultProps} />);

        expect(screen.getByTestId('invalid-indicator-idle')).toBeInTheDocument();
        expect(screen.getByText('Will validate on input')).toBeInTheDocument();
    });

    it('renders validating state correctly', () => {
        render(
            <FormFieldAsyncValidationRenderer
                {...defaultProps}
                state='validating'
                isValidating={true}
            />
        );

        expect(screen.getByTestId('invalid-indicator-validating')).toBeInTheDocument();
        expect(screen.getByText('Validating...')).toBeInTheDocument();
        expect(screen.getByTestId('validation-icon-loading')).toBeInTheDocument();
    });

    it('renders valid state correctly', () => {
        render(
            <FormFieldAsyncValidationRenderer
                {...defaultProps}
                state='valid'
            />
        );

        expect(screen.getByTestId('invalid-indicator-valid')).toBeInTheDocument();
        expect(screen.getByTestId('validation-icon-success')).toBeInTheDocument();
    });

    it('renders invalid state correctly', () => {
        render(
            <FormFieldAsyncValidationRenderer
                {...defaultProps}
                state='invalid'
                hasError={true}
                error='Invalid input'
            />
        );

        expect(screen.getByTestId('invalid-indicator-invalid')).toBeInTheDocument();
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
        expect(screen.getByTestId('validation-icon-error')).toBeInTheDocument();
    });

    it('hides validation icons when showValidationIcons is false', () => {
        render(
            <FormFieldAsyncValidationRenderer
                {...defaultProps}
                state='valid'
                showValidationIcons={false}
            />
        );

        expect(screen.getByTestId('invalid-indicator-valid')).toBeInTheDocument();
        expect(screen.queryByTestId('validation-icon-success')).not.toBeInTheDocument();
    });

    it('hides loading spinner when showLoadingSpinner is false', () => {
        render(
            <FormFieldAsyncValidationRenderer
                {...defaultProps}
                state='validating'
                isValidating={true}
                showLoadingSpinner={false}
            />
        );

        expect(screen.getByTestId('invalid-indicator-validating')).toBeInTheDocument();
        expect(screen.getByText('Validating...')).toBeInTheDocument();
        expect(screen.queryByTestId('validation-icon-loading')).not.toBeInTheDocument();
    });

    it('hides text when not provided', () => {
        render(
            <FormFieldAsyncValidationRenderer
                {...defaultProps}
                textWhenValidating={undefined}
                textWhenBeforeStartValidating={undefined}
            />
        );

        expect(screen.getByTestId('invalid-indicator-idle')).toBeInTheDocument();
        expect(screen.queryByText('Validating...')).not.toBeInTheDocument();
        expect(screen.queryByText('Will validate on input')).not.toBeInTheDocument();
    });
});
