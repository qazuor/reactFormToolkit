import { useState } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { z } from 'zod';
import { FormField, FormProvider } from '../src';

// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    role: z.string().min(1, 'Please select a role'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    agreeToTerms: z.literal(true, {
        errorMap: () => ({ message: 'You must agree to the terms and conditions' })
    })
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Default values
const defaultValues: Partial<FormValues> = {
    name: '',
    email: '',
    role: '',
    message: '',
    agreeToTerms: true
};

export function AdvancedForm() {
    const [formData, setFormData] = useState<FormValues | null>(null);

    const handleSubmit = async (data: FormValues) => {
        setFormData(data);
    };

    return (
        <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 font-bold text-xl'>Advanced Form Example</h2>

            <FormProvider<FormValues>
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={defaultValues}
                className='space-y-4'
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
                    name='role'
                    label='Role'
                    required={true}
                >
                    <select className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                        <option value=''>Select a role</option>
                        <option value='developer'>Developer</option>
                        <option value='designer'>Designer</option>
                        <option value='manager'>Manager</option>
                        <option value='other'>Other</option>
                    </select>
                </FormField>

                <FormField
                    name='message'
                    label='Message'
                    required={true}
                >
                    <textarea
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        rows={4}
                        placeholder='Enter your message here...'
                    />
                </FormField>

                <FormField
                    name='agreeToTerms'
                    className='mt-6'
                >
                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />
                        <span className='ml-2 block text-gray-900 text-sm'>I agree to the terms and conditions</span>
                    </div>
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
