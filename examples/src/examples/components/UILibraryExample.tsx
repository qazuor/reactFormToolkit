import { Input } from '@/components/ui/input';
import {
    Checkbox as ChakraCheckbox,
    Input as ChakraInput,
    Select as ChakraSelect,
    Textarea as ChakraTextarea
} from '@chakra-ui/react';
import { FormControlLabel, MenuItem, Checkbox as MuiCheckbox, Select as MuiSelect, TextField } from '@mui/material';
import { FormButtonsBar, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    // Shadcn/UI Form
    shadcn: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        bio: z.string().min(10, 'Bio must be at least 10 characters'),
        role: z.string().min(1, 'Please select a role'),
        newsletter: z.boolean()
    }),

    // MUI Form
    mui: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        bio: z.string().min(10, 'Bio must be at least 10 characters'),
        role: z.string().min(1, 'Please select a role'),
        newsletter: z.boolean()
    }),

    // Chakra UI Form
    chakra: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        bio: z.string().min(10, 'Bio must be at least 10 characters'),
        role: z.string().min(1, 'Please select a role'),
        newsletter: z.boolean()
    })
});

interface UILibraryExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function UILibraryExample({ setResult }: UILibraryExampleProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            defaultValues={{
                shadcn: {
                    name: '',
                    email: '',
                    bio: '',
                    role: '',
                    newsletter: false
                },
                mui: {
                    name: '',
                    email: '',
                    bio: '',
                    role: '',
                    newsletter: false
                },
                chakra: {
                    name: '',
                    email: '',
                    bio: '',
                    role: '',
                    newsletter: false
                }
            }}
        >
            <div className='space-y-12'>
                {/* Shadcn/UI Form */}
                <div className='rounded-lg border bg-card p-6'>
                    <h2 className='mb-6 text-2xl font-bold'>Shadcn/UI Form</h2>
                    <div className='space-y-4'>
                        <FormField
                            name='shadcn.name'
                            label='Name'
                            required={true}
                        >
                            <Input placeholder='Enter your name' />
                        </FormField>

                        <FormField
                            name='shadcn.email'
                            label='Email'
                            required={true}
                        >
                            <Input
                                type='email'
                                placeholder='Enter your email'
                            />
                        </FormField>

                        <FormField
                            name='shadcn.bio'
                            label='Bio'
                            required={true}
                        >
                            <textarea
                                className='h-32 w-full rounded-md border px-3 py-2'
                                placeholder='Tell us about yourself'
                            />
                        </FormField>

                        <FormField
                            name='shadcn.role'
                            label='Role'
                            required={true}
                        >
                            <select className='w-full rounded-md border px-3 py-2'>
                                <option value=''>Select a role</option>
                                <option value='developer'>Developer</option>
                                <option value='designer'>Designer</option>
                                <option value='manager'>Manager</option>
                            </select>
                        </FormField>

                        <FormField
                            name='shadcn.newsletter'
                            label='Subscribe to newsletter'
                        >
                            <input
                                type='checkbox'
                                className='h-4 w-4 rounded border-gray-300'
                            />
                        </FormField>
                    </div>
                </div>

                {/* Material-UI Form */}
                <div className='rounded-lg border bg-card p-6'>
                    <h2 className='mb-6 text-2xl font-bold'>Material-UI Form</h2>
                    <div className='space-y-4'>
                        <FormField
                            name='mui.name'
                            label='Name'
                            required={true}
                        >
                            <TextField
                                fullWidth={true}
                                placeholder='Enter your name'
                                variant='outlined'
                            />
                        </FormField>

                        <FormField
                            name='mui.email'
                            label='Email'
                            required={true}
                        >
                            <TextField
                                fullWidth={true}
                                type='email'
                                placeholder='Enter your email'
                                variant='outlined'
                            />
                        </FormField>

                        <FormField
                            name='mui.bio'
                            label='Bio'
                            required={true}
                        >
                            <TextField
                                fullWidth={true}
                                multiline={true}
                                rows={4}
                                placeholder='Tell us about yourself'
                                variant='outlined'
                            />
                        </FormField>

                        <FormField
                            name='mui.role'
                            label='Role'
                            required={true}
                        >
                            <MuiSelect
                                fullWidth={true}
                                variant='outlined'
                            >
                                <MenuItem value=''>Select a role</MenuItem>
                                <MenuItem value='developer'>Developer</MenuItem>
                                <MenuItem value='designer'>Designer</MenuItem>
                                <MenuItem value='manager'>Manager</MenuItem>
                            </MuiSelect>
                        </FormField>

                        <FormField
                            name='mui.newsletter'
                            label='Subscribe to newsletter'
                        >
                            <FormControlLabel
                                control={<MuiCheckbox />}
                                label='Subscribe to newsletter'
                            />
                        </FormField>
                    </div>
                </div>

                {/* Chakra UI Form */}
                <div className='rounded-lg border bg-card p-6'>
                    <h2 className='mb-6 text-2xl font-bold'>Chakra UI Form</h2>
                    <div className='space-y-4'>
                        <FormField
                            name='chakra.name'
                            label='Name'
                            required={true}
                        >
                            <ChakraInput placeholder='Enter your name' />
                        </FormField>

                        <FormField
                            name='chakra.email'
                            label='Email'
                            required={true}
                        >
                            <ChakraInput
                                type='email'
                                placeholder='Enter your email'
                            />
                        </FormField>

                        <FormField
                            name='chakra.bio'
                            label='Bio'
                            required={true}
                        >
                            <ChakraTextarea
                                placeholder='Tell us about yourself'
                                size='md'
                            />
                        </FormField>

                        <FormField
                            name='chakra.role'
                            label='Role'
                            required={true}
                        >
                            <ChakraSelect placeholder='Select a role'>
                                <option value='developer'>Developer</option>
                                <option value='designer'>Designer</option>
                                <option value='manager'>Manager</option>
                            </ChakraSelect>
                        </FormField>

                        <FormField
                            name='chakra.newsletter'
                            label='Subscribe to newsletter'
                        >
                            <ChakraCheckbox>Subscribe to newsletter</ChakraCheckbox>
                        </FormField>
                    </div>
                </div>

                <FormButtonsBar />
            </div>
        </FormProvider>
    );
}
