import { FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z
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

type ValidationForm = z.infer<typeof schema>;

export function ValidationForm() {
    const { t } = useTranslation();

    const handleSubmit = async (data: ValidationForm) => {
        console.info('Form submitted:', data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
        >
            <div className='space-y-6'>
                <FormField
                    name='username'
                    label={t('form.username')}
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

                <FormField
                    name='confirmPassword'
                    label={t('form.confirmPassword')}
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.confirmPasswordPlaceholder')}
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
