import { useState } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { z } from 'zod';
import { FormField, FormProvider, SubmitButton } from '../src';

// Define the form schema using Zod
const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .refine((val) => /[A-Z]/.test(val), {
            message: 'Password must contain at least one uppercase letter'
        })
        .refine((val) => /[0-9]/.test(val), {
            message: 'Password must contain at least one number'
        }),
    birthdate: z.string().refine((val) => !val || new Date(val) < new Date(), {
        message: 'Birthdate must be in the past'
    }),
    occupation: z.string().optional()
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Default values
const defaultValues: Partial<FormValues> = {
    username: '',
    email: '',
    password: '',
    birthdate: '',
    occupation: ''
};

export function FormWithTooltips() {
    const [formData, setFormData] = useState<FormValues | null>(null);

    const handleSubmit = async (data: FormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setFormData(data);
    };

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-xl'>Form With Tooltips</h2>
            <p className='mb-4 text-gray-600 text-sm'>
                Hover over the information icons to see additional details about each field.
            </p>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={defaultValues}
                className='space-y-4'
            >
                <FormField
                    name='username'
                    label='Username'
                    required={true}
                    tooltip='Choose a unique username that will identify you on our platform. Usernames must be at least 3 characters long.'
                >
                    <input
                        type='text'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Choose a username'
                    />
                </FormField>

                <FormField
                    name='email'
                    label='Email Address'
                    required={true}
                    tooltip="We'll use this email to send important notifications and for account recovery."
                    tooltipPosition='right'
                >
                    <input
                        type='email'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='your.email@example.com'
                    />
                </FormField>

                <FormField
                    name='password'
                    label='Password'
                    required={true}
                    tooltip='Your password must be at least 8 characters long and include at least one uppercase letter and one number for security.'
                >
                    <input
                        type='password'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Create a password'
                    />
                </FormField>

                <FormField
                    name='birthdate'
                    label='Birth Date'
                    tooltip='We use your birth date to verify your age and provide age-appropriate content.'
                    tooltipPosition='bottom'
                >
                    <input
                        type='date'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </FormField>

                <FormField
                    name='occupation'
                    label='Occupation'
                    tooltip='This helps us understand our user base better and tailor our services. This information is optional.'
                    tooltipPosition='left'
                >
                    <input
                        type='text'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='What do you do? (optional)'
                    />
                </FormField>

                <SubmitButton
                    className='mt-6 w-full'
                    text='Create Account'
                    loadingText='Creating Account...'
                    successText='Account Created!'
                />
            </FormProvider>

            {formData && (
                <div className='mt-6 animate-fadeIn rounded-md border border-gray-200 bg-gray-50 p-4'>
                    <h3 className='mb-2 font-semibold text-lg'>Submitted Data:</h3>
                    <pre className='overflow-auto text-sm'>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
