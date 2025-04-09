import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FieldErrorRenderer } from '../../../components/FormField/FieldErrorRenderer';
import { TooltipProvider } from '../../../components/ui/tooltip';

// Mock the FieldErrorIcon to make testing easier
vi.mock('../../../components/Icons', () => ({
    FieldErrorIcon: ({ className, title }) => (
        <svg
            data-testid='field-error-icon'
            className={className}
            aria-label={title || 'Field Error'}
        >
            <title>{title || 'Field Error'}</title>
        </svg>
    )
}));

describe('FieldErrorRenderer', () => {
    const renderWithTooltip = (props) => {
        return render(
            <TooltipProvider>
                <FieldErrorRenderer {...props} />
            </TooltipProvider>
        );
    };

    it('renders standard error message correctly', () => {
        render(
            <FieldErrorRenderer
                message='Invalid input'
                position='below'
                animationClass=''
                showIcon={true}
                positionClass='mt-1'
            />
        );

        expect(screen.getByTestId('field-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('mt-1');
    });

    it('applies animation class correctly', () => {
        render(
            <FieldErrorRenderer
                message='Invalid input'
                position='below'
                animationClass='animate-fadeIn'
                showIcon={true}
                positionClass='mt-1'
            />
        );

        expect(screen.getByTestId('field-error')).toHaveClass('animate-fadeIn');
    });

    it('hides icon when showIcon is false', () => {
        render(
            <FieldErrorRenderer
                message='Invalid input'
                position='below'
                animationClass=''
                showIcon={false}
                positionClass='mt-1'
            />
        );

        expect(screen.queryByTitle('Field Error')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <FieldErrorRenderer
                message='Invalid input'
                position='below'
                animationClass=''
                showIcon={true}
                positionClass='mt-1'
                className='custom-error'
            />
        );

        expect(screen.getByTestId('field-error')).toHaveClass('custom-error');
    });

    it('applies custom iconClassName', () => {
        render(
            <FieldErrorRenderer
                message='Invalid input'
                position='below'
                animationClass=''
                showIcon={true}
                positionClass='mt-1'
                iconClassName='custom-icon'
            />
        );

        const icon = screen.getByTestId('field-error-icon');
        expect(icon).toHaveClass('custom-icon');
    });

    it('renders tooltip-style error correctly', () => {
        renderWithTooltip({
            message: 'Invalid input',
            position: 'tooltip',
            animationClass: '',
            showIcon: true,
            showTooltip: true
        });

        const tooltipContent = screen.getByTestId('error-tooltip');
        expect(tooltipContent).toBeInTheDocument();

        // Use getAllByText and check the first one since there might be multiple elements with the same text
        const errorTexts = screen.getAllByText('Invalid input');
        expect(errorTexts.length).toBeGreaterThan(0);
    });

    it('applies right position class correctly', () => {
        const { container } = render(
            <FieldErrorRenderer
                message='Invalid input'
                position='right'
                animationClass=''
                showIcon={true}
                positionClass='flex-shrink-0 whitespace-nowrap'
            />
        );

        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('w-0');
    });
});
