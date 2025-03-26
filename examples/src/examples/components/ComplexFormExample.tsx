import {
    CancelButton,
    FormDescription,
    FormField,
    FormProvider,
    ResetButton,
    SubmitButton
} from '@qazuor/react-form-toolkit';
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

export function ComplexFormExample() {
    const { t } = useTranslation();

    const handleSubmit = async (data: ContactForm) => {
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
                {t('form.contactDescription')}
            </FormDescription>

            <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <FormField
                        name='firstName'
                        label={t('form.firstName')}
                        tooltip={t('form.firstNameTooltip')}
                        tooltipOptions={{
                            position: 'top',
                            align: 'start'
                        }}
                        description={t('form.firstNameDescription')}
                        descriptionOptions={{
                            position: 'below',
                            className: 'text-blue-600'
                        }}
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
                        tooltip={t('form.lastNameTooltip')}
                        tooltipOptions={{
                            position: 'top',
                            align: 'end'
                        }}
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
                    tooltip={t('form.emailTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start'
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
                    name='phone'
                    label={t('form.phone')}
                    tooltip={t('form.phoneTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start'
                    }}
                    description={t('form.phoneDescription')}
                    descriptionOptions={{
                        position: 'below',
                        className: 'text-gray-500'
                    }}
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
                    tooltip={t('form.messageTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start'
                    }}
                    required={true}
                >
                    <textarea
                        className='h-32 w-full rounded-md border px-3 py-2'
                        placeholder={t('form.messagePlaceholder')}
                    />
                </FormField>

                <SubmitButton>{t('form.submit')}</SubmitButton>
                <ResetButton />
                <CancelButton onCancel={() => console.log('Cancelled')} />
            </div>
        </FormProvider>
    );
}
