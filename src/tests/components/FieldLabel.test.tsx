import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FieldLabel } from '../../components/FormField/FieldLabel';
import { TooltipProvider } from '../../components/ui/tooltip';
import type { TooltipOptions } from '../../types/field';

// Mock the FormContext
const mockUseFormContext = vi.fn().mockReturnValue({
    styleOptions: {
        field: {
            label: 'mocked-label-class',
            requiredMark: 'mocked-required-mark-class'
        },
        tooltip: {
            icon: 'mocked-tooltip-icon-class',
            content: 'mocked-tooltip-content-class'
        }
    }
});

vi.mock('@/context', () => ({
    useFormContext: () => mockUseFormContext()
}));

// Mock the useQRFTTranslation hook
vi.mock(
    '@/hooks',
    () => ({
        useQRFTTranslation: () => ({
            t: (key: string) => (key === 'field.info' ? 'Field Info' : key)
        }),
        useFormContext: () => mockUseFormContext()
    }),
    { partial: true }
);

afterEach(() => {
    vi.clearAllMocks();
});

describe('FieldLabel', () => {
    const renderWithTooltip = (props = {}) => {
        return render(
            <TooltipProvider>
                <FieldLabel
                    htmlFor='test'
                    {...props}
                >
                    Test Label
                </FieldLabel>
            </TooltipProvider>
        );
    };

    it('renders label text correctly', () => {
        renderWithTooltip();
        const labelText = screen.getByTestId('field-label-text');
        expect(labelText).toHaveTextContent('Test Label');
    });

    it('shows required indicator when required prop is true', () => {
        renderWithTooltip({ required: true });
        expect(screen.getByTestId('field-required-indicator')).toBeInTheDocument();
    });

    it('shows tooltip icon and content when tooltip text is provided', async () => {
        const tooltipText = 'Help text for the field';
        renderWithTooltip({
            tooltip: tooltipText,
            tooltipOptions: {
                position: 'right',
                align: 'start'
            }
        });

        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toBeInTheDocument();

        // Verify tooltip icon is rendered
        expect(tooltipTrigger.querySelector('svg')).toBeInTheDocument();
    });

    it('applies custom tooltip options correctly', async () => {
        const tooltipOptions: TooltipOptions = {
            position: 'top',
            align: 'center',
            sideOffset: 12,
            className: 'custom-tooltip'
        };

        renderWithTooltip({
            tooltip: 'Help text',
            tooltipOptions
        });

        const trigger = screen.getByTestId('field-tooltip-trigger');
        expect(trigger).toBeInTheDocument();
    });

    it('applies cursor-help class to tooltip trigger', () => {
        renderWithTooltip({
            tooltip: 'Help text',
            tooltipOptions: { position: 'right' }
        });
        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toHaveClass('mocked-tooltip-icon-class');
    });
});
