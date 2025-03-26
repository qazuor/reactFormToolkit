import {
    type AsyncValidationProps,
    CancelButton,
    FormDescription,
    FormField,
    FormProvider,
    ResetButton,
    SubmitButton
} from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address')
});

type FormData = z.infer<typeof schema>;

// Simulated API calls
const checkUsername = async (username: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return !['admin', 'root', 'test'].includes(username);
};

const checkEmail = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return !['admin@example.com', 'test@example.com'].includes(email);
};

export function AsyncValidationExample() {
    const { t } = useTranslation();

    const handleSubmit = async (data: FormData) => {
        console.info('Form submitted:', data);
    };

    const userNameAsyncValidationOptions: AsyncValidationProps = {
        asyncValidationDebounce: 1000,
        showValidationIcons: true,
        showLoadingSpinner: true,
        textWhenValidating: 'Checking username...',
        textWhenBeforeStartValidating: 'Username will be checked for availability',
        asyncValidationFn: async (value) => {
            if (!value) {
                return undefined;
            }
            const isAvailable = await checkUsername(value as string);
            return isAvailable ? true : 'Username is already taken';
        }
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
        >
            <FormDescription
                position='above'
                className='rounded-lg bg-blue-50 p-4'
            >
                Try these values to see validation in action:
                <ul className='list-disc pt-2 pl-5'>
                    <li>Username: admin, root, test</li>
                    <li>Email: admin@example.com, test@example.com</li>
                </ul>
            </FormDescription>

            <div className='space-y-6'>
                <FormField
                    name='username'
                    label='Username'
                    required={true}
                    tooltip='Enter a unique username'
                    asyncValidation={userNameAsyncValidationOptions}
                >
                    <input
                        autoComplete='off'
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
                    asyncValidation={{
                        asyncValidationDebounce: 1000,
                        showValidationIcons: true,
                        showLoadingSpinner: true,
                        textWhenValidating: 'Checking email...',
                        textWhenBeforeStartValidating: 'Email will be checked for availability',
                        asyncValidationFn: async (value) => {
                            if (!value) {
                                return undefined;
                            }
                            const isAvailable = await checkEmail(value as string);
                            return isAvailable ? true : 'Email is already registered';
                        }
                    }}
                >
                    <input
                        autoComplete='off'
                        type='email'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder='Enter your email'
                    />
                </FormField>

                <SubmitButton>{t('form.submit')}</SubmitButton>
                <ResetButton />
                <CancelButton onCancel={() => console.log('Cancelled')} />
            </div>
        </FormProvider>
    );
}
