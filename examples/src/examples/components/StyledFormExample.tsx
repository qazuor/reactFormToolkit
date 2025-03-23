import { FormDescription, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10)
});

const customStyles = {
    field: {
        wrapper: 'mb-6',
        label: 'block text-lg font-semibold mb-2 text-gray-800',
        input: 'w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        textarea:
            'w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[120px]',
        description: 'mt-2 text-sm text-gray-600',
        error: 'mt-2 text-sm text-red-600 flex items-center gap-2',
        isValid: 'border-green-500 focus:border-green-600',
        isInvalid: 'border-red-400 focus:border-red-500'
    },
    buttons: {
        submit: 'w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors'
    }
};

export function StyledFormExample() {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        console.info('Form submitted:', data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            styleOptions={customStyles}
        >
            <FormDescription
                position='above'
                className='mb-8 text-gray-700 text-lg'
            >
                {t('form.contactDescription')}
            </FormDescription>

            <div className='space-y-6'>
                <FormField
                    name='name'
                    label={t('form.firstName')}
                    required={true}
                    tooltip={t('form.firstNameTooltip')}
                >
                    <input type='text' />
                </FormField>

                <FormField
                    name='email'
                    label={t('form.email')}
                    required={true}
                    tooltip={t('form.emailTooltip')}
                >
                    <input type='email' />
                </FormField>

                <FormField
                    name='message'
                    label={t('form.message')}
                    required={true}
                    tooltip={t('form.messageTooltip')}
                >
                    <textarea />
                </FormField>

                <button type='submit'>{t('form.submit')}</button>
            </div>
        </FormProvider>
    );
}
