import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { FormDescription } from '../../components/FormDescription';

describe('FormDescription', () => {
    it('renders description text correctly', () => {
        render(<FormDescription>Form help text</FormDescription>);
        expect(screen.getByText('Form help text')).toBeInTheDocument();
    });

    it('applies correct position classes', () => {
        const { rerender } = render(<FormDescription position='above'>Above text</FormDescription>);
        expect(screen.getByText('Above text')).toHaveClass('mb-6');

        rerender(<FormDescription position='below'>Below text</FormDescription>);
        expect(screen.getByText('Below text')).toHaveClass('mt-6');
    });

    it('applies custom className', () => {
        render(<FormDescription className='custom-class'>Description</FormDescription>);
        expect(screen.getByText('Description')).toHaveClass('custom-class');
    });

    it('renders with custom attributes', () => {
        render(
            <FormDescription
                id='custom-id'
                role='note'
                aria-label='Form Description'
            >
                Description
            </FormDescription>
        );
        const description = screen.getByText('Description');
        expect(description).toHaveAttribute('id', 'custom-id');
        expect(description).toHaveAttribute('role', 'note');
        expect(description).toHaveAttribute('aria-label', 'Form Description');
    });
});
