import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { FieldLabel } from '../../components/FormField/FieldLabel';
import { TooltipProvider } from '../../components/ui/tooltip';
import type { TooltipOptions } from '../../types/field';

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
            tooltip: tooltipText
        });

        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toBeInTheDocument();
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
        await userEvent.hover(trigger);

        const tooltipContent = screen.getByTestId('field-tooltip-content');
        expect(tooltipContent).toHaveClass('custom-tooltip');
    });

    it('applies cursor-help class to tooltip trigger', () => {
        renderWithTooltip({
            tooltip: 'Help text',
            tooltipOptions: { position: 'right' }
        });
        const tooltipTrigger = screen.getByTestId('field-tooltip-trigger');
        expect(tooltipTrigger).toHaveClass('group-hover:text-gray-500');
    });
});
