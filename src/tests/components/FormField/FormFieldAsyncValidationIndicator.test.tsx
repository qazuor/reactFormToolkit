import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FormFieldAsyncValidationIndicator } from '../../../components/FormField/FormFieldAsyncValidationIndicator';

describe('FormFieldAsyncValidationIndicator', () => {
    const defaultProps = {
        showValidationIcons: true,
        isValidating: false,
        showLoadingSpinner: true,
        asyncValidatingStarted: false,
        hasError: false,
        error: undefined,
        textWhenValidating: 'Validating...',
        textWhenBeforeStartValidating: 'Will validate on input'
    };

    it('renders idle state correctly', () => {
        render(<FormFieldAsyncValidationIndicator {...defaultProps} />);

        expect(screen.getByTestId('invalid-indicator-idle')).toBeInTheDocument();
        expect(screen.getByText('Will validate on input')).toBeInTheDocument();
    });

    it('renders validating state correctly', () => {
        render(
            <FormFieldAsyncValidationIndicator
                {...defaultProps}
                isValidating={true}
                asyncValidatingStarted={true}
            />
        );

        expect(screen.getByTestId('invalid-indicator-validating')).toBeInTheDocument();
        expect(screen.getByText('Validating...')).toBeInTheDocument();
    });

    it('renders valid state correctly', () => {
        render(
            <FormFieldAsyncValidationIndicator
                {...defaultProps}
                asyncValidatingStarted={true}
                isValidating={false}
                hasError={false}
            />
        );

        expect(screen.getByTestId('invalid-indicator-valid')).toBeInTheDocument();
    });

    it('renders invalid state correctly', () => {
        render(
            <FormFieldAsyncValidationIndicator
                {...defaultProps}
                asyncValidatingStarted={true}
                isValidating={false}
                hasError={true}
                error='Invalid input'
            />
        );

        expect(screen.getByTestId('invalid-indicator-invalid')).toBeInTheDocument();
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('hides validation icons when showValidationIcons is false', () => {
        render(
            <FormFieldAsyncValidationIndicator
                {...defaultProps}
                showValidationIcons={false}
                asyncValidatingStarted={true}
                isValidating={false}
                hasError={false}
            />
        );

        expect(screen.getByTestId('invalid-indicator-valid')).toBeInTheDocument();
        expect(screen.queryByTitle('Success')).not.toBeInTheDocument();
    });

    it('hides loading spinner when showLoadingSpinner is false', () => {
        render(
            <FormFieldAsyncValidationIndicator
                {...defaultProps}
                showLoadingSpinner={false}
                isValidating={true}
                asyncValidatingStarted={true}
            />
        );

        expect(screen.getByTestId('invalid-indicator-validating')).toBeInTheDocument();
        expect(screen.getByText('Validating...')).toBeInTheDocument();
        expect(screen.queryByTitle('Loading')).not.toBeInTheDocument();
    });

    it('hides text when not provided', () => {
        render(
            <FormFieldAsyncValidationIndicator
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
