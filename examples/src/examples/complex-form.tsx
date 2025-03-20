import { FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    message: z.string().min(10).max(500)
});

type ContactForm = z.infer<typeof schema>;

export function ComplexForm() {
    const { t } = useTranslation();

    const handleSubmit = async (data: ContactForm) => {
        console.info('Form submitted:', data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
        >
            <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <FormField
                        name='firstName'
                        label={t('form.firstName')}
                        required={true}
                    >
                        <input
                            type='text'
                            className='w-full rounded-md border px-3 py-2'
                            placeholder={t('form.firstNamePlaceholder')}
                        />
                    </FormField>

                    <FormField
                        name='lastName'
                        label={t('form.lastName')}
                        required={true}
                    >
                        <input
                            type='text'
                            className='w-full rounded-md border px-3 py-2'
                            placeholder={t('form.lastNamePlaceholder')}
                        />
                    </FormField>
                </div>

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

                <FormField
                    name='phone'
                    label={t('form.phone')}
                    required={true}
                >
                    <input
                        type='tel'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.phonePlaceholder')}
                    />
                </FormField>

                <FormField
                    name='message'
                    label={t('form.message')}
                    required={true}
                >
                    <textarea
                        className='h-32 w-full rounded-md border px-3 py-2'
                        placeholder={t('form.messagePlaceholder')}
                    />
                </FormField>

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
