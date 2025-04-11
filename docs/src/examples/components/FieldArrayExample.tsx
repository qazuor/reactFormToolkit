import {
    CancelButton,
    FieldArray,
    FormDescription,
    FormField,
    FormProvider,
    ResetButton,
    SubmitButton
} from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    departments: z
        .array(
            z.object({
                name: z.string().min(2, 'Department name must be at least 2 characters'),
                manager: z.string().min(2, 'Manager name must be at least 2 characters'),
                employees: z
                    .array(
                        z.object({
                            name: z.string().min(2, 'Employee name must be at least 2 characters'),
                            email: z.string().email('Invalid email address'),
                            skills: z
                                .array(
                                    z.object({
                                        name: z.string().min(2, 'Skill name must be at least 2 characters'),
                                        level: z.number().min(1).max(5)
                                    })
                                )
                                .min(1, 'At least one skill is required')
                        })
                    )
                    .min(1, 'At least one employee is required')
            })
        )
        .min(1, 'At least one department is required')
});

interface FieldArrayProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

type FormData = z.infer<typeof schema>;

const defaultValues = {
    companyName: '',
    departments: [
        {
            name: '',
            manager: '',
            employees: [
                {
                    name: '',
                    email: '',
                    skills: [
                        {
                            name: '',
                            level: 1
                        }
                    ]
                }
            ]
        }
    ]
};

export function FieldArrayExample({ setResult }: FieldArrayProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
        >
            <div className='space-y-6'>
                <FormDescription position='above'>Company Organization Structure</FormDescription>

                {/* Company Level */}
                <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <FormField
                        name='companyName'
                        label='Company Name'
                        required={true}
                        tooltip="Enter your company's legal name"
                    >
                        <input
                            type='text'
                            className='w-full rounded-md border px-3 py-2'
                            placeholder='Enter company name'
                        />
                    </FormField>
                </div>

                {/* Departments Array */}
                <FieldArray
                    name='departments'
                    minItems={1}
                    maxItems={5}
                    className='space-y-6'
                >
                    <div className='rounded-lg border bg-gray-50 p-6'>
                        <div className='mb-4 space-y-4'>
                            <FormField
                                name='name'
                                label='Department Name'
                                required={true}
                            >
                                <input
                                    type='text'
                                    className='w-full rounded-md border px-3 py-2'
                                    placeholder='Enter department name'
                                />
                            </FormField>

                            <FormField
                                name='manager'
                                label='Department Manager'
                                required={true}
                            >
                                <input
                                    type='text'
                                    className='w-full rounded-md border px-3 py-2'
                                    placeholder='Enter manager name'
                                />
                            </FormField>
                        </div>

                        {/* Employees Nested Array */}
                        <FieldArray
                            name='employees'
                            minItems={1}
                            maxItems={10}
                            className='space-y-4'
                        >
                            <div className='rounded-lg border bg-white p-4'>
                                <div className='mb-4 space-y-4'>
                                    <FormField
                                        name='name'
                                        label='Employee Name'
                                        required={true}
                                    >
                                        <input
                                            type='text'
                                            className='w-full rounded-md border px-3 py-2'
                                            placeholder='Enter employee name'
                                        />
                                    </FormField>

                                    <FormField
                                        name='email'
                                        label='Employee Email'
                                        required={true}
                                    >
                                        <input
                                            type='email'
                                            className='w-full rounded-md border px-3 py-2'
                                            placeholder='Enter employee email'
                                        />
                                    </FormField>
                                </div>

                                {/* Skills Nested Array */}
                                <FieldArray
                                    name='skills'
                                    minItems={1}
                                    maxItems={5}
                                    className='space-y-2'
                                >
                                    <div className='rounded border bg-gray-50 p-4'>
                                        <div className='grid gap-4 md:grid-cols-2'>
                                            <FormField
                                                name='name'
                                                label='Skill Name'
                                                required={true}
                                            >
                                                <input
                                                    type='text'
                                                    className='w-full rounded-md border px-3 py-2'
                                                    placeholder='Enter skill name'
                                                />
                                            </FormField>

                                            <FormField
                                                name='level'
                                                label='Skill Level (1-5)'
                                                required={true}
                                            >
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='5'
                                                    className='w-full rounded-md border px-3 py-2'
                                                />
                                            </FormField>
                                        </div>
                                    </div>
                                </FieldArray>
                            </div>
                        </FieldArray>
                    </div>
                </FieldArray>

                <SubmitButton>{t('form.submit')}</SubmitButton>
                <ResetButton />
                <CancelButton onCancel={() => console.log('Cancelled')} />
            </div>
        </FormProvider>
    );
}
