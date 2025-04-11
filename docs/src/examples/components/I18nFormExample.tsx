import {
    CancelButton,
    FormDescription,
    FormField,
    FormProvider,
    ResetButton,
    SubmitButton
} from '@qazuor/react-form-toolkit';
import i18n from 'i18next';
import { useCallback, useState } from 'react';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10)
});

interface I18nFormProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

const customTranslations = {
    en: {
        zod: {
            errors: {
                invalid_type_received_undefined: 'Required',
                invalid_type_received_null: 'Required',
                too_small: {
                    string: {
                        min: 'Must be at least {{min}} characters long'
                    }
                },
                invalid_string: {
                    email: 'Please enter a valid email address'
                }
            }
        },
        form: {
            title: 'Contact Form',
            name: 'Name',
            email: 'Email',
            message: 'Message',
            submit: 'Send Message',
            namePlaceholder: 'Enter your name',
            emailPlaceholder: 'Enter your email',
            messagePlaceholder: 'Your message here...',
            success: 'Message sent successfully!'
        }
    },
    es: {
        zod: {
            errors: {
                invalid_type_received_undefined: 'Requerido',
                invalid_type_received_null: 'Requerido',
                too_small: {
                    string: {
                        min: 'Debe tener al menos {{min}} caracteres'
                    }
                },
                invalid_string: {
                    email: 'Por favor ingrese un email válido'
                }
            }
        },
        form: {
            title: 'Formulario de Contacto',
            name: 'Nombre',
            email: 'Correo',
            message: 'Mensaje',
            submit: 'Enviar Mensaje',
            namePlaceholder: 'Ingrese su nombre',
            emailPlaceholder: 'Ingrese su correo',
            messagePlaceholder: 'Su mensaje aquí...',
            success: '¡Mensaje enviado exitosamente!'
        }
    }
};

export function I18nFormExample({ setResult }: I18nFormProps) {
    const [language, setLanguage] = useState<'en' | 'es'>('en');

    const toggleLanguage = useCallback(() => {
        setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
    }, []);

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    // const { i18n } = useTranslation();

    return (
        <div className='space-y-4'>
            <button
                type='button'
                onClick={toggleLanguage}
                className='mb-4 rounded-md bg-gray-100 px-3 py-1 text-sm'
            >
                {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            </button>

            <FormProvider
                schema={schema}
                onSubmit={handleSubmit}
                i18n={{
                    resources: customTranslations,
                    lng: language,
                    i18n
                }}
            >
                <FormDescription
                    position='above'
                    className='rounded-lg bg-blue-50 p-4'
                >
                    {customTranslations[language]?.form?.title || 'Contact Form'}
                </FormDescription>

                <div className='space-y-6'>
                    <FormField
                        name='name'
                        label={customTranslations[language]?.form?.name || 'Name'}
                        required={true}
                    >
                        <input
                            type='text'
                            className='w-full rounded-md border px-3 py-2'
                            placeholder={customTranslations[language]?.form?.namePlaceholder || 'Enter your name'}
                        />
                    </FormField>

                    <FormField
                        name='email'
                        label={customTranslations[language]?.form?.email || 'Email'}
                        required={true}
                    >
                        <input
                            type='email'
                            className='w-full rounded-md border px-3 py-2'
                            placeholder={customTranslations[language]?.form?.emailPlaceholder || 'Enter your email'}
                        />
                    </FormField>

                    <FormField
                        name='message'
                        label={customTranslations[language]?.form?.message || 'Message'}
                        required={true}
                    >
                        <textarea
                            className='h-32 w-full rounded-md border px-3 py-2'
                            placeholder={
                                customTranslations[language]?.form?.messagePlaceholder || 'Your message here...'
                            }
                        />
                    </FormField>

                    <SubmitButton>{customTranslations[language]?.form?.submit || 'Submit'}</SubmitButton>
                    <ResetButton />
                    <CancelButton onCancel={() => console.log('Cancelled')} />
                </div>
            </FormProvider>
        </div>
    );
}
