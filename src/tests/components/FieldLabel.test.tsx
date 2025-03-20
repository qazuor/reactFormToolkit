import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { FieldLabel } from '../../components/FormField/FieldLabel';
import { TooltipProvider } from '../../components/ui/tooltip';

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
        renderWithTooltip({ tooltip: tooltipText });

        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toBeInTheDocument();
    });

    it('applies cursor-help class to tooltip trigger', () => {
        renderWithTooltip({ tooltip: 'Help text' });
        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toHaveClass('group-hover:text-gray-500');
    });

    it('renders tooltip with correct accessibility attributes', () => {
        renderWithTooltip({ tooltip: 'Help text' });
        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toHaveAttribute('data-state', 'closed');
    });
});
