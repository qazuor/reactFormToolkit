import { z } from 'zod';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';

const schema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username cannot exceed 20 characters'),
    email: z.string()
        .email('Please enter a valid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

type ValidationForm = z.infer<typeof schema>;

export function ValidationForm() {
    const { t } = useTranslation();

    const handleSubmit = async (data: ValidationForm) => {
        console.log('Form submitted:', data);
    };

    return (
        <FormProvider<typeof schema>
            schema={schema}
            onSubmit={handleSubmit}
        >
            <div className="space-y-6">
                <FormField
                    name="username"
                    label={t('form.username')}
                    required
                >
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t('form.usernamePlaceholder')}
                    />
                </FormField>

                <FormField
                    name="email"
                    label={t('form.email')}
                    required
                >
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t('form.emailPlaceholder')}
                    />
                </FormField>

                <FormField
                    name="password"
                    label={t('form.password')}
                    required
                >
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t('form.passwordPlaceholder')}
                    />
                </FormField>

                <FormField
                    name="confirmPassword"
                    label={t('form.confirmPassword')}
                    required
                >
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t('form.confirmPasswordPlaceholder')}
                    />
                </FormField>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    {t('form.submit')}
                </button>
            </div>
        </FormProvider>
    )
}