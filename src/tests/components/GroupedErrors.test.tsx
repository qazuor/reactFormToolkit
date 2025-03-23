import { render, screen } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { GroupedErrors } from '../../components/FormProvider/GroupedErrors';

describe('GroupedErrors', () => {
    const errors = {
        email: 'Invalid email',
        password: 'Password too short',
        username: 'Username required'
    };

    it('should not render when no errors are provided', () => {
        const { container } = render(<GroupedErrors errors={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render all errors by default', () => {
        render(<GroupedErrors errors={errors} />);
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByText('email:')).toBeInTheDocument();
        expect(screen.getByText('password:')).toBeInTheDocument();
        expect(screen.getByText('username:')).toBeInTheDocument();
    });

    it('should limit number of errors shown when maxErrors is set', () => {
        render(
            <GroupedErrors
                errors={errors}
                maxErrors={2}
            />
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(3); // 2 errors + 1 "and more" message
        expect(screen.getByText(/and 1 more error/i)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        render(
            <GroupedErrors
                errors={errors}
                className='custom-errors'
            />
        );
        expect(screen.getByRole('alert')).toHaveClass('custom-errors');
    });

    it('should not limit errors when maxErrors is 0 or negative', () => {
        render(
            <GroupedErrors
                errors={errors}
                maxErrors={0}
            />
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(3);

        render(
            <GroupedErrors
                errors={errors}
                maxErrors={-1}
            />
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should show error field names and messages', () => {
        render(<GroupedErrors errors={errors} />);
        for (const [field, message] of Object.entries(errors)) {
            expect(screen.getByText(`${field}:`)).toBeInTheDocument();
            expect(screen.getByText(message)).toBeInTheDocument();
        }
    });
});
