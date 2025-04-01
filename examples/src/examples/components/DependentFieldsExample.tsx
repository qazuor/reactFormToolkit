import { FormButtonsBar, FormDescription, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    // Select-based fields
    country: z.string({
        required_error: 'Please select a country'
    }),
    state: z.string({
        required_error: 'Please select a state'
    }),
    // Radio/Checkbox-based fields
    topic: z.string({
        required_error: 'Please select a topic'
    }),
    subtopics: z.array(z.string()).min(1, 'Please select at least one subtopic')
});

interface DependentFieldsProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

const getStatesByCountry = async (country: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (country === 'us') {
        return [
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' },
            { value: 'tx', label: 'Texas' }
        ];
    } else if (country === 'ca') {
        return [
            { value: 'on', label: 'Ontario' },
            { value: 'bc', label: 'British Columbia' },
            { value: 'qc', label: 'Quebec' }
        ];
    }
    return [];
};

const getSubtopicsByTopic = async (topic: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (topic === 'frontend') {
        return [
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
            { value: 'svelte', label: 'Svelte' }
        ];
    } else if (topic === 'backend') {
        return [
            { value: 'node', label: 'Node.js' },
            { value: 'django', label: 'Django' },
            { value: 'laravel', label: 'Laravel' }
        ];
    }
    return [];
};

export function DependentFieldsExample({ setResult }: DependentFieldsProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            defaultValues={{
                country: '',
                state: '',
                topic: '',
                subtopics: []
            }}
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4'
            >
                {t('form.dependentFieldsDescription')}
            </FormDescription>

            <div className='space-y-8'>
                {/* Select-based dependent fields */}
                <div className='rounded-lg border bg-white p-6'>
                    <h3 className='mb-4 font-semibold'>Select-based Dependencies</h3>
                    <div className='space-y-4'>
                        <FormField
                            name='country'
                            label={t('form.country')}
                            tooltip={t('form.countryTooltip')}
                            required={true}
                        >
                            <select className='w-full rounded-md border px-3 py-2'>
                                <option value=''>{t('form.selectCountry')}</option>
                                <option value='us'>United States</option>
                                <option value='ca'>Canada</option>
                            </select>
                        </FormField>

                        <FormField
                            name='state'
                            label={t('form.state')}
                            tooltip={t('form.stateTooltip')}
                            required={true}
                            dependsOn='country'
                            dependencyUpdateCallback={getStatesByCountry}
                        >
                            <select className='w-full rounded-md border px-3 py-2' />
                        </FormField>
                    </div>
                </div>

                {/* Radio/Checkbox-based dependent fields */}
                <div className='rounded-lg border bg-white p-6'>
                    <h3 className='mb-4 font-semibold'>Radio/Checkbox Dependencies</h3>
                    <div className='space-y-4'>
                        <FormField
                            name='topic'
                            label={t('form.topic')}
                            required={true}
                        >
                            {({ field }) => (
                                <div className='space-y-2'>
                                    <label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            value='frontend'
                                            checked={field.value === 'frontend'}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            onBlur={field.onBlur}
                                            className='h-4 w-4 border-gray-300 text-blue-600'
                                        />
                                        <span>Frontend</span>
                                    </label>
                                    <label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            value='backend'
                                            checked={field.value === 'backend'}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            onBlur={field.onBlur}
                                            className='h-4 w-4 border-gray-300 text-blue-600'
                                        />
                                        <span>Backend</span>
                                    </label>
                                </div>
                            )}
                        </FormField>

                        <FormField
                            name='subtopics'
                            label={t('form.subtopics')}
                            required={true}
                            dependsOn='topic'
                            dependencyUpdateCallback={getSubtopicsByTopic}
                        >
                            {({ field, options = [], isLoading }) => (
                                <div className='space-y-2'>
                                    {isLoading ? (
                                        <div className='text-gray-500'>{t('form.loading')}</div>
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
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = opt.value;
                                                        const newValue = checked
                                                            ? [...(field.value || []), value]
                                                            : field.value.filter((v: string) => v !== value);
                                                        field.onChange(newValue);
                                                    }}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded border-gray-300 text-blue-600'
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            )}
                        </FormField>
                    </div>
                </div>

                <FormButtonsBar />
            </div>
        </FormProvider>
    );
}
