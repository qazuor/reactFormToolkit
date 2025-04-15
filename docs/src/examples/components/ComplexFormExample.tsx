import {
    ConditionalField,
    FieldArray,
    FormButtonsBar,
    FormDescription,
    FormField,
    FormProvider
} from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    projectName: z.string().min(3, 'Project name must be at least 3 characters'),
    projectType: z.enum(['web', 'mobile', 'desktop']),
    // Conditional fields based on project type
    webFramework: z.string().optional(),
    mobileFramework: z.string().optional(),
    desktopFramework: z.string().optional(),
    // Dependent fields
    primaryLanguage: z.string().min(1, 'Please select a primary language'),
    frameworks: z.array(z.string()).min(1, 'Please select at least one framework'),
    // Dynamic array for team members
    teamMembers: z
        .array(
            z.object({
                name: z.string().min(2, 'Name must be at least 2 characters'),
                role: z.string().min(2, 'Role must be at least 2 characters'),
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
        .min(1, 'At least one team member is required')
});

interface ComplexFormProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

// Simulated API calls
const checkProjectName = async (name: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return !['test', 'demo', 'example'].includes(name.toLowerCase());
};

export function ComplexFormExample({ setResult }: ComplexFormProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            errorDisplayOptions={{
                position: 'below',
                animation: 'fadeIn',
                showIcon: true,
                autoDismiss: true,
                dismissAfter: 5000
            }}
            defaultValues={{
                projectType: 'web',
                teamMembers: [
                    {
                        name: '',
                        role: '',
                        skills: [{ name: '', level: 1 }]
                    }
                ]
            }}
        >
            <FormDescription position='above'>{t('form.complexFormdescription')}</FormDescription>
            <div className='space-y-8'>
                {/* Basic Project Info */}
                <div className='rounded-lg border bg-gray-50 p-6 dark:bg-gray-800 dark:border-gray-700'>
                    <h3 className='mb-4 font-bold text-lg'>Project Information</h3>
                    <div className='space-y-4'>
                        <FormField
                            name='projectName'
                            label='Project Name'
                            required={true}
                            tooltip='Enter a unique project name'
                            asyncValidation={{
                                asyncValidationFn: async (value) => {
                                    const isAvailable = await checkProjectName(value as string);
                                    return isAvailable ? true : 'Project name is already taken';
                                },
                                asyncValidationDebounce: 500,
                                showValidationIcons: true,
                                textWhenValidating: 'Checking project name...'
                            }}
                        >
                            <input type='text' />
                        </FormField>

                        <FormField
                            name='projectType'
                            label='Project Type'
                            required={true}
                        >
                            <select>
                                <option value='web'>Web Application</option>
                                <option value='mobile'>Mobile Application</option>
                                <option value='desktop'>Desktop Application</option>
                            </select>
                        </FormField>

                        {/* Conditional Fields based on Project Type */}
                        <ConditionalField
                            watchField='projectType'
                            condition='web'
                        >
                            <FormField
                                name='webFramework'
                                label='Web Framework'
                                required={true}
                            >
                                <select>
                                    <option value=''>Select Framework</option>
                                    <option value='react'>React</option>
                                    <option value='vue'>Vue</option>
                                    <option value='angular'>Angular</option>
                                </select>
                            </FormField>
                        </ConditionalField>

                        <ConditionalField
                            watchField='projectType'
                            condition='mobile'
                        >
                            <FormField
                                name='mobileFramework'
                                label='Mobile Framework'
                                required={true}
                            >
                                <select>
                                    <option value=''>Select Framework</option>
                                    <option value='react-native'>React Native</option>
                                    <option value='flutter'>Flutter</option>
                                    <option value='ionic'>Ionic</option>
                                </select>
                            </FormField>
                        </ConditionalField>

                        <ConditionalField
                            watchField='projectType'
                            condition='desktop'
                        >
                            <FormField
                                name='desktopFramework'
                                label='Desktop Framework'
                                required={true}
                            >
                                <select>
                                    <option value=''>Select Framework</option>
                                    <option value='electron'>Electron</option>
                                    <option value='tauri'>Tauri</option>
                                    <option value='qt'>Qt</option>
                                </select>
                            </FormField>
                        </ConditionalField>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className='rounded-lg border bg-gray-50 p-6 dark:bg-gray-800 dark:border-gray-700'>
                    <h3 className='mb-4 font-bold text-lg'>Technology Stack</h3>
                    <div className='space-y-4'>
                        <FormField
                            name='primaryLanguage'
                            label='Primary Language'
                            required={true}
                        >
                            <select>
                                <option value=''>Select Language</option>
                                <option value='javascript'>JavaScript</option>
                                <option value='typescript'>TypeScript</option>
                                <option value='python'>Python</option>
                                <option value='java'>Java</option>
                                <option value='csharp'>C#</option>
                                <option value='go'>Go</option>
                            </select>
                        </FormField>
                    </div>
                </div>

                {/* Team Members */}
                <div className='rounded-lg border bg-gray-50 p-6 dark:bg-gray-800 dark:border-gray-700'>
                    <h3 className='mb-4 font-bold text-lg'>Team Members</h3>
                    <FieldArray
                        name='teamMembers'
                        minItems={1}
                        maxItems={5}
                        className='space-y-6'
                    >
                        <div className='rounded-lg border bg-white p-4 dark:bg-gray-700 dark:border-gray-600'>
                            <div className='mb-4 space-y-4'>
                                <FormField
                                    name='name'
                                    label='Member Name'
                                    required={true}
                                >
                                    <input type='text' />
                                </FormField>

                                <FormField
                                    name='role'
                                    label='Role'
                                    required={true}
                                >
                                    <input type='text' />
                                </FormField>
                            </div>

                            <FieldArray
                                name='skills'
                                minItems={1}
                                maxItems={5}
                                className='space-y-4'
                            >
                                <div className='rounded border bg-gray-50 p-4 dark:bg-gray-800 dark:border-gray-700'>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                        <FormField
                                            name='name'
                                            label='Skill'
                                            required={true}
                                        >
                                            <input type='text' />
                                        </FormField>

                                        <FormField
                                            name='level'
                                            label='Level (1-5)'
                                            required={true}
                                        >
                                            <input
                                                type='number'
                                                min='1'
                                                max='5'
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            </FieldArray>
                        </div>
                    </FieldArray>
                </div>

                <FormButtonsBar
                    direction='horizontal'
                    fullWidth={true}
                    buttonStyles={{
                        submit: 'bg-blue-600 hover:bg-blue-700',
                        reset: 'bg-gray-200 hover:bg-gray-300',
                        cancel: 'bg-red-100 hover:bg-red-200'
                    }}
                />
            </div>
        </FormProvider>
    );
}
