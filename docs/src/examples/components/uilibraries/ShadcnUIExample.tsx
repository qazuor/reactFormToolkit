import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FormButtonsBar, FormField, FormProvider, cn } from '@qazuor/react-form-toolkit';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    role: z.string().min(1, 'Please select a role'),
    status: z.string().min(1, 'Please select a status'),
    startDate: z.any().optional(),
    newsletter: z.boolean(),
    frameworks: z.array(z.string()).optional(),
    experience: z.string().optional(),
    darkMode: z.boolean().optional()
});

interface ShadcnUIExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
    currentTheme?: string;
}

const statuses = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'Todo' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'canceled', label: 'Canceled' }
];

export function ShadcnUIExample({ setResult, currentTheme }: ShadcnUIExampleProps) {
    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    // Note: For shadcn/ui, we don't need to create a theme provider
    // as it already uses the site's theme through Tailwind CSS classes
    // The dark mode is handled by the 'dark:' prefix in Tailwind classes

    // The theme is automatically applied through the HTML class="dark" attribute
    // which is managed by the useTheme hook in the documentation site

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
                    status: '',
                    startDate: '',
                    newsletter: false,
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
                    {({ field }: { field: { onChange: (value: unknown) => void; value: unknown } }) => (
                        <Select
                            onValueChange={(value) => field.onChange(value as string)}
                            value={field.value as string}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select a role' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='developer'>Developer</SelectItem>
                                <SelectItem value='designer'>Designer</SelectItem>
                                <SelectItem value='manager'>Manager</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </FormField>

                {/* Autocomplete combobox */}
                <FormField
                    name='status'
                    label='Status'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { onChange: (value: unknown) => void; value: unknown } }) => (
                        <Popover>
                            <PopoverTrigger asChild={true}>
                                <Button
                                    variant='outline'
                                    role='combobox'
                                    className='w-[200px] justify-between'
                                >
                                    {/* MOSTRAMOS LO QUE HAY EN field.value */}
                                    {typeof field.value === 'string' && field.value
                                        ? statuses.find((s) => s.value === field.value)?.label
                                        : 'Select Status...'}
                                    <ChevronsUpDown className='opacity-50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                    <CommandInput placeholder='Search Status...' />
                                    <CommandList>
                                        <CommandEmpty>No status found.</CommandEmpty>
                                        <CommandGroup>
                                            {statuses.map((status) => (
                                                <CommandItem
                                                    key={status.value}
                                                    value={status.value}
                                                    onSelect={(currentValue) => {
                                                        const newValue =
                                                            currentValue === field.value ? '' : currentValue;
                                                        field.onChange(newValue);
                                                    }}
                                                >
                                                    {status.label}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            field.value === status.value ? 'opacity-100' : 'opacity-0'
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )}
                </FormField>

                {/* Date Picker Input */}
                <FormField
                    name='startDate'
                    label='Start Date'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { onChange: (value: unknown) => void; value: unknown } }) => (
                        <Popover>
                            <PopoverTrigger asChild={true}>
                                <Button
                                    variant='outline'
                                    className={cn(
                                        'w-[280px] justify-start text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {field.value && field.value instanceof Date ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <Calendar
                                    mode='single'
                                    selected={field.value instanceof Date ? field.value : undefined}
                                    onSelect={(date) => date && field.onChange(date)}
                                    initialFocus={true}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                </FormField>

                {/* Checkbox */}
                <FormField
                    name='newsletter'
                    label='Newsletter'
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
                    {({ field }: { field: { onChange: (value: unknown) => void; value: unknown } }) => (
                        <RadioGroup
                            onValueChange={(value) => field.onChange(value as string)}
                            value={field.value as string}
                        >
                            {['beginner', 'intermediate', 'expert'].map((value) => (
                                <div
                                    key={value}
                                    className='flex items-center space-x-2'
                                >
                                    <RadioGroupItem
                                        value={value}
                                        id={`shadcn-${value}`}
                                        checked={field.value === value}
                                    />
                                    <Label htmlFor={`shadcn-${value}`}>{value}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </FormField>

                {/* Toggle Group */}
                <FormField
                    name='frameworks'
                    label='Frameworks'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { onChange: (value: unknown) => void; value: unknown } }) => (
                        <ToggleGroup
                            type='multiple'
                            value={field.value as string[]}
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
                    <div>
                        <div className='flex items-center space-x-2'>
                            <Switch id='shadcn-dark-mode' />
                            <Label htmlFor='shadcn-dark-mode'>Enable Dark Mode</Label>
                        </div>
                    </div>
                </FormField>

                <FormButtonsBar />
            </FormProvider>
        </div>
    );
}
