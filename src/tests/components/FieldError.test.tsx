import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FieldError } from '../../components/FormField/FieldError';

describe('FieldError', () => {
    it('renders error message when provided', () => {
        render(<FieldError message='Invalid input' />);
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('renders error icon alongside message', () => {
        render(<FieldError message='Invalid input' />);
        expect(screen.getByTitle('Field Error')).toBeInTheDocument();
    });

    it('returns null when no message is provided', () => {
        const { container } = render(<FieldError />);
        expect(container.firstChild).toBeNull();
    });
});
