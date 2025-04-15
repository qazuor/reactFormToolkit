import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';

// Mock the FormContext
const mockUseFormContext = vi.fn().mockReturnValue({
    styleOptions: {
        tooltip: {
            content: 'mocked-tooltip-class'
        }
    }
});

vi.mock('@/context', () => ({
    useFormContext: () => mockUseFormContext()
}));

afterEach(() => {
    vi.clearAllMocks();
});

describe('Tooltip', () => {
    const renderTooltip = (content = 'Tooltip content') => {
        return render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>{content}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    it('renders tooltip trigger correctly', () => {
        renderTooltip();
        expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('applies correct styling classes to tooltip content', async () => {
        renderTooltip();
        const trigger = screen.getByText('Hover me');

        await userEvent.hover(trigger);
        const content = await screen.findByRole('tooltip');
        const contentWrapper = content.closest('[class*="rounded-md"]');

        expect(contentWrapper).toHaveClass(
            'z-50',
            'overflow-hidden',
            'rounded-md',
            'border',
            'border-gray-200',
            'bg-white',
            'px-3',
            'py-1.5',
            'text-sm',
            'text-gray-900',
            'shadow-md',
            'dark:border-gray-700',
            'dark:bg-gray-800',
            'dark:text-gray-100',
            'mocked-tooltip-class'
        );
    });

    it('supports custom className on tooltip content', async () => {
        render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent className='custom-class'>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        const trigger = screen.getByText('Hover me');
        await userEvent.hover(trigger);

        const content = await screen.findByRole('tooltip');
        expect(content.closest('[class*="custom-class"]')).toHaveClass('custom-class');
    });
});
