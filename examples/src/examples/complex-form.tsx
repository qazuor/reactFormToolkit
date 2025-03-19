import { z } from 'zod';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';

const schema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    message: z.string().min(10).max(500)
});

type ContactForm = z.infer<typeof schema>;

export function ComplexForm() {
    const { t } = useTranslation();

    const handleSubmit = async (data: ContactForm) => {
        console.log('Form submitted:', data);
    };

    return (
        <FormProvider<typeof schema>
            schema={schema}
            onSubmit={handleSubmit}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                        name="firstName"
                        label={t('form.firstName')}
                        required
                    >
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder={t('form.firstNamePlaceholder')}
                        />
                    </FormField>

                    <FormField
                        name="lastName"
                        label={t('form.lastName')}
                        required
                    >
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder={t('form.lastNamePlaceholder')}
                        />
                    </FormField>
                </div>

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
                    name="phone"
                    label={t('form.phone')}
                    required
                >
                    <input
                        type="tel"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t('form.phonePlaceholder')}
                    />
                </FormField>

                <FormField
                    name="message"
                    label={t('form.message')}
                    required
                >
                    <textarea
                        className="w-full px-3 py-2 border rounded-md h-32"
                        placeholder={t('form.messagePlaceholder')}
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