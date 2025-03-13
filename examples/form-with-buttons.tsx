// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { CancelButton, FormField, FormProvider, ResetButton, SubmitButton } from '../src';

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

export function FormWithButtons() {
    const [formData, setFormData] = useState<FormValues | null>(null);
    const [formVisible, setFormVisible] = useState(true);

    const handleSubmit = async (data: FormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFormData(data);
    };

    const handleCancel = () => {
        setFormVisible(false);
        // In a real app, you might navigate away or close a modal
        setTimeout(() => setFormVisible(true), 1000); // For demo purposes, show the form again after 1 second
    };

    const handleReset = () => {
        setFormData(null);
        // Additional reset logic if needed
    };

    if (!formVisible) {
        return (
            <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
                <h2 className='mb-4 font-bold text-xl'>Form Cancelled</h2>
                <p>The form has been cancelled. It will reappear shortly...</p>
            </div>
        );
    }

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-xl'>Form With Action Buttons</h2>
            <p className='mb-4 text-gray-600 text-sm'>
                This form demonstrates the use of Submit, Reset, and Cancel buttons.
            </p>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={defaultValues}
                className='space-y-4'
            >
                <FormField
                    name='name'
                    label='Your Name'
                    required={true}
                >
                    <input
                        type='text'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter your name'
                    />
                </FormField>

                <FormField
                    name='email'
                    label='Email Address'
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
                    label='Your Message'
                    required={true}
                >
                    <textarea
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        rows={4}
                        placeholder='Enter your message here...'
                    />
                </FormField>

                <div className='flex space-x-3 pt-2'>
                    <SubmitButton
                        className='flex-1'
                        text='Submit'
                        loadingText='Submitting...'
                        successText='Submitted!'
                    />
                    <ResetButton
                        className='flex-1'
                        confirmReset={true}
                        onReset={handleReset}
                    />
                    <CancelButton
                        className='flex-1'
                        confirmCancel={true}
                        onCancel={handleCancel}
                    />
                </div>
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
