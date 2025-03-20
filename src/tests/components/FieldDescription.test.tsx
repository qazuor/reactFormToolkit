import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { FieldDescription } from '../../components/FormField/FieldDescription';

describe('FieldDescription', () => {
    it('renders description text correctly', () => {
        render(<FieldDescription>Help text</FieldDescription>);
        expect(screen.getByText('Help text')).toBeInTheDocument();
    });

    it('applies correct position classes', () => {
        const { rerender } = render(<FieldDescription position='above'>Above text</FieldDescription>);
        expect(screen.getByText('Above text')).toHaveClass('mb-2');

        rerender(<FieldDescription position='below'>Below text</FieldDescription>);
        expect(screen.getByText('Below text')).toHaveClass('mt-1');
    });

    it('applies custom className', () => {
        render(<FieldDescription className='custom-class'>Description</FieldDescription>);
        expect(screen.getByText('Description')).toHaveClass('custom-class');
    });

    it('renders with custom attributes', () => {
        render(
            <FieldDescription
                id='custom-id'
                role='note'
                aria-label='Description'
            >
                Description
            </FieldDescription>
        );
        const description = screen.getByText('Description');
        expect(description).toHaveAttribute('id', 'custom-id');
        expect(description).toHaveAttribute('role', 'note');
        expect(description).toHaveAttribute('aria-label', 'Description');
    });
});
