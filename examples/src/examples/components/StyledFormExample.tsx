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
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10)
});

const customStyles = {
    field: {
        wrapper: 'mb-6 relative',
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

const emailFieldStyles = {
    wrapper: 'mb-6 relative bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100',
    label: 'block text-lg font-semibold mb-2 text-indigo-800',
    input: 'w-full p-3 border-2 border-indigo-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
    description: 'mt-2 text-sm text-indigo-600',
    error: 'mt-2 text-sm text-red-600 flex items-center gap-2',
    isValid: 'border-indigo-500 bg-indigo-50',
    isInvalid: 'border-red-400 bg-red-50'
};

export function StyledFormExample({ setResult }: StyledFormProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
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
                    styleOptions={emailFieldStyles}
                    required={true}
                    tooltip={t('form.emailTooltip')}
                    description={t('form.emailDescription')}
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

                <SubmitButton>{t('form.submit')}</SubmitButton>
                <ResetButton />
                <CancelButton onCancel={() => console.log('Cancelled')} />
            </div>
        </FormProvider>
    );
}
