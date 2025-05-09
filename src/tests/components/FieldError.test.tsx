import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type ReactNode, useRef } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FieldError } from '../../components/FormField/FieldError';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../components/ui/tooltip';
import type { ErrorAnimation } from '../../types/form';

const testSchema = z.object({
    test: z.string().min(3, 'Invalid input')
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
    <FormProvider
        schema={testSchema}
        onSubmit={(data) => console.log(data)}
    >
        <TooltipProvider>{children}</TooltipProvider>
    </FormProvider>
);

describe('FieldError', () => {
    const renderError = (props: {
        message?: string;
        options?: {
            position?: string;
            animation?: string;
            showIcon?: boolean;
            className?: string;
            iconClassName?: string;
            delay?: number;
            autoDismiss?: boolean;
            dismissAfter?: number;
        };
    }) => {
        return render(
            <TestWrapper>
                <FieldError
                    name='test'
                    {...props}
                />
            </TestWrapper>
        );
    };

    it('should not render when no message is provided', () => {
        renderError({});
        expect(screen.queryByTestId('field-error')).not.toBeInTheDocument();
    });

    it('should render error message with default position and animation', () => {
        renderError({ message: 'Invalid input' });
        const error = screen.getByTestId('field-error');
        expect(error).toHaveTextContent('Invalid input');
        expect(error).toHaveClass('mt-1');
    });

    it('should not apply animation class when animation is none', () => {
        renderError({
            message: 'Invalid input',
            options: { animation: 'none' }
        });
        const error = screen.getByTestId('field-error');
        expect(error).not.toHaveClass('animate-fadeIn');
        expect(error).not.toHaveClass('animate-shake');
        expect(error).not.toHaveClass('animate-pulse');
        expect(error).not.toHaveClass('animate-slideIn');
    });

    it('should not apply animation when position is tooltip', () => {
        const TestComponent = () => {
            const ref = useRef<HTMLDivElement>(null);
            return (
                <div
                    ref={ref}
                    data-testid='tooltip-trigger'
                >
                    <FieldError
                        name='test'
                        message='Invalid input'
                        options={{ position: 'tooltip', animation: 'fadeIn' }}
                        inputRef={ref}
                    />
                </div>
            );
        };

        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        const trigger = screen.getByTestId('tooltip-trigger');

        act(() => {
            fireEvent.mouseEnter(trigger);
        });

        const portal = document.querySelector('[data-testid="error-tooltip"]');
        expect(portal).toBeInTheDocument();
        expect(portal).not.toHaveClass('animate-fadeIn');
    });

    it('should apply custom position classes', () => {
        renderError({
            message: 'Invalid input',
            options: { position: 'right' }
        });
        expect(screen.getByTestId('field-error')).toHaveClass('flex-shrink-0', 'whitespace-nowrap');
    });

    it('should apply custom animation classes', () => {
        renderError({
            message: 'Invalid input',
            options: { animation: 'shake' }
        });
        expect(screen.getByTestId('field-error')).toHaveClass('animate-shake');
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
        expect(screen.getByTestId('field-error')).toHaveClass('custom-error');
    });

    it('should apply custom icon classes', () => {
        renderError({
            message: 'Invalid input',
            options: { iconClassName: 'custom-icon' }
        });
        const svg = screen.getByTitle('Field Error').parentNode;
        expect(svg).toHaveClass('custom-icon');
    });

    it('should show error after delay', async () => {
        renderError({
            message: 'Invalid input',
            options: { delay: 100 }
        });
        expect(screen.queryByTestId('field-error')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId('field-error')).toBeInTheDocument();
        });
    });

    it('should auto-dismiss error', async () => {
        renderError({
            message: 'Invalid input',
            options: { autoDismiss: true, dismissAfter: 100 }
        });
        expect(screen.getByTestId('field-error')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('field-error')).not.toBeInTheDocument();
        });
    });

    it('should render as tooltip when position is tooltip', async () => {
        const TestComponent = () => {
            const ref = useRef<HTMLDivElement>(null);
            return (
                <div
                    ref={ref}
                    data-testid='tooltip-container'
                >
                    <FieldError
                        name='test'
                        message='Invalid input'
                        options={{ position: 'tooltip' }}
                        inputRef={ref}
                    />
                </div>
            );
        };

        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        const tooltipContainer = screen.getByTestId('tooltip-container');

        await act(async () => {
            fireEvent.mouseEnter(tooltipContainer);
        });

        await waitFor(() => {
            expect(screen.getByTestId('error-tooltip')).toBeInTheDocument();
        });
    });

    it('should handle position above correctly', () => {
        renderError({
            message: 'Invalid input',
            options: { position: 'above' }
        });
        expect(screen.getByTestId('field-error')).toHaveClass('mb-1');
    });

    it('should handle position below correctly', () => {
        renderError({
            message: 'Invalid input',
            options: { position: 'below' }
        });
        expect(screen.getByTestId('field-error')).toHaveClass('mt-1');
    });

    it('should handle tooltip position with custom styles', async () => {
        const TestComponent = () => {
            const ref = useRef<HTMLDivElement>(null);
            return (
                <div ref={ref}>
                    <FieldError
                        name='test'
                        message='Invalid input'
                        options={{
                            position: 'tooltip',
                            className: 'custom-tooltip-class'
                        }}
                        inputRef={ref}
                    />
                </div>
            );
        };

        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        const tooltipContent = await screen.findByTestId('error-tooltip');
        expect(tooltipContent).toHaveClass('custom-tooltip-class');
    });

    it('should handle multiple animations correctly', () => {
        const animations: ErrorAnimation[] = ['fadeIn', 'slideIn', 'pulse', 'shake'];

        for (const animation of animations) {
            const { unmount } = renderError({
                message: 'Invalid input',
                options: { animation }
            });

            expect(screen.getByTestId('field-error')).toHaveClass(`animate-${animation}`);
            unmount();
        }
    });

    it('should respect delay option', async () => {
        const delay = 100;
        renderError({
            message: 'Invalid input',
            options: { delay }
        });

        expect(screen.queryByTestId('field-error')).not.toBeInTheDocument();

        await waitFor(
            () => {
                expect(screen.getByTestId('field-error')).toBeInTheDocument();
            },
            { timeout: delay + 50 }
        );
    });

    it('should handle error message updates', () => {
        const { rerender } = renderError({
            message: 'First error'
        });

        expect(screen.getByText('First error')).toBeInTheDocument();

        rerender(
            <TestWrapper>
                <FieldError
                    name='test'
                    message='Updated error'
                />
            </TestWrapper>
        );

        expect(screen.getByText('Updated error')).toBeInTheDocument();
    });

    it('should cleanup timeouts on unmount', () => {
        vi.useFakeTimers();

        const { unmount } = renderError({
            message: 'Error message',
            options: {
                delay: 1000,
                autoDismiss: true,
                dismissAfter: 2000
            }
        });

        unmount();
        vi.runAllTimers();

        expect(screen.queryByTestId('field-error')).not.toBeInTheDocument();

        vi.useRealTimers();
    });
});
