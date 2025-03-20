import { render } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FieldInput } from '../../components/FormField/FieldInput';

describe('FieldInput', () => {
    it('applies error styles when hasError is true', () => {
        const { container } = render(
            <FieldInput
                id='test'
                hasError={true}
            >
                <input type='text' />
            </FieldInput>
        );

        const input = container.querySelector('input');
        expect(input?.className).toContain('border-red-300');
    });

    it('applies disabled styles when disabled is true', () => {
        const { container } = render(
            <FieldInput
                id='test'
                disabled={true}
            >
                <input type='text' />
            </FieldInput>
        );

        const input = container.querySelector('input');
        expect(input?.className).toContain('cursor-not-allowed');
        expect(input).toBeDisabled();
    });

    it('adds description id to aria-describedby when description is provided', () => {
        const { container } = render(
            <FieldInput
                id='test'
                description='Help text'
            >
                <input type='text' />
            </FieldInput>
        );

        const input = container.querySelector('input');
        expect(input?.getAttribute('aria-describedby')).toBe('test-description');
    });
});
