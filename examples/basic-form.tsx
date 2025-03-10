// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { z } from 'zod';
import { FormField, FormProvider } from '../src';

// Define the form schema using Zod
const formSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters')
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Default values
const defaultValues: Partial<FormValues> = {
    fullName: '',
    email: '',
    username: ''
};

export function BasicForm() {
    const handleSubmit = async (data: FormValues) => {
        console.info('Form submitted:', data);
        // Handle form submission logic here
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <FormProvider<FormValues>
            onSubmit={handleSubmit}
            schema={formSchema}
            defaultValues={defaultValues}
            className='mx-auto w-full max-w-md space-y-6'
        >
            <FormField
                name='fullName'
                label='Full Name'
                description='Enter your full name'
                required={true}
            >
                <input
                    type='text'
                    placeholder='John Doe'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </FormField>

            <FormField
                name='email'
                label='Email'
                required={true}
            >
                <input
                    type='email'
                    placeholder='john@example.com'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </FormField>

            <FormField
                name='username'
                label='Username'
                required={true}
            >
                <input
                    type='text'
                    placeholder='johndoe'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </FormField>

            <button
                type='submit'
                className='w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600'
            >
                Submit
            </button>
        </FormProvider>
    );
}
