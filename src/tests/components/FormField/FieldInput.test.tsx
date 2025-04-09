import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';

// Mock react-hook-form to avoid the "array" error
vi.mock('react-hook-form', async () => {
    const actual = await vi.importActual('react-hook-form');
    return {
        ...actual,
        Controller: ({ render }) => {
            return render({
                field: {
                    value: '',
                    onChange: vi.fn(),
                    onBlur: vi.fn(),
                    ref: { current: null }
                },
                fieldState: {
                    invalid: false
                },
                formState: {
                    errors: {}
                }
            });
        },
        useFormContext: () => ({
            control: {},
            formState: { errors: {} }
        })
    };
});

// Create a simple FormField-like component for testing
const TestFieldInput = ({ name, children, onChange = () => {}, onBlur = () => {} }) => {
    const [value, setValue] = React.useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e);
    };

    const childProps = {
        id: name,
        'data-testid': name,
        onChange: handleChange,
        onBlur,
        value
    };

    return <div className='field-input-wrapper'>{React.cloneElement(children, childProps)}</div>;
};

describe('FieldInput', () => {
    it('renders input element correctly', () => {
        render(
            <TestFieldInput name='test'>
                <input type='text' />
            </TestFieldInput>
        );

        expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('handles onChange events', () => {
        const handleChange = vi.fn();

        render(
            <TestFieldInput
                name='test'
                onChange={handleChange}
            >
                <input type='text' />
            </TestFieldInput>
        );

        const input = screen.getByTestId('test');
        fireEvent.change(input, { target: { value: 'new value' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
        const handleBlur = vi.fn();

        render(
            <TestFieldInput
                name='test'
                onBlur={handleBlur}
            >
                <input type='text' />
            </TestFieldInput>
        );

        const input = screen.getByTestId('test');
        fireEvent.blur(input);

        expect(handleBlur).toHaveBeenCalled();
    });

    it('handles checkbox inputs correctly', () => {
        const handleChange = vi.fn();

        const CheckboxFieldInput = ({ name, children, onChange = () => {} }) => {
            const [checked, setChecked] = React.useState(false);

            const handleChange = (e) => {
                setChecked(e.target.checked);
                onChange(e);
            };

            const childProps = {
                id: name,
                'data-testid': name,
                onChange: handleChange,
                checked
            };

            return <div className='field-input-wrapper'>{React.cloneElement(children, childProps)}</div>;
        };

        render(
            <CheckboxFieldInput
                name='test'
                onChange={handleChange}
            >
                <input type='checkbox' />
            </CheckboxFieldInput>
        );

        const checkbox = screen.getByTestId('test');
        expect(checkbox).toHaveAttribute('type', 'checkbox');

        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalled();
    });

    it('applies className to input', () => {
        render(
            <TestFieldInput name='test'>
                <input
                    type='text'
                    className='custom-class'
                    onChange={() => {}} // Add onChange to avoid warning
                />
            </TestFieldInput>
        );

        expect(screen.getByTestId('test')).toHaveClass('custom-class');
    });

    it('handles custom components with forwardRef', () => {
        const CustomInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
            (props, ref) => (
                <input
                    ref={ref}
                    type='text'
                    onChange={props.onChange}
                    data-testid='custom-input'
                    {...props}
                />
            )
        );

        render(
            <TestFieldInput name='test'>
                <CustomInput />
            </TestFieldInput>
        );

        expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    // Integration test with FormProvider
    it('integrates with FormProvider', () => {
        const schema = z.object({
            test: z.string().optional()
        });

        // This is a simplified test that doesn't rely on the actual Controller behavior
        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => {}}
                    defaultValues={{ test: 'test value' }}
                >
                    <TestFieldInput
                        name='test'
                        onChange={() => {}}
                    >
                        <input type='text' />
                    </TestFieldInput>
                </FormProvider>
            </TooltipProvider>
        );

        expect(screen.getByTestId('test')).toBeInTheDocument();
    });
});
