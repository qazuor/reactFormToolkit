import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { SubmitButton } from '../../components/FormButtons/SubmitButton';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../components/ui/tooltip';

describe('FormField with Dependencies', () => {
    const schema = z.object({
        country: z.string().min(1, 'Country is required'),
        state: z.string().min(1, 'State is required')
    });

    const topicsSchema = z.object({
        topic: z.string().min(1, 'Topic is required'),
        subtopics: z.array(z.string()).min(1, 'At least one subtopic is required')
    });

    const mockGetStates = vi.fn().mockImplementation(async (country: string) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (country === 'us') {
            return [
                { value: 'ny', label: 'New York' },
                { value: 'ca', label: 'California' }
            ];
        }
        return [];
    });

    const mockGetSubtopics = vi.fn().mockImplementation(async (topic: string) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (topic === 'frontend') {
            return [
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' }
            ];
        }
        return [];
    });

    const renderDependentFields = () => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{
                        country: '',
                        state: '',
                        topic: '',
                        subtopics: []
                    }}
                >
                    {/* Country Select */}
                    <FormField
                        name='country'
                        label='Country'
                        required={true}
                    >
                        <select>
                            <option value=''>Select Country</option>
                            <option value='us'>United States</option>
                            <option value='ca'>Canada</option>
                        </select>
                    </FormField>

                    {/* Dependent State Select */}
                    <FormField
                        name='state'
                        label='State'
                        required={true}
                        dependsOn='country'
                        dependencyUpdateCallback={mockGetStates}
                    >
                        <select />
                    </FormField>
                    <SubmitButton>Submit</SubmitButton>
                </FormProvider>
            </TooltipProvider>
        );
    };

    const renderDependentCheckboxFields = () => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={topicsSchema}
                    onSubmit={() => Promise.resolve()}
                >
                    <FormField
                        name='topic'
                        label='Topic'
                        required={true}
                    >
                        {({ field }) => (
                            <div className='space-y-2'>
                                <label>
                                    <input
                                        type='radio'
                                        value='frontend'
                                        checked={field.value === 'frontend'}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-testid='frontend-radio'
                                    />
                                    Frontend
                                </label>
                                <label>
                                    <input
                                        type='radio'
                                        value='backend'
                                        checked={field.value === 'backend'}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-testid='backend-radio'
                                    />
                                    Backend
                                </label>
                            </div>
                        )}
                    </FormField>
                    {/* Dependent Subtopics Checkboxes */}
                    <FormField
                        name='subtopics'
                        label='Subtopics'
                        required={true}
                        dependsOn='topic'
                        dependencyUpdateCallback={mockGetSubtopics}
                    >
                        {({ field, options = [], isLoading }) => (
                            <div className='space-y-2'>
                                {isLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    options.map((opt) => (
                                        <label
                                            key={opt.value}
                                            className='flex items-center gap-2'
                                        >
                                            <input
                                                type='checkbox'
                                                value={opt.value}
                                                checked={field.value?.includes(opt.value)}
                                                data-testid={`${opt.value}-checkbox`}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const value = opt.value;
                                                    const newValue = checked
                                                        ? [...(field.value || []), value]
                                                        : field.value.filter((v: string) => v !== value);
                                                    field.onChange(newValue);
                                                    field.onBlur();
                                                }}
                                            />
                                            {opt.label}
                                        </label>
                                    ))
                                )}
                            </div>
                        )}
                    </FormField>
                    <SubmitButton>Submit</SubmitButton>s
                </FormProvider>
            </TooltipProvider>
        );
    };

    it('loads dependent options when parent field changes', async () => {
        renderDependentFields();

        // Change country and verify states are loaded
        const countrySelect = screen.getByTestId('country') as HTMLSelectElement;
        await userEvent.selectOptions(countrySelect, 'us');

        await waitFor(() => {
            expect(mockGetStates).toHaveBeenCalledWith('us');
        });

        await waitFor(() => {
            const stateSelect = screen.getByTestId('state') as HTMLSelectElement;
            const stateOptions = stateSelect.querySelectorAll('option');
            expect(stateOptions).toHaveLength(3); // Including placeholder
            expect(stateOptions[1].value).toBe('ny');
            expect(stateOptions[2].value).toBe('ca');
        });
    });

    it('shows loading state while fetching options', async () => {
        renderDependentCheckboxFields();

        // Select topic and check loading state
        const frontendRadio = screen.getByRole('radio', { name: 'Frontend' });
        await act(async () => {
            fireEvent.click(frontendRadio);
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });

    it('clears dependent field value when parent changes', async () => {
        renderDependentFields();

        // Set initial values
        const countrySelect = screen.getByTestId('country') as HTMLSelectElement;
        await userEvent.selectOptions(countrySelect, 'us');

        await waitFor(async () => {
            const stateSelect = screen.getByTestId('state') as HTMLSelectElement;
            await userEvent.selectOptions(stateSelect, 'ny');
            expect(stateSelect).toHaveValue('ny');
        });

        // Change country and verify state is cleared
        await act(async () => {
            fireEvent.change(countrySelect, { target: { value: 'ca' } });
        });

        await waitFor(() => {
            const stateSelect = screen.getByTestId('state') as HTMLSelectElement;
            expect(stateSelect).toHaveValue('');
        });
    });

    it('validates dependent fields correctly', async () => {
        renderDependentFields();

        // Get form elements
        const submitButton = screen.getByRole('button', { name: /submit/i });
        const countrySelect = screen.getByRole('combobox', { name: /country/i });

        // Initial form submission should show validation errors
        await act(async () => {
            await fireEvent.click(submitButton);
        });

        // Check for validation errors
        await waitFor(() => {
            expect(screen.getByText('Country is required')).toBeInTheDocument();
            expect(screen.getByText('State is required')).toBeInTheDocument();
        });

        // Select country
        await act(async () => {
            fireEvent.change(countrySelect, { target: { value: 'us' } });
        });

        // Wait for states to load and verify options
        await waitFor(async () => {
            expect(mockGetStates).toHaveBeenCalledWith('us');
            const stateOptions = await screen.findAllByRole('option');
            expect(stateOptions.length).toBeGreaterThan(1);
        });

        // Select state
        await waitFor(() => {
            const nyOption = screen.getByRole('option', { name: 'New York' });
            expect(nyOption).toBeInTheDocument();
        });

        await userEvent.selectOptions(screen.getByTestId('state'), 'ny');

        // Submit form
        await act(async () => {
            await fireEvent.click(submitButton);
        });

        // Verify validation errors are cleared
        await waitFor(() => {
            expect(screen.queryByText('Country is required')).not.toBeInTheDocument();
            expect(screen.queryByText('State is required')).not.toBeInTheDocument();
        });
    }, 10000);

    it('handles checkbox group dependencies correctly', async () => {
        renderDependentCheckboxFields();

        // Select frontend topic and wait for subtopics to load
        const frontendRadio = screen.getByRole('radio', { name: /frontend/i });
        await act(async () => {
            await fireEvent.click(frontendRadio);
        });

        await waitFor(() => {
            expect(mockGetSubtopics).toHaveBeenCalledWith('frontend');
        });

        // Wait for checkboxes to appear
        const reactCheckbox = await screen.findByRole('checkbox', { name: /react/i });
        const vueCheckbox = await screen.findByRole('checkbox', { name: /vue/i });

        // Select checkboxes one at a time
        await act(async () => {
            await fireEvent.click(reactCheckbox);
        });

        await act(async () => {
            await fireEvent.click(vueCheckbox);
        });

        // Verify checkbox states
        await waitFor(() => {
            expect(reactCheckbox).toBeChecked();
            expect(vueCheckbox).toBeChecked();
        });

        // Switch to backend topic and verify cleanup
        const backendRadio = screen.getByRole('radio', { name: /backend/i });
        await act(async () => {
            await fireEvent.click(backendRadio);
        });

        // Verify checkboxes are removed
        await waitFor(() => {
            expect(screen.queryByRole('checkbox', { name: /react/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('checkbox', { name: /vue/i })).not.toBeInTheDocument();
        });
    }, 10000);

    it('handles errors in dependency update callback', async () => {
        const mockErrorCallback = vi.fn().mockRejectedValue(new Error('Failed to load options'));

        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                >
                    <FormField
                        name='country'
                        label='Country'
                    >
                        <select>
                            <option value='us'>United States</option>
                        </select>
                    </FormField>

                    <FormField
                        name='state'
                        label='State'
                        dependsOn='country'
                        dependencyUpdateCallback={mockErrorCallback}
                    >
                        <select />
                    </FormField>
                </FormProvider>
            </TooltipProvider>
        );

        // Select country to trigger error
        const countrySelect = screen.getByRole('combobox', { name: /country/i });
        await act(async () => {
            fireEvent.change(countrySelect, { target: { value: 'us' } });
        });

        // Verify error callback and state reset
        await waitFor(() => {
            expect(mockErrorCallback).toHaveBeenCalled();
            const stateSelect = screen.getByRole('combobox', { name: /state/i });
            expect(stateSelect).toHaveValue('');
        });
    });
});
