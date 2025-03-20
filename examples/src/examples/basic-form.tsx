import { FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

type LoginForm = z.infer<typeof schema>;

export function BasicForm() {
    const { t } = useTranslation();

    const handleSubmit = async (data: LoginForm) => {
        console.info('Form submitted:', data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
        >
            <div className='space-y-6'>
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
                    name='password'
                    label={t('form.password')}
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.passwordPlaceholder')}
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
