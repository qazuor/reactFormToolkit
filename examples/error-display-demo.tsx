import { useState } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { z } from 'zod';
import { FormField, FormProvider } from '../src';
import type { ErrorAnimation, ErrorPosition } from '../src/types';

const formSchema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

type FormValues = z.infer<typeof formSchema>;

export function ErrorPositioningDemo() {
    const [position, setPosition] = useState<ErrorPosition>('bottom');
    const [animation, setAnimation] = useState<ErrorAnimation>('fade');
    const [showIcon, setShowIcon] = useState(true);
    const [groupErrors, setGroupErrors] = useState(false);
    const [fieldOverride, setFieldOverride] = useState(false);

    const handleSubmit = (data: FormValues) => {
        console.info('Form submitted:', data);
    };

    return (
        <div className='mx-auto max-w-md p-6'>
            <h1 className='mb-6 font-bold text-2xl'>Error Display Demo</h1>

            <div className='mb-6 rounded-md bg-gray-50 p-4'>
                <h2 className='mb-3 font-semibold text-lg'>Configuration</h2>

                <div className='space-y-4'>
                    <div>
                        <label
                            htmlFor='error-position'
                            className='mb-1 block font-medium text-sm'
                        >
                            Error Position
                        </label>
                        <select
                            id='error-position'
                            value={position}
                            onChange={(e) => setPosition(e.target.value as ErrorPosition)}
                            className='w-full rounded border p-2'
                        >
                            <option value='bottom'>Bottom</option>
                            <option value='top'>Top</option>
                            <option value='right'>Right</option>
                            <option value='tooltip'>Tooltip</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor='error-animation'
                            className='mb-1 block font-medium text-sm'
                        >
                            Animation
                        </label>
                        <select
                            id='error-animation'
                            value={animation}
                            onChange={(e) => setAnimation(e.target.value as ErrorAnimation)}
                            className='w-full rounded border p-2'
                        >
                            <option value='fade'>Fade</option>
                            <option value='slide'>Slide</option>
                            <option value='shake'>Shake</option>
                            <option value='pulse'>Pulse</option>
                            <option value='none'>None</option>
                        </select>
                    </div>

                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            id='show-icon'
                            checked={showIcon}
                            onChange={(e) => setShowIcon(e.target.checked)}
                            className='mr-2'
                        />
                        <label
                            htmlFor='show-icon'
                            className='font-medium text-sm'
                        >
                            Show Icon
                        </label>
                    </div>

                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            id='group-errors'
                            checked={groupErrors}
                            onChange={(e) => setGroupErrors(e.target.checked)}
                            className='mr-2'
                        />
                        <label
                            htmlFor='group-errors'
                            className='font-medium text-sm'
                        >
                            Group Errors
                        </label>
                    </div>

                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            id='field-override'
                            checked={fieldOverride}
                            onChange={(e) => setFieldOverride(e.target.checked)}
                            className='mr-2'
                        />
                        <label
                            htmlFor='field-override'
                            className='font-medium text-sm'
                        >
                            Enable Field Override (Email field)
                        </label>
                    </div>
                </div>
            </div>

            <FormProvider
                onSubmit={handleSubmit}
                schema={formSchema}
                defaultValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                mode='onChange'
                errorDisplay={{
                    position,
                    animation,
                    showIcon,
                    groupErrors
                }}
            >
                <div className='space-y-4'>
                    <FormField
                        name='name'
                        label='Name'
                        required={true}
                    >
                        <input
                            type='text'
                            className='w-full rounded border p-2'
                        />
                    </FormField>

                    <FormField
                        name='email'
                        label='Email'
                        required={true}
                        errorDisplay={fieldOverride ? { position: 'tooltip', animation: 'shake' } : undefined}
                    >
                        <input
                            type='email'
                            className='w-full rounded border p-2'
                        />
                    </FormField>

                    <FormField
                        name='password'
                        label='Password'
                        required={true}
                    >
                        <input
                            type='password'
                            className='w-full rounded border p-2'
                        />
                    </FormField>

                    <FormField
                        name='confirmPassword'
                        label='Confirm Password'
                        required={true}
                    >
                        <input
                            type='password'
                            className='w-full rounded border p-2'
                        />
                    </FormField>

                    <button
                        type='submit'
                        className='w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                    >
                        Submit
                    </button>
                </div>
            </FormProvider>
        </div>
    );
}
