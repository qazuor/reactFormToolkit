import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormButtonsBar } from '../../../components/FormButtons/FormButtonsBar';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

// Mock the useQRFTTranslation hook
vi.mock('@/hooks', () => ({
    useQRFTTranslation: () => ({
        t: (key: string) => {
            if (key === 'form.submit') {
                return 'Submit';
            }
            if (key === 'form.reset') {
                return 'Reset Form';
            }
            if (key === 'form.cancel') {
                return 'Cancel';
            }
            return key;
        }
    })
}));

afterEach(() => {
    vi.clearAllMocks();
});

const schema = z.object({
    test: z.string()
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
    <TooltipProvider>
        <FormProvider
            schema={schema}
            onSubmit={() => Promise.resolve()}
        >
            {children}
        </FormProvider>
    </TooltipProvider>
);

describe('FormButtonsBar', () => {
    it('renders all buttons by default', () => {
        render(
            <TestWrapper>
                <FormButtonsBar />
            </TestWrapper>
        );

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        expect(screen.getByTestId('reset-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    it('applies horizontal layout by default', () => {
        render(
            <TestWrapper>
                <FormButtonsBar />
            </TestWrapper>
        );

        const container = screen.getByText('Submit').parentElement;
        expect(container).toHaveClass('flex-row');
    });

    it('applies vertical layout when specified', () => {
        render(
            <TestWrapper>
                <FormButtonsBar direction='vertical' />
            </TestWrapper>
        );

        const container = screen.getByTestId('submit-button').parentElement;
        expect(container).toHaveClass('flex-col');
    });

    it('applies full width to buttons when specified', () => {
        render(
            <TestWrapper>
                <FormButtonsBar fullWidth={true} />
            </TestWrapper>
        );

        const buttons = screen.getAllByRole('button');
        for (const button of buttons) {
            expect(button).toHaveClass('w-full');
        }
    });

    it('applies custom button styles', () => {
        render(
            <TestWrapper>
                <FormButtonsBar
                    buttonStyles={{
                        submit: 'custom-submit',
                        reset: 'custom-reset',
                        cancel: 'custom-cancel'
                    }}
                />
            </TestWrapper>
        );

        expect(screen.getByTestId('submit-button')).toHaveClass('custom-submit');
        expect(screen.getByTestId('reset-button')).toHaveClass('custom-reset');
        expect(screen.getByTestId('cancel-button')).toHaveClass('custom-cancel');
    });

    it('shows only specified buttons', () => {
        render(
            <TestWrapper>
                <FormButtonsBar
                    showSubmit={true}
                    showReset={false}
                    showCancel={false}
                />
            </TestWrapper>
        );

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        expect(screen.queryByText('Reset Form')).not.toBeInTheDocument();
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('uses custom button text', () => {
        render(
            <TestWrapper>
                <FormButtonsBar
                    submitText='Custom Submit'
                    resetText='Custom Reset'
                    cancelText='Custom Cancel'
                />
            </TestWrapper>
        );

        expect(screen.getByText('Custom Submit')).toBeInTheDocument();
        expect(screen.getByText('Custom Reset')).toBeInTheDocument();
        expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
    });

    it('calls onCancel when cancel button is clicked', async () => {
        const onCancel = vi.fn();
        render(
            <TestWrapper>
                <FormButtonsBar onCancel={onCancel} />
            </TestWrapper>
        );

        await userEvent.click(screen.getByTestId('cancel-button'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('renders additional children', () => {
        render(
            <TestWrapper>
                <FormButtonsBar>
                    <button type='button'>Custom Button</button>
                </FormButtonsBar>
            </TestWrapper>
        );

        expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });

    it('applies container className', () => {
        render(
            <TestWrapper>
                <FormButtonsBar className='custom-container' />
            </TestWrapper>
        );

        const container = screen.getByText('Submit').parentElement;
        expect(container).toHaveClass('custom-container');
    });
});
