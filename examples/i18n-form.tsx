// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { FormField, FormProvider } from '../src';

// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters')
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Default values
const defaultValues: Partial<FormValues> = {
    name: '',
    email: '',
    message: ''
};

// Custom translations
const customResources = {
    en: {
        translation: {
            validation: {
                min: 'Must have at least {{min}} characters (custom)'
            }
        }
    },
    es: {
        translation: {
            form: {
                submit: 'Enviar formulario'
            }
        }
    }
};

export function I18nForm() {
    const [language, setLanguage] = useState<'en' | 'es' | 'fr' | 'pt'>('en');
    const [formData, setFormData] = useState<FormValues | null>(null);

    const handleSubmit = async (data: FormValues) => {
        setFormData(data);
    };

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-xl'>Internationalized Form Example</h2>

            <div className='mb-4 flex space-x-2'>
                <button
                    type='button'
                    onClick={() => setLanguage('en')}
                    className={`rounded px-3 py-1 ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    English
                </button>
                <button
                    type='button'
                    onClick={() => setLanguage('es')}
                    className={`rounded px-3 py-1 ${language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Español
                </button>
                <button
                    type='button'
                    onClick={() => setLanguage('fr')}
                    className={`rounded px-3 py-1 ${language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Français
                </button>
                <button
                    type='button'
                    onClick={() => setLanguage('pt')}
                    className={`rounded px-3 py-1 ${language === 'pt' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Português
                </button>
            </div>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={defaultValues}
                className='space-y-4'
                i18n={{
                    lng: language,
                    resources: customResources
                }}
            >
                <FormField
                    name='name'
                    label='Name'
                    required={true}
                >
                    <input
                        type='text'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Your name'
                    />
                </FormField>

                <FormField
                    name='email'
                    label='Email'
                    required={true}
                >
                    <input
                        type='email'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='your.email@example.com'
                    />
                </FormField>

                <FormField
                    name='message'
                    label='Message'
                    description='Tell us what you think'
                    required={true}
                >
                    <textarea
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        rows={4}
                        placeholder='Enter your message here...'
                    />
                </FormField>

                <button
                    type='submit'
                    className='mt-6 w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600'
                >
                    Submit
                </button>
            </FormProvider>

            {formData && (
                <div className='mt-6 rounded-md border border-gray-200 bg-gray-50 p-4'>
                    <h3 className='mb-2 font-semibold text-lg'>Submitted Data:</h3>
                    <pre className='overflow-auto text-sm'>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
