import {
    DependantField,
    FormButtonsBar,
    FormDescription,
    FormField,
    FormProvider,
    cn
} from '@qazuor/react-form-toolkit';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const dependentFieldSchema = z.object({
    country: z.string().min(1, 'Please select a country'),
    state: z.string().min(1, 'Please select a state'),
    category: z.string().min(1, 'Please select a category'),
    subcategory: z.string().min(1, 'Please select a subcategory')
});

// Infer the type from the schema
type DependentFieldValues = z.infer<typeof dependentFieldSchema>;

// Default values
const defaultValues: Partial<DependentFieldValues> = {
    country: '',
    state: '',
    category: '',
    subcategory: ''
};

interface DependentFieldsExampleProps {
    setResult: Dispatch<SetStateAction<Record<string, unknown> | null>>;
}

// Simulated API calls
const getStatesByCountry = async (country: unknown) => {
    const countryStr = country as string;
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const states = {
        us: [
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' },
            { value: 'tx', label: 'Texas' },
            { value: 'fl', label: 'Florida' }
        ],
        ca: [
            { value: 'on', label: 'Ontario' },
            { value: 'bc', label: 'British Columbia' },
            { value: 'qc', label: 'Quebec' }
        ],
        mx: [
            { value: 'df', label: 'Mexico City' },
            { value: 'jal', label: 'Jalisco' },
            { value: 'nl', label: 'Nuevo León' }
        ]
    };
    return states[countryStr as keyof typeof states] || [];
};

const getSubcategoriesByCategory = async (category: unknown) => {
    const categoryStr = category as string;
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const subcategories = {
        electronics: [
            { value: 'phones', label: 'Smartphones' },
            { value: 'laptops', label: 'Laptops' },
            { value: 'tablets', label: 'Tablets' },
            { value: 'wearables', label: 'Wearables' }
        ],
        clothing: [
            { value: 'mens', label: "Men's Clothing" },
            { value: 'womens', label: "Women's Clothing" },
            { value: 'kids', label: "Kids' Clothing" }
        ],
        home: [
            { value: 'furniture', label: 'Furniture' },
            { value: 'kitchen', label: 'Kitchen' },
            { value: 'decor', label: 'Home Decor' }
        ]
    };
    return subcategories[categoryStr as keyof typeof subcategories] || [];
};

export function DependentFieldsExample({ setResult }: DependentFieldsExampleProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: DependentFieldValues) => {
        console.info('Form submitted:', data);
        setResult(data);
    };

    return (
        <FormProvider<DependentFieldValues>
            onSubmit={handleSubmit}
            schema={dependentFieldSchema}
            defaultValues={defaultValues}
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30 dark:text-blue-100'
            >
                {t('form.dependentFieldDescription')}
            </FormDescription>

            <div className='space-y-8'>
                {/* Select-based Dependencies Section */}
                <div className='rounded-lg border bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800'>
                    <h3 className='mb-4 font-bold text-lg'>{t('form.selectBasedDependencies')}</h3>
                    <div className='space-y-6'>
                        <FormField
                            name='country'
                            label={t('form.country')}
                            tooltip={t('form.countryTooltip')}
                            required={true}
                        >
                            <select>
                                <option value=''>{t('form.selectCountry')}</option>
                                <option value='us'>United States</option>
                                <option value='ca'>Canada</option>
                                <option value='mx'>Mexico</option>
                            </select>
                        </FormField>

                        <DependantField
                            dependsOnField='country'
                            dependentField='state'
                            dependentValuesCallback={getStatesByCountry}
                            loadingDelay={300}
                        >
                            <FormField
                                name='state'
                                label={t('form.state')}
                                tooltip={t('form.stateTooltip')}
                                required={true}
                            >
                                {({ field }, dependentValues, styleOptions, fieldState) => (
                                    <select
                                        value={field.value as string}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                        className={cn(
                                            styleOptions?.field?.select,
                                            fieldState?.isValid && styleOptions?.field?.isValid,
                                            fieldState?.isInvalid && styleOptions?.field?.isInvalid,
                                            fieldState?.isLoading && styleOptions?.field?.isValidating,
                                            fieldState?.isValidating && styleOptions?.field?.isValidating,
                                            fieldState?.isEmpty && 'text-gray-400'
                                        )}
                                        disabled={fieldState?.isLoading}
                                    >
                                        {fieldState?.isLoading ? (
                                            <option>{t('form.loading')}</option>
                                        ) : (
                                            <>
                                                <option value=''>{t('form.selectState')}</option>
                                                {dependentValues?.map((state) => (
                                                    <option
                                                        key={`${state.value}-${field.value}`}
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
                    </div>
                </div>

                {/* Radio/Checkbox Dependencies Section */}
                <div className='rounded-lg border bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800'>
                    <h3 className='mb-4 font-bold text-lg'>{t('form.radioCheckboxDependencies')}</h3>
                    <div className='space-y-6'>
                        <FormField
                            name='category'
                            label={t('form.topic')}
                            required={true}
                        >
                            <div className='space-y-2'>
                                {['electronics', 'clothing', 'home'].map((category) => (
                                    <label
                                        key={category}
                                        className='flex items-center gap-2'
                                    >
                                        <input
                                            type='radio'
                                            name='category'
                                            value={category}
                                        />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </FormField>

                        <DependantField
                            dependsOnField='category'
                            dependentField='subcategory'
                            dependentValuesCallback={getSubcategoriesByCategory}
                        >
                            <FormField
                                name='subcategory'
                                label={t('form.subtopics')}
                                required={true}
                            >
                                {({ field }, dependentValues, styleOptions, fieldState) => (
                                    <div
                                        className={cn(
                                            'space-y-2 rounded-lg border px-3 py-2 text-gray-900 text-sm transition-colors',
                                            fieldState?.isValid && styleOptions?.field?.isValid,
                                            fieldState?.isInvalid && styleOptions?.field?.isInvalid,
                                            fieldState?.isLoading && styleOptions?.field?.isValidating,
                                            fieldState?.isValidating && styleOptions?.field?.isValidating,
                                            fieldState?.isEmpty && 'text-gray-400'
                                        )}
                                    >
                                        {fieldState?.isLoading ? (
                                            <div className='text-blue-500 dark:text-blue-400'>{t('form.loading')}</div>
                                        ) : fieldState?.isEmpty && !fieldState.isLoading ? (
                                            <div className='text-gray-500 dark:text-gray-400'>
                                                {t('form.selectOption')}
                                            </div>
                                        ) : (
                                            dependentValues?.map((subcategory) => (
                                                <label
                                                    key={subcategory.value}
                                                    className='flex items-center gap-2'
                                                >
                                                    <input
                                                        type='radio'
                                                        name={`subcategory-${field.value || 'empty'}`}
                                                        value={subcategory.value}
                                                        checked={field.value === subcategory.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        onBlur={field.onBlur}
                                                    />
                                                    <span className='text-gray-700 dark:text-gray-300'>
                                                        {subcategory.label}
                                                    </span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}
                            </FormField>
                        </DependantField>
                    </div>
                </div>

                <FormButtonsBar
                    direction='horizontal'
                    fullWidth={false}
                    onCancel={() => console.log('Cancelled')}
                />
            </div>
        </FormProvider>
    );
}
