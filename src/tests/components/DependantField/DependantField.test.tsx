import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { DependantField } from '../../../components/DependantField';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';
import type { DependentOption } from '../../../types';

const schema = z.object({
    country: z.string(),
    state: z.string().optional()
});

describe('DependantField', () => {
    const mockCountries = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' }
    ];

    const mockStates = {
        us: [
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' }
        ],
        ca: [
            { value: 'on', label: 'Ontario' },
            { value: 'bc', label: 'British Columbia' }
        ]
    };

    const getStatesByCountry = vi.fn().mockImplementation(async (country: string) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return mockStates[country as keyof typeof mockStates] || [];
    });

    const renderDependantField = (cacheResults = true, loadingDelay = 0) => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ country: '', state: '' }}
                >
                    <FormField
                        name='country'
                        label='Country'
                    >
                        <select>
                            <option value=''>Select a country</option>
                            {mockCountries.map((country) => (
                                <option
                                    key={country.value}
                                    value={country.value}
                                >
                                    {country.label}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <DependantField
                        dependsOnField='country'
                        dependentValuesCallback={getStatesByCountry}
                        cacheResults={cacheResults}
                        loadingDelay={loadingDelay}
                    >
                        <FormField
                            name='state'
                            label='State'
                        >
                            {({ field }, dependentValues: DependentOption[], isLoading: boolean) => (
                                <select
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    data-testid='state-select'
                                >
                                    {isLoading ? (
                                        <option>Loading...</option>
                                    ) : (
                                        <>
                                            <option value=''>Select a state</option>
                                            {dependentValues.map((state) => (
                                                <option
                                                    key={state.value}
                                                    value={state.value}
                                                >
                                                    {state.label}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            )}
                        </FormField>
                    </DependantField>
                </FormProvider>
            </TooltipProvider>
        );
    };

    it('loads dependent values when parent field changes', async () => {
        renderDependantField();
        const countrySelect = screen.getByTestId('country');
        const stateSelect = screen.getByTestId('state-select');

        // Initially no states should be loaded
        expect(stateSelect.children.length).toBe(1);
        expect(stateSelect.children[0].textContent).toBe('Select a state');

        // Select a country
        await userEvent.selectOptions(countrySelect, 'us');

        // Should show loading state
        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });

        // Should show states for US
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(3); // Select + 2 states
            expect(stateSelect.children[1].textContent).toBe('New York');
            expect(stateSelect.children[2].textContent).toBe('California');
        });

        // Change country
        await userEvent.selectOptions(countrySelect, 'ca');

        // Should show states for Canada
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(3); // Select + 2 states
            expect(stateSelect.children[1].textContent).toBe('Ontario');
            expect(stateSelect.children[2].textContent).toBe('British Columbia');
        });
    });

    it('caches results when cacheResults is true', async () => {
        renderDependantField(true);
        const countrySelect = screen.getByTestId('country');

        // Select US
        await userEvent.selectOptions(countrySelect, 'us');
        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });

        // Select Canada
        await userEvent.selectOptions(countrySelect, 'ca');
        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('ca');
        });

        // Select US again - should use cache
        getStatesByCountry.mockClear();
        await userEvent.selectOptions(countrySelect, 'us');

        // Wait a bit to ensure the callback isn't called
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(getStatesByCountry).not.toHaveBeenCalled();
    });

    it('does not cache results when cacheResults is false', async () => {
        renderDependantField(false);
        const countrySelect = screen.getByTestId('country');

        // Select US
        await userEvent.selectOptions(countrySelect, 'us');
        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });

        // Select Canada
        await userEvent.selectOptions(countrySelect, 'ca');
        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('ca');
        });

        // Select US again - should call the callback again
        getStatesByCountry.mockClear();
        await userEvent.selectOptions(countrySelect, 'us');

        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });
    });

    it('handles empty parent field value', async () => {
        renderDependantField();
        const countrySelect = screen.getByTestId('country');
        const stateSelect = screen.getByTestId('state-select');

        // Select US first
        await userEvent.selectOptions(countrySelect, 'us');

        // Wait for states to load
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(3);
        });

        // Clear selection
        await userEvent.selectOptions(countrySelect, '');

        // Should reset dependent values
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(1);
            expect(stateSelect.children[0].textContent).toBe('Select a state');
        });
    });

    it('respects loading delay', async () => {
        // Set a longer loading delay
        renderDependantField(true, 200);
        const countrySelect = screen.getByTestId('country');
        const stateSelect = screen.getByTestId('state-select');

        // Select a country
        await userEvent.selectOptions(countrySelect, 'us');

        // Initially should not show loading state due to delay
        expect(stateSelect.children[0].textContent).toBe('Select a state');

        // After delay, should show loading state
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(3);
        });
    });
});
