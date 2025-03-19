import { z } from 'zod';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

type LoginForm = z.infer<typeof schema>;

export function BasicForm() {
    const { t } = useTranslation();

    const handleSubmit = async (data: LoginForm) => {
        console.log('Form submitted:', data);
    };

    return (
        <FormProvider<typeof schema>
            schema={schema}
            onSubmit={handleSubmit}
        >
            <div className="space-y-6">
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