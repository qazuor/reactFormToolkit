import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <Input placeholder='Enter your name' />
                </FormField>

                {/* Email Input */}
                <FormField
                    name='email'
                    label='Email'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
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
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <Textarea
                        placeholder='Tell us about yourself'
                        style={{ height: '120px', width: '100%' }}
                    />
                </FormField>

                {/* Select */}
                <FormField
                    name='role'
                    label='Role'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
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
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='newsletter-checkbox'
                            className='h-4 w-4 rounded border-gray-300 text-primary'
                        />
                        <Label
                            htmlFor='newsletter-checkbox'
                            className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                            Subscribe to newsletter
                        </Label>
                    </div>
                </FormField>

                {/* Radio Group */}
                <FormField
                    name='experience'
                    label='Experience Level'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <RadioGroup>
                        <div>
                            <RadioGroupItem
                                value='beginner'
                                id='shadcn-beginner'
                            />
                            <Label htmlFor='shadcn-beginner'>Beginner</Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value='intermediate'
                                id='shadcn-intermediate'
                            />
                            <Label htmlFor='shadcn-intermediate'>Intermediate</Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value='expert'
                                id='shadcn-expert'
                            />
                            <Label htmlFor='shadcn-expert'>Expert</Label>
                        </div>
                    </RadioGroup>
                </FormField>

                {/* Toggle Group */}
                <FormField
                    name='frameworks'
                    label='Frameworks'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
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
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <div className='flex items-center space-x-2'>
                        <Switch id='shadcn-dark-mode' />
                        <Label htmlFor='shadcn-dark-mode'>Enable Dark Mode</Label>
                    </div>
                </FormField>

                <FormButtonsBar />
            </FormProvider>
        </div>
    );
}
