import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FormButtonsBar, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    role: z.string().min(1, 'Please select a role'),
    newsletter: z.boolean(),
    programmingLanguage: z.string().optional(),
    frameworks: z.array(z.string()).optional(),
    experience: z.string().optional(),
    darkMode: z.boolean().optional()
});

interface ShadcnUIExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function ShadcnUIExample({ setResult }: ShadcnUIExampleProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <div className='space-y-4'>
            <FormProvider
                schema={schema}
                onSubmit={handleSubmit}
                defaultValues={{
                    name: '',
                    email: '',
                    bio: '',
                    role: '',
                    newsletter: false,
                    programmingLanguage: '',
                    frameworks: [],
                    experience: '',
                    darkMode: false
                }}
                uiLibrary={{ enabled: true, name: 'shadcn' }}
            >
                <FormField
                    name='name'
                    label='Name'
                    required={true}
                >
                    <Input placeholder='Enter your name' />
                </FormField>

                {/* Email Input */}
                <FormField
                    name='email'
                    label='Email'
                    required={true}
                >
                    <Input
                        type='email'
                        placeholder='Enter your email'
                    />
                </FormField>

                {/* Textarea */}
                <FormField
                    name='bio'
                    label='Bio'
                    required={true}
                >
                    <textarea
                        placeholder='Tell us about yourself'
                        style={{ height: '120px', width: '100%' }}
                    />
                </FormField>

                {/* Select */}
                <FormField
                    name='role'
                    label='Role'
                    required={true}
                >
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='developer'>Developer</SelectItem>
                            <SelectItem value='designer'>Designer</SelectItem>
                            <SelectItem value='manager'>Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>

                {/* Checkbox */}
                <FormField
                    name='newsletter'
                    label='Subscribe to newsletter'
                >
                    <input type='checkbox' />
                </FormField>

                {/* Radio Group */}
                <FormField
                    name='experience'
                    label='Experience Level'
                >
                    <RadioGroup>
                        <div>
                            <RadioGroupItem
                                value='beginner'
                                id='shadcn-beginner'
                            />
                            <label htmlFor='shadcn-beginner'>Beginner</label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value='intermediate'
                                id='shadcn-intermediate'
                            />
                            <label htmlFor='shadcn-intermediate'>Intermediate</label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value='expert'
                                id='shadcn-expert'
                            />
                            <label htmlFor='shadcn-expert'>Expert</label>
                        </div>
                    </RadioGroup>
                </FormField>

                {/* Toggle Group */}
                <FormField
                    name='frameworks'
                    label='Frameworks'
                >
                    {({ field }) => (
                        <ToggleGroup
                            type='multiple'
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                        >
                            <ToggleGroupItem value='react'>React</ToggleGroupItem>
                            <ToggleGroupItem value='angular'>Angular</ToggleGroupItem>
                            <ToggleGroupItem value='vue'>Vue</ToggleGroupItem>
                            <ToggleGroupItem value='svelte'>Svelte</ToggleGroupItem>
                        </ToggleGroup>
                    )}
                </FormField>

                {/* Switch */}
                <FormField
                    name='darkMode'
                    label='Dark Mode'
                >
                    <div>
                        <Switch id='shadcn-dark-mode' />
                        <label htmlFor='shadcn-dark-mode'>Enable Dark Mode</label>
                    </div>
                </FormField>

                <FormButtonsBar />
            </FormProvider>
        </div>
    );
}
