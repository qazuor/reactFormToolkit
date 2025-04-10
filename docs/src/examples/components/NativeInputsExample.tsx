import { FormButtonsBar, FormDescription, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    // Text inputs
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),

    // Date input
    birthDate: z.string(),

    // Select
    country: z.string().min(1, 'Please select a country'),

    // Multiple select
    languages: z.array(z.string()).min(1, 'Please select at least one language'),

    // Checkbox
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms'
    }),

    // Checkbox group
    interests: z.array(z.string()).min(1, 'Please select at least one interest'),

    // Radio buttons
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),

    // File input
    avatar: z.instanceof(File).optional()
});

interface NativeInputsExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function NativeInputsExample({ setResult }: NativeInputsExampleProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            defaultValues={{
                name: '',
                email: '',
                bio: '',
                birthDate: '',
                country: '',
                languages: [],
                acceptTerms: false,
                interests: [],
                gender: 'prefer_not_to_say',
                avatar: undefined
            }}
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4'
            >
                {t('form.nativeInputs.description')}
            </FormDescription>

            <div className='space-y-6'>
                {/* Text input */}
                <FormField
                    name='name'
                    label={t('form.nativeInputs.name')}
                    required={true}
                >
                    <input
                        type='text'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.nativeInputs.namePlaceholder')}
                    />
                </FormField>

                {/* Email input */}
                <FormField
                    name='email'
                    label={t('form.nativeInputs.email')}
                    required={true}
                >
                    <input
                        type='email'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.nativeInputs.emailPlaceholder')}
                    />
                </FormField>

                {/* Textarea */}
                <FormField
                    name='bio'
                    label={t('form.nativeInputs.bio')}
                    required={true}
                >
                    <textarea
                        className='h-32 w-full rounded-md border px-3 py-2'
                        placeholder={t('form.nativeInputs.bioPlaceholder')}
                    />
                </FormField>

                {/* Date input */}
                <FormField
                    name='birthDate'
                    label={t('form.nativeInputs.birthDate')}
                    required={true}
                >
                    <input
                        type='date'
                        className='w-full rounded-md border px-3 py-2'
                    />
                </FormField>

                {/* Select */}
                <FormField
                    name='country'
                    label={t('form.nativeInputs.country')}
                    required={true}
                >
                    <select className='w-full rounded-md border px-3 py-2'>
                        <option value=''>{t('form.nativeInputs.selectCountry')}</option>
                        <option value='us'>United States</option>
                        <option value='uk'>United Kingdom</option>
                        <option value='ca'>Canada</option>
                    </select>
                </FormField>

                {/* Multiple select */}
                <FormField
                    name='languages'
                    label={t('form.nativeInputs.languages')}
                    required={true}
                >
                    <select
                        multiple={true}
                        className='h-32 w-full rounded-md border px-3 py-2'
                    >
                        <option value='en'>English</option>
                        <option value='es'>Spanish</option>
                        <option value='fr'>French</option>
                        <option value='de'>German</option>
                    </select>
                </FormField>

                {/* Checkbox */}
                <FormField
                    name='acceptTerms'
                    label={t('form.nativeInputs.acceptTerms')}
                    required={true}
                >
                    <input
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300'
                    />
                </FormField>

                {/* Checkbox group */}
                <FormField
                    name='interests'
                    label={t('form.nativeInputs.interests')}
                    required={true}
                >
                    {({ field }: { field: { value: string[]; onChange: (value: string[]) => void } }) => (
                        <div className='space-y-2'>
                            {['sports', 'music', 'movies', 'books'].map((interest) => {
                                const checked = field.value?.includes(interest);
                                return (
                                    <label
                                        key={interest}
                                        className='flex items-center gap-2'
                                    >
                                        <input
                                            type='checkbox'
                                            value={interest}
                                            checked={checked}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                const newValue = isChecked
                                                    ? [...(field.value || []), interest]
                                                    : field.value.filter((v: string) => v !== interest);
                                                field.onChange(newValue);
                                            }}
                                            className='h-4 w-4 rounded border-gray-300'
                                        />
                                        {t(`form.nativeInputs.interests_${interest}`)}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </FormField>

                {/* Radio buttons */}
                <FormField
                    name='gender'
                    label={t('form.nativeInputs.gender')}
                    required={true}
                >
                    {({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                        <div className='space-y-2'>
                            {['male', 'female', 'other', 'prefer_not_to_say'].map((gender) => (
                                <label
                                    key={gender}
                                    className='flex items-center gap-2'
                                >
                                    <input
                                        type='radio'
                                        value={gender}
                                        checked={field.value === gender}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className='h-4 w-4 border-gray-300'
                                    />
                                    {t(`form.nativeInputs.gender_${gender}`)}
                                </label>
                            ))}
                        </div>
                    )}
                </FormField>

                {/* File input */}
                <FormField
                    name='avatar'
                    label={t('form.nativeInputs.avatar')}
                >
                    <input
                        type='file'
                        accept='image/*'
                        className='w-full rounded-md border px-3 py-2'
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                // Handle file upload
                                console.log('File selected:', file);
                            }
                        }}
                    />
                </FormField>

                <FormButtonsBar />
            </div>
        </FormProvider>
    );
}
