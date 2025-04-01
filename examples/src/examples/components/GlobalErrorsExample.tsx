import { FormButtonsBar, FormDescription, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address')
});

interface GlobalErrorsProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

// Simulated API call that sometimes fails
const submitToAPI = async (data: FormData): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random API errors
    if (Math.random() > 0.7) {
        throw new Error('Server is temporarily unavailable. Please try again later.');
    }

    // Simulate credential errors
    if (data.email === 'admin@admin' || data.username === 'admin') {
        throw new Error('Credential errors');
    }

    console.info('Form submitted successfully:', data);
};

export function GlobalErrorsExample({ setResult }: GlobalErrorsProps) {
    const handleSubmit = async (data: FormData) => {
        try {
            setResult(data);
            await submitToAPI(data);
        } catch (error) {
            // This error will be displayed as a global error
            return error;
        }
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            globalErrorOptions={{
                position: 'bottom',
                animation: 'fadeIn',
                autoDismiss: true,
                dismissAfter: 5000,
                className: 'shadow-lg'
            }}
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4'
            >
                Submit the form multiple times to see different global error scenarios:
                <ul className='list-disc pt-2 pl-5'>
                    <li>Random API errors will trigger global error messages</li>
                    <li>Errors auto-dismiss after 5 seconds</li>
                    <li>Errors show with fade-in animation</li>
                    <li>admin or admin@admin.com throw error</li>
                </ul>
            </FormDescription>

            <div className='space-y-6'>
                <FormField
                    name='username'
                    label='Username'
                    required={true}
                    tooltip='Enter your username'
                >
                    <input
                        type='text'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder='Choose a username'
                    />
                </FormField>

                <FormField
                    name='email'
                    label='Email'
                    required={true}
                    tooltip='Enter your email address'
                >
                    <input
                        type='email'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder='Enter your email'
                    />
                </FormField>

                <FormButtonsBar
                    direction='horizontal'
                    fullWidth={true}
                    onCancel={() => console.log('Cancelled')}
                    buttonStyles={{
                        submit: 'bg-green-600 hover:bg-green-700',
                        reset: 'bg-orange-100 hover:bg-orange-200',
                        cancel: 'bg-red-50 hover:bg-red-100'
                    }}
                />
            </div>
        </FormProvider>
    );
}
