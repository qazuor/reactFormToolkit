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
        wrapper: 'mb-6 relative dark:text-gray-200',
        label: 'block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200',
        input: 'w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-700',
        textarea:
            'w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[120px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-700',
        description: 'mt-2 text-sm text-gray-600 dark:text-gray-400',
        error: 'mt-2 text-sm text-red-600 flex items-center gap-2 dark:text-red-400',
        isValid: 'border-green-500 focus:border-green-600 dark:border-green-600 dark:focus:border-green-500',
        isInvalid: 'border-red-400 focus:border-red-500 dark:border-red-500 dark:focus:border-red-400'
    },
    buttons: {
        submit: 'w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800'
    }
};

const emailFieldStyles = {
    wrapper:
        'mb-6 relative bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-800',
    label: 'block text-lg font-semibold mb-2 text-indigo-800 dark:text-indigo-300',
    input: 'w-full p-3 border-2 border-indigo-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-indigo-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-600',
    description: 'mt-2 text-sm text-indigo-600 dark:text-indigo-400',
    error: 'mt-2 text-sm text-red-600 flex items-center gap-2 dark:text-red-400',
    isValid: 'border-indigo-500 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/50',
    isInvalid: 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/30'
};

interface StyledFormProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

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
            <FormDescription position='above'>{t('form.contactDescription')}</FormDescription>

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
