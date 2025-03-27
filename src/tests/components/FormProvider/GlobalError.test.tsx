import { render, screen, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { GlobalError } from '../../../components/FormProvider/GlobalError';

describe('GlobalError', () => {
    it('renders error message', () => {
        render(<GlobalError message='Test error message' />);
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('does not render when message is empty', () => {
        render(<GlobalError message='' />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('applies position classes correctly', () => {
        const { rerender } = render(
            <GlobalError
                message='Error'
                options={{ position: 'top' }}
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('mb-6');

        rerender(
            <GlobalError
                message='Error'
                options={{ position: 'bottom' }}
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('mt-6');
    });

    it('applies animation classes', () => {
        const { rerender } = render(
            <GlobalError
                message='Error'
                options={{ animation: 'fadeIn' }}
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('animate-fadeIn');

        rerender(
            <GlobalError
                message='Error'
                options={{ animation: 'slideIn' }}
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('animate-slideIn');

        rerender(
            <GlobalError
                message='Error'
                options={{ animation: 'shake' }}
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('animate-shake');
    });

    it('applies custom className', () => {
        render(
            <GlobalError
                message='Error'
                options={{ className: 'custom-class' }}
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });

    it('auto dismisses after specified time', async () => {
        render(
            <GlobalError
                message='Error'
                options={{
                    autoDismiss: true,
                    dismissAfter: 100
                }}
            />
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();

        await waitFor(
            () => {
                expect(screen.queryByRole('alert')).not.toBeInTheDocument();
            },
            { timeout: 200 }
        );
    });

    it('shows error icon', () => {
        render(<GlobalError message='Error' />);
        expect(screen.getByRole('alert').querySelector('svg')).toBeInTheDocument();
    });
});
