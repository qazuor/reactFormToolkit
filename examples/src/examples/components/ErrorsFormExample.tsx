import { FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

export function ErrorsFormExample() {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        console.info('Form submitted:', data);
    };

    return (
        <div className='space-y-8'>
            <section className='space-y-4'>
                <h2 className='font-bold text-xl'>Default Error Display</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label='Username'
                        >
                            <input type='text' />
                        </FormField>
                        <FormField
                            name='email'
                            label='Email'
                        >
                            <input type='email' />
                        </FormField>
                        <button
                            type='submit'
                            className='bg-blue-600 px-4 py-2 rounded text-white'
                        >
                            Submit
                        </button>
                    </div>
                </FormProvider>
            </section>

            <section className='space-y-4'>
                <h2 className='font-bold text-xl'>Animated Errors</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                    errorDisplayOptions={{
                        animation: 'shake',
                        delay: 200
                    }}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label='Username'
                        >
                            <input type='text' />
                        </FormField>
                        <FormField
                            name='email'
                            label='Email'
                        >
                            <input type='email' />
                        </FormField>
                        <button
                            type='submit'
                            className='bg-blue-600 px-4 py-2 rounded text-white'
                        >
                            Submit
                        </button>
                    </div>
                </FormProvider>
            </section>

            <section className='space-y-4'>
                <h2 className='font-bold text-xl'>Tooltip Errors</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                    errorDisplayOptions={{
                        position: 'tooltip',
                        animation: 'fadeIn'
                    }}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label='Username'
                        >
                            <input type='text' />
                        </FormField>
                        <FormField
                            name='email'
                            label='Email'
                        >
                            <input type='email' />
                        </FormField>
                        <button
                            type='submit'
                            className='bg-blue-600 px-4 py-2 rounded text-white'
                        >
                            Submit
                        </button>
                    </div>
                </FormProvider>
            </section>

            <section className='space-y-4'>
                <h2 className='font-bold text-xl'>Grouped Errors</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                    errorDisplayOptions={{
                        groupErrors: true,
                        maxErrors: 2,
                        className: 'bg-red-100 border-red-300'
                    }}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label='Username'
                        >
                            <input type='text' />
                        </FormField>
                        <FormField
                            name='email'
                            label='Email'
                        >
                            <input type='email' />
                        </FormField>
                        <FormField
                            name='password'
                            label='Password'
                        >
                            <input type='password' />
                        </FormField>
                        <button
                            type='submit'
                            className='bg-blue-600 px-4 py-2 rounded text-white'
                        >
                            Submit
                        </button>
                    </div>
                </FormProvider>
            </section>

            <section className='space-y-4'>
                <h2 className='font-bold text-xl'>Auto-dismiss Errors</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                    errorDisplayOptions={{
                        animation: 'fadeIn',
                        autoDismiss: true,
                        dismissAfter: 3000
                    }}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label='Username'
                        >
                            <input type='text' />
                        </FormField>
                        <FormField
                            name='email'
                            label='Email'
                        >
                            <input type='email' />
                        </FormField>
                        <button
                            type='submit'
                            className='bg-blue-600 px-4 py-2 rounded text-white'
                        >
                            Submit
                        </button>
                    </div>
                </FormProvider>
            </section>

            <section className='space-y-4'>
                <h2 className='font-bold text-xl'>Mixed Error Styles</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                    errorDisplayOptions={{
                        position: 'below',
                        animation: 'fadeIn'
                    }}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label='Username'
                            errorDisplayOptions={{
                                position: 'tooltip',
                                animation: 'shake'
                            }}
                        >
                            <input type='text' />
                        </FormField>
                        <FormField
                            name='email'
                            label='Email'
                            errorDisplayOptions={{
                                position: 'right',
                                animation: 'slideIn'
                            }}
                        >
                            <input type='email' />
                        </FormField>
                        <button
                            type='submit'
                            className='bg-blue-600 px-4 py-2 rounded text-white'
                        >
                            Submit
                        </button>
                    </div>
                </FormProvider>
            </section>
        </div>
    );
}
