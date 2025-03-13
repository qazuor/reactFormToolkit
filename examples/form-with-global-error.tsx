import { useState } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { z } from 'zod';
import { FormError, FormField, FormProvider, SubmitButton } from '../src';

// Define the form schema using Zod
const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Default values
const defaultValues: Partial<FormValues> = {
    username: '',
    password: ''
};

// Simulate an API call that might fail
const simulateLogin = async (data: FormValues) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate a server error for specific credentials
    if (data.username === 'admin' && data.password === 'wrongPassword') {
        throw new Error('Invalid credentials. Please try again.');
    }

    // Simulate a network error randomly
    if (Math.random() < 0.3) {
        throw new Error('Network error. Please check your connection and try again.');
    }

    // Simulate a successful login
    return { success: true, user: { id: 1, username: data.username } };
};

export function FormWithGlobalError() {
    const [user, setUser] = useState<{ id: number; username: string } | null>(null);
    const [submitCount, setSubmitCount] = useState(0);

    const handleSubmit = async (data: FormValues) => {
        setUser(null);
        // Increment submit count to track submission attempts
        setSubmitCount((prev) => prev + 1);

        // This will throw an error if the login fails
        const result = await simulateLogin(data);

        // If successful, set the user
        setUser(result.user);
    };

    const handleError = (error: Error) => {
        console.error('Form submission error:', error);
        // You could do additional error handling here
    };

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-xl'>Login Form with Global Error</h2>
            <p className='mb-4 text-gray-600 text-sm'>
                Try these combinations to see different errors:
                <br />- Username: "admin", Password: "wrongPassword" (Invalid credentials error)
                <br />- Any values (30% chance of network error)
            </p>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                onError={handleError}
                schema={formSchema}
                defaultValues={defaultValues}
                className='space-y-4'
            >
                <FormField
                    name='username'
                    label='Username'
                    required={true}
                >
                    <input
                        type='text'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter your username'
                    />
                </FormField>

                <FormField
                    name='password'
                    label='Password'
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter your password'
                    />
                </FormField>

                {/* Global error display */}
                <FormError className='rounded-md border border-red-200 bg-red-50 p-3' />

                <SubmitButton
                    className='w-full'
                    text='Log In'
                    loadingText='Logging In...'
                    successText='Logged In!'
                />
            </FormProvider>

            {user && (
                <div className='mt-6 animate-fadeIn rounded-md border border-green-200 bg-green-50 p-4'>
                    <h3 className='mb-2 font-semibold text-green-800 text-lg'>Login Successful!</h3>
                    <p className='text-green-700'>
                        Welcome back, <span className='font-semibold'>{user.username}</span>!
                    </p>
                </div>
            )}

            {submitCount > 0 && <div className='mt-4 text-gray-500 text-xs'>Submit attempts: {submitCount}</div>}
        </div>
    );
}
