import { render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FieldError } from '../../components/FormField/FieldError';
import { TooltipProvider } from '../../components/ui/tooltip';

describe('FieldError', () => {
    const renderError = (props: any) => {
        return render(
            <TooltipProvider>
                <FieldError {...props} />
            </TooltipProvider>
        );
    };

    it('should not render when no message is provided', () => {
        const { container } = renderError({});
        expect(container.firstChild).toBeNull();
    });

    it('should render error message with default position and animation', () => {
        renderError({ message: 'Invalid input' });
        const error = screen.getByRole('alert');
        expect(error).toHaveTextContent('Invalid input');
        expect(error).toHaveClass('mt-1', 'animate-fadeIn');
    });

    it('should apply custom position classes', () => {
        renderError({
            message: 'Invalid input',
            options: { position: 'above' }
        });
        expect(screen.getByRole('alert')).toHaveClass('-mb-1');
    });

    it('should apply custom animation classes', () => {
        renderError({
            message: 'Invalid input',
            options: { animation: 'shake' }
        });
        expect(screen.getByRole('alert')).toHaveClass('animate-shake');
    });

    it('should show error icon by default', () => {
        renderError({ message: 'Invalid input' });
        expect(screen.getByTitle('Field Error')).toBeInTheDocument();
    });

    it('should hide error icon when showIcon is false', () => {
        renderError({
            message: 'Invalid input',
            options: { showIcon: false }
        });
        expect(screen.queryByTitle('Field Error')).not.toBeInTheDocument();
    });

    it('should apply custom classes', () => {
        renderError({
            message: 'Invalid input',
            options: { className: 'custom-error' }
        });
        expect(screen.getByRole('alert')).toHaveClass('custom-error');
    });

    it('should apply custom icon classes', () => {
        renderError({
            message: 'Invalid input',
            options: { iconClassName: 'custom-icon' }
        });
        expect(screen.getByTitle('Field Error')).toHaveClass('custom-icon');
    });

    it('should show error after delay', async () => {
        renderError({
            message: 'Invalid input',
            options: { delay: 100 }
        });
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });

    it('should auto-dismiss error', async () => {
        renderError({
            message: 'Invalid input',
            options: { autoDismiss: true, dismissAfter: 100 }
        });
        expect(screen.getByRole('alert')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    it('should render as tooltip when position is tooltip', () => {
        const TestComponent = () => {
            const ref = useRef<HTMLDivElement>(null);
            return (
                <div ref={ref}>
                    <FieldError
                        message='Invalid input'
                        options={{ position: 'tooltip' }}
                        inputRef={ref}
                    />
                </div>
            );
        };

        render(
            <TooltipProvider>
                <TestComponent />
            </TooltipProvider>
        );

        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
});
