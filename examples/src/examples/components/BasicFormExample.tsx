import { FormDescription, FormField, FormProvider, SubmitButton } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

type LoginForm = z.infer<typeof schema>;

export function BasicFormExample() {
    const { t } = useTranslation();

    const handleSubmit = async (data: LoginForm) => {
        console.info('Form submitted:', data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4'
            >
                {t('form.description')}
            </FormDescription>
            <div className='space-y-6'>
                <FormField
                    name='email'
                    label={t('form.email')}
                    description={t('form.emailDescription')}
                    descriptionOptions={{
                        position: 'below',
                        className: 'text-blue-600',
                        role: 'note'
                    }}
                    tooltip={t('form.emailTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start',
                        sideOffset: 8,
                        className: 'custom-tooltip'
                    }}
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
                    tooltip={t('form.passwordTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start',
                        sideOffset: 8
                    }}
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.passwordPlaceholder')}
                    />
                </FormField>

                <SubmitButton>{t('form.submit')}</SubmitButton>
            </div>
        </FormProvider>
    );
}
