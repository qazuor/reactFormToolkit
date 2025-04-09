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
import { useState } from 'react';
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
}

const statuses: Status[] = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'Todo' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'canceled', label: 'Canceled' }
];

export function ShadcnUIExample({ setResult }: ShadcnUIExampleProps) {
    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

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
                    {({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                    <Popover
                        open={open}
                        onOpenChange={setOpen}
                    >
                        <PopoverTrigger asChild={true}>
                            <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={open}
                                className='w-[200px] justify-between'
                            >
                                {value ? statuses.find((status) => status.value === value)?.label : 'Select Status...'}
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
                                                    setValue(currentValue === value ? '' : currentValue);
                                                    setOpen(false);
                                                }}
                                            >
                                                {status.label}
                                                <Check
                                                    className={cn(
                                                        'ml-auto',
                                                        value === status.value ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </FormField>

                {/* Date Picker Input */}
                <FormField
                    name='startDate'
                    label='Start Date'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <Popover>
                        <PopoverTrigger asChild={true}>
                            <Button
                                variant='outline'
                                className={cn(
                                    'w-[280px] justify-start text-left font-normal',
                                    !date && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                            <Calendar
                                mode='single'
                                selected={date}
                                onSelect={setDate}
                                initialFocus={true}
                            />
                        </PopoverContent>
                    </Popover>
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
                    {({ field }) => (
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
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
