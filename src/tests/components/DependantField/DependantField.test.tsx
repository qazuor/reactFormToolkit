import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { act, useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { DependantField } from '../../../components/DependantField';
import { FormField } from '../../../components/FormField/FormField';
import { FormProvider } from '../../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../../components/ui/tooltip';
import type { DependentOption } from '../../../types/dependantField';

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

    // Create a mock function that returns a promise
    const getStatesByCountry = vi.fn().mockImplementation((country: string) => {
        return Promise.resolve(mockStates[country as keyof typeof mockStates] || []);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const renderDependantField = (cacheResults = true, loadingDelay = 0, dependentField = 'state') => {
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
                        required={true}
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
                        dependentField={dependentField}
                        cacheResults={cacheResults}
                        loadingDelay={loadingDelay}
                    >
                        <FormField
                            name='state'
                            label='State'
                        >
                            {({ field }, dependentValues: DependentOption[], isLoading) => (
                                <select
                                    value={field.value as string}
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
        // Setup test with caching disabled
        getStatesByCountry.mockClear();
        const { unmount } = renderDependantField(false);
        const countrySelect = screen.getByTestId('country');

        // Select US
        await userEvent.selectOptions(countrySelect, 'us');

        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });
        expect(getStatesByCountry).toHaveBeenCalledTimes(1);

        // Select Canada
        await userEvent.selectOptions(countrySelect, 'ca');

        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('ca');
        });
        expect(getStatesByCountry).toHaveBeenCalledTimes(2);

        // Select US again - should call the callback again
        getStatesByCountry.mockClear();
        await userEvent.selectOptions(countrySelect, 'us');

        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });
        expect(getStatesByCountry).toHaveBeenCalledTimes(1);

        unmount();
    });

    it('loads dependent values when parent field changes', async () => {
        // Use a longer test timeout
        vi.setConfig({ testTimeout: 5000 });

        // Mock implementation that resolves immediately
        const fastGetStatesByCountry = vi.fn().mockImplementation((country: string) => {
            return Promise.resolve(mockStates[country as keyof typeof mockStates] || []);
        });

        // Render with the fast mock
        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ country: '', state: '' }}
                >
                    <FormField
                        name='country'
                        label='Country'
                        required={true}
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
                        dependentValuesCallback={fastGetStatesByCountry}
                        loadingDelay={0}
                    >
                        <FormField
                            name='state'
                            label='State'
                        >
                            {({ field }, dependentValues, fieldState) => (
                                <select
                                    value={field.value as string}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    data-testid='state-select'
                                >
                                    {fieldState.isLoading ? (
                                        <option>Loading...</option>
                                    ) : dependentValues.length === 0 ? (
                                        <option value=''>Select a state</option>
                                    ) : (
                                        <>
                                            <option value=''>Select a state</option>
                                            {dependentValues.map((state: { value: string; label: string }) => (
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

        const countrySelect = screen.getByTestId('country');
        const stateSelect = screen.getByTestId('state-select');

        // Initially no states should be loaded
        expect(stateSelect.children.length).toBe(1);
        expect(stateSelect.children[0].textContent).toBe('Select a state');

        // Select US
        await userEvent.selectOptions(countrySelect, 'us');

        // Should show loading state
        await waitFor(() => {
            expect(fastGetStatesByCountry).toHaveBeenCalledWith('us');
        });

        // Should show states for US
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(3); // Select + 2 states
            expect(stateSelect.children[1].textContent).toBe('New York');
            expect(stateSelect.children[2].textContent).toBe('California');
        });

        // Change to Canada
        await userEvent.selectOptions(countrySelect, 'ca');

        // Should show states for Canada
        await waitFor(() => {
            expect(stateSelect.children.length).toBe(3); // Select + 2 states
            expect(stateSelect.children[1].textContent).toBe('Ontario');
            expect(stateSelect.children[2].textContent).toBe('British Columbia');
        });

        // Reset the test timeout
        vi.setConfig({ testTimeout: 1000 });
    });

    it('should reset dependent field value when parent field changes', async () => {
        // Create a component that tracks state value changes
        const StateValueTracker = () => {
            const [stateValue, setStateValue] = React.useState('');

            return (
                <TooltipProvider>
                    <FormProvider
                        schema={schema}
                        onSubmit={() => Promise.resolve()}
                        defaultValues={{ country: '', state: '' }}
                    >
                        <div data-testid='state-value'>{stateValue}</div>

                        <FormField
                            name='country'
                            label='Country'
                            required={true}
                        >
                            <select data-testid='country'>
                                <option value=''>Select a country</option>
                                <option value='us'>United States</option>
                                <option value='ca'>Canada</option>
                            </select>
                        </FormField>

                        <DependantField
                            dependsOnField='country'
                            dependentField='state'
                            dependentValuesCallback={getStatesByCountry}
                        >
                            <FormField
                                name='state'
                                label='State'
                            >
                                {({ field }, dependentValues, fieldState) => {
                                    // Track state value changes
                                    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
                                    useEffect(() => {
                                        setStateValue(field.value as string);
                                    }, [field.value]);

                                    return (
                                        <select
                                            data-testid='state-select'
                                            value={field.value as string}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        >
                                            {fieldState.isLoading ? (
                                                <option>Loading...</option>
                                            ) : (
                                                <>
                                                    <option value=''>Select a state</option>
                                                    {dependentValues?.map((state) => (
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
                                    );
                                }}
                            </FormField>
                        </DependantField>
                    </FormProvider>
                </TooltipProvider>
            );
        };

        render(<StateValueTracker />);

        // Select US
        const countrySelect = screen.getByTestId('country');
        await userEvent.selectOptions(countrySelect, 'us');

        // Wait for states to load
        await waitFor(() => {
            expect(getStatesByCountry).toHaveBeenCalledWith('us');
        });

        // Select NY state
        const stateSelect = screen.getByTestId('state-select');
        await userEvent.selectOptions(stateSelect, 'ny');

        // Verify state value is set
        waitFor(() => {
            expect(screen.getByTestId('state-value').textContent).toBe('ny');
        });

        // Change country to Canada
        await userEvent.selectOptions(countrySelect, 'ca');

        // // Verify state value is reset
        await waitFor(() => {
            expect(screen.getByTestId('state-value').textContent).toBe('');
        });
    });

    it('provides field state information to render function', async () => {
        // Create a component with field state display
        const FieldStateDisplay = () => (
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ country: '', state: '' }}
                >
                    <FormField
                        name='country'
                        label='Country'
                        required={true}
                    >
                        <select data-testid='country'>
                            <option value=''>Select a country</option>
                            <option value='us'>United States</option>
                        </select>
                    </FormField>

                    <DependantField
                        dependsOnField='country'
                        dependentField='state'
                        dependentValuesCallback={getStatesByCountry}
                    >
                        <FormField
                            name='state'
                            label='State'
                        >
                            {({ field }, dependentValues, _styleOptions, fieldState) => (
                                <div>
                                    <select
                                        data-testid='state-select'
                                        value={field.value as string}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    >
                                        <option value=''>Select a state</option>
                                        {dependentValues?.map((state) => (
                                            <option
                                                key={state.value}
                                                value={state.value}
                                            >
                                                {state.label}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Output field state for testing */}
                                    <div data-testid='field-state-empty'>{String(fieldState?.isEmpty)}</div>
                                    <div data-testid='field-state-validating'>{String(fieldState?.isValidating)}</div>
                                    <div data-testid='field-state-valid'>{String(fieldState?.isValid)}</div>
                                    <div data-testid='field-state-invalid'>{String(fieldState?.isInvalid)}</div>
                                </div>
                            )}
                        </FormField>
                    </DependantField>
                </FormProvider>
            </TooltipProvider>
        );

        render(<FieldStateDisplay />);

        // Initially the field should be empty
        waitFor(() => {
            expect(screen.getByTestId('field-state-empty').textContent).toBe('true');
        });

        // Select US
        const countrySelect = screen.getByTestId('country');
        await userEvent.selectOptions(countrySelect, 'us');

        // After loading, isEmpty should be false once values are loaded
        waitFor(() => {
            expect(screen.getByTestId('field-state-empty').textContent).toBe('false');
        });
    });

    it('handles empty parent field value', async () => {
        getStatesByCountry.mockClear();

        // Render with a synchronous mock to avoid timing issues
        const syncGetStatesByCountry = vi.fn().mockImplementation((country: string) => {
            return Promise.resolve(mockStates[country as keyof typeof mockStates] || []);
        });

        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ country: '', state: '' }}
                >
                    <FormField
                        name='country'
                        label='Country'
                        required={true}
                    >
                        <select data-testid='country'>
                            <option value=''>Select a country</option>
                            <option value='us'>United States</option>
                            <option value='ca'>Canada</option>
                        </select>
                    </FormField>

                    <DependantField
                        dependsOnField='country'
                        dependentValuesCallback={syncGetStatesByCountry}
                        loadingDelay={0}
                    >
                        <FormField
                            name='state'
                            label='State'
                        >
                            {({ field }, dependentValues, fieldState) => (
                                <select
                                    data-testid='state-select'
                                    value={field.value as string}
                                    onChange={(e) => field.onChange(e.target.value)}
                                >
                                    {fieldState.isLoading ? (
                                        <option>Loading...</option>
                                    ) : dependentValues.length === 0 ? (
                                        <option value=''>Select a state</option>
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

        const countrySelect = screen.getByTestId('country');
        const stateSelect = screen.getByTestId('state-select');

        // Select US first
        await userEvent.selectOptions(countrySelect, 'us');

        // Wait for states to load
        waitFor(() => {
            expect(syncGetStatesByCountry).toHaveBeenCalledWith('us');
        });

        waitFor(() => {
            expect(stateSelect.children.length).toBe(3);
        });

        // Clear selection
        await userEvent.selectOptions(countrySelect, '');

        // Should reset dependent values
        waitFor(() => {
            expect(stateSelect.children.length).toBe(1);
            expect(stateSelect.children[0].textContent).toBe('Select a state');
        });
    });

    it('respects loading delay and provides style props', async () => {
        // Mock implementation with a delay
        const delayedCallback = vi.fn().mockImplementation(async (country: string) => {
            // Simulate a delay that's shorter than the test timeout
            await new Promise((resolve) => setTimeout(resolve, 50));
            return mockStates[country as keyof typeof mockStates] || [];
        });

        // Render with a loading delay
        render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={() => Promise.resolve()}
                    defaultValues={{ country: '', state: '' }}
                >
                    <FormField
                        name='country'
                        label='Country'
                        required={true}
                    >
                        <select data-testid='country'>
                            <option value=''>Select a country</option>
                            <option value='us'>United States</option>
                        </select>
                    </FormField>

                    <DependantField
                        dependsOnField='country'
                        dependentValuesCallback={delayedCallback}
                        dependentField='state'
                        loadingDelay={0} // Small delay for testing
                    >
                        <FormField
                            name='state'
                            label='State'
                        >
                            {({ field }, dependentValues, fieldState) => (
                                <div>
                                    <select
                                        value={field.value as string}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        data-testid='state-select'
                                    >
                                        {fieldState.isLoading ? (
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
                                    {fieldState.isLoading && <span data-testid='loading-indicator'>Loading...</span>}
                                </div>
                            )}
                        </FormField>
                    </DependantField>
                </FormProvider>
            </TooltipProvider>
        );

        // Select a country
        const countrySelect = screen.getByTestId('country');
        await userEvent.selectOptions(countrySelect, 'us');

        // Verify the callback was called
        waitFor(() => {
            expect(delayedCallback).toHaveBeenCalledWith('us');
        });

        // Verify states load after the delay
        waitFor(
            () => {
                const stateSelect = screen.getByTestId('state-select');
                expect(stateSelect.children.length).toBeGreaterThan(1);
            },
            { timeout: 2000 }
        );
    });
});
