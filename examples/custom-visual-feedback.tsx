// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { FormField, FormProvider, SubmitButton } from '../src';

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

export function CustomVisualFeedbackForm() {
    const [formData, setFormData] = useState<FormValues | null>(null);

    const handleSubmit = async (data: FormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFormData(data);
    };

    // Custom styles with different visual feedback
    const customStyles = {
        form: 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg',
        field: {
            wrapper: 'mb-5 relative',
            label: 'block text-gray-800 text-sm font-semibold mb-2',
            input: 'w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-purple-500 transition-all duration-300',
            error: 'text-red-600 text-xs mt-1 font-medium animate-shake',
            description: 'text-gray-500 text-xs mt-1 italic',
            requiredMark: 'text-purple-500 ml-1',
            validating: 'ml-2 text-xs text-purple-500 animate-pulse',
            valid: 'absolute right-3 top-9 text-green-500 animate-fadeIn',
            invalid: 'absolute right-3 top-10 text-red-500',
            loading: 'absolute right-3 top-10 text-purple-500 animate-spin'
        }
    };

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-purple-800 text-xl'>Custom Visual Feedback</h2>
            <p className='mb-4 text-gray-600 text-sm'>
                This form demonstrates customized visual feedback with purple accents and different animations.
            </p>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={defaultValues}
                styles={customStyles}
                mode='onChange'
            >
                <FormField
                    name='name'
                    label='Your Name'
                    required={true}
                >
                    <input
                        type='text'
                        placeholder='Enter your name'
                    />
                </FormField>

                <FormField
                    name='email'
                    label='Email Address'
                    required={true}
                    description="We'll never share your email with anyone else"
                >
                    <input
                        type='email'
                        placeholder='your.email@example.com'
                    />
                </FormField>

                <FormField
                    name='message'
                    label='Your Message'
                    required={true}
                >
                    <textarea
                        rows={4}
                        placeholder='Enter your message here...'
                        className='w-full rounded-md border-2 border-gray-200 px-4 py-2 transition-all duration-300 focus:border-purple-500 focus:outline-none'
                    />
                </FormField>

                <SubmitButton
                    className='mt-6 w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-purple-700'
                    text='Send Message'
                    loadingText='Sending...'
                    successText='Message Sent!'
                />
            </FormProvider>

            {formData && (
                <div className='mt-6 animate-fadeIn rounded-md border border-purple-200 bg-purple-50 p-4'>
                    <h3 className='mb-2 font-semibold text-lg text-purple-800'>Message Sent!</h3>
                    <pre className='overflow-auto text-purple-700 text-sm'>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
