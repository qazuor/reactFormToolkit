import { FieldArray, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    items: z
        .array(
            z.object({
                name: z.string().min(2, 'Name must be at least 2 characters'),
                email: z.string().email('Invalid email address')
            })
        )
        .min(1, 'At least one item is required')
});

type FormData = z.infer<typeof schema>;

export function FieldArrayExample() {
    const { t } = useTranslation();

    const handleSubmit = async (data: FormData) => {
        console.info('Form submitted:', data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            defaultValues={{
                items: [{ name: '', email: '' }]
            }}
        >
            <div className='space-y-6'>
                <FieldArray
                    name='items'
                    minItems={1}
                    maxItems={5}
                >
                    <div className='space-y-4 rounded-lg border bg-gray-50 p-4'>
                        <FormField
                            name='name'
                            label={t('form.name')}
                            required={true}
                        >
                            <input
                                type='text'
                                className='w-full rounded-md border px-3 py-2'
                                placeholder={t('form.namePlaceholder')}
                            />
                        </FormField>

                        <FormField
                            name='email'
                            label={t('form.email')}
                            required={true}
                        >
                            <input
                                type='email'
                                className='w-full rounded-md border px-3 py-2'
                                placeholder={t('form.emailPlaceholder')}
                            />
                        </FormField>
                    </div>
                </FieldArray>

                <button
                    type='submit'
                    className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                >
                    {t('form.submit')}
                </button>
            </div>
        </FormProvider>
    );
}
