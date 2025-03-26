import {
    CancelButton,
    FormDescription,
    FormField,
    FormProvider,
    ResetButton,
    SubmitButton
} from '@qazuor/react-form-toolkit';
import { formUtils } from '@qazuor/react-form-toolkit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const validationSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username cannot exceed 20 characters'),
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

type ValidationForm = z.infer<typeof validationSchema>;

export function ValidationFormExample() {
    const { t } = useTranslation();
    const schema = useMemo(() => {
        return validationSchema;
    }, []);

    const handleSubmit = async (data: ValidationForm) => {
        console.info('Form submitted:', data);
    };

    // Example of using form utilities
    const isEmailRequired = formUtils.isFieldRequired('email', schema);
    // const emailValidation = formUtils.getFieldValidation('email', schema);

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            mode='onChange'
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4'
            >
                {t('form.validationDescription')}
            </FormDescription>

            <div className='space-y-6'>
                <FormField
                    name='username'
                    label={t('form.username')}
                    tooltip={t('form.usernameTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start'
                    }}
                    description={t('form.usernameDescription')}
                    descriptionOptions={{
                        position: 'below',
                        className: 'text-gray-500'
                    }}
                    required={true}
                >
                    <input
                        type='text'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.usernamePlaceholder')}
                    />
                </FormField>

                <FormField
                    name='email'
                    // The required prop is optional as it's inferred from schema
                    tooltip={t('form.emailTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start'
                    }}
                    required={isEmailRequired}
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
                        align: 'start'
                    }}
                    description={t('form.passwordDescription')}
                    descriptionOptions={{
                        position: 'below',
                        className: 'text-gray-500'
                    }}
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.passwordPlaceholder')}
                    />
                </FormField>

                <FormField
                    name='confirmPassword'
                    label={t('form.confirmPassword')}
                    tooltip={t('form.confirmPasswordTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start'
                    }}
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.confirmPasswordPlaceholder')}
                    />
                </FormField>

                <SubmitButton>{t('form.submit')}</SubmitButton>
                <ResetButton />
                <CancelButton onCancel={() => console.log('Cancelled')} />
            </div>
        </FormProvider>
    );
}
