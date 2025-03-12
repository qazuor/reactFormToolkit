import { useState } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { z } from 'zod';
import { FormField, FormProvider } from '../src';
import type { AsyncValidateFunction } from '../src/types';

// Define the form schema using Zod
const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address')
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Default values
const defaultValues: Partial<FormValues> = {
    username: '',
    email: ''
};

// Simulated database of existing users
const existingUsers = [
    { username: 'admin', email: 'admin@example.com' },
    { username: 'user1', email: 'user1@example.com' },
    { username: 'johndoe', email: 'john@example.com' }
];

export function AsyncValidationForm() {
    const [formData, setFormData] = useState<FormValues | null>(null);

    const handleSubmit = async (data: FormValues) => {
        setFormData(data);
    };

    // Async validation function for username
    const validateUsername: AsyncValidateFunction = async (value) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if username exists
        const exists = existingUsers.some((user) => user.username.toLowerCase() === (value as string).toLowerCase());
        return exists ? 'This username is already taken' : true;
    };

    // Async validation function for email
    const validateEmail: AsyncValidateFunction = async (value) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if email exists
        const exists = existingUsers.some((user) => user.email.toLowerCase() === (value as string).toLowerCase());
        return exists ? 'This email is already registered' : true;
    };

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-xl'>Async Validation Example</h2>
            <p className='mb-4 text-gray-600 text-sm'>
                Try using usernames "admin", "user1", or "johndoe" to see validation errors.
                <br />
                Try emails "admin@example.com", "user1@example.com", or "john@example.com".
            </p>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={defaultValues}
                className='space-y-4'
                mode='onChange' // Use onChange mode for better UX with async validation
            >
                <FormField
                    name='username'
                    label='Username'
                    required={true}
                    asyncValidate={validateUsername}
                    debounceTime={500}
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
                    asyncValidate={validateEmail}
                    debounceTime={800}
                >
                    <input
                        type='email'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='your.email@example.com'
                    />
                </FormField>

                <button
                    type='submit'
                    className='mt-6 w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600'
                >
                    Register
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
