import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CancelButton } from '../../../components/FormButtons/CancelButton';

describe('CancelButton', () => {
    it('renders with default text', () => {
        render(<CancelButton />);
        expect(screen.getByRole('button')).toHaveTextContent('Cancel');
    });

    it('renders with custom text', () => {
        render(<CancelButton>Custom Cancel</CancelButton>);
        expect(screen.getByRole('button')).toHaveTextContent('Custom Cancel');
    });

    it('applies custom className', () => {
        render(<CancelButton className='custom-class' />);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('calls onCancel when clicked', async () => {
        const onCancel = vi.fn();
        render(<CancelButton onCancel={onCancel} />);

        await userEvent.click(screen.getByRole('button'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('prevents default form submission', async () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(
            <form onSubmit={onSubmit}>
                <CancelButton onCancel={onCancel} />
            </form>
        );

        await userEvent.click(screen.getByRole('button'));
        expect(onSubmit).not.toHaveBeenCalled();
        expect(onCancel).toHaveBeenCalled();
    });

    it('renders cancel icon', () => {
        render(<CancelButton />);
        expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });
});
