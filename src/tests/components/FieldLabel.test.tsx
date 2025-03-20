import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FieldLabel } from '../../components/FormField/FieldLabel';

describe('FieldLabel', () => {
    it('renders label text correctly', () => {
        render(<FieldLabel htmlFor='test'>Test Label</FieldLabel>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('shows required indicator when required prop is true', () => {
        render(
            <FieldLabel
                htmlFor='test'
                required={true}
            >
                Test Label
            </FieldLabel>
        );
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows tooltip icon when tooltip text is provided', () => {
        render(
            <FieldLabel
                htmlFor='test'
                tooltip='Help text'
            >
                Test Label
            </FieldLabel>
        );
        expect(screen.getByTitle('Help text')).toBeInTheDocument();
    });
});
