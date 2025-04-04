import {
    Autocomplete,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormButtonsBar, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const programmingLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
];

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    role: z.string().min(1, 'Please select a role'),
    newsletter: z.boolean(),
    programmingLanguage: z.string().optional(),
    frameworks: z.array(z.string()).optional(),
    experience: z.string().optional(),
    darkMode: z.boolean().optional(),
    startDate: z.any().optional()
});

interface MaterialUIExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function MaterialUIExample({ setResult }: MaterialUIExampleProps) {
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
                    darkMode: false,
                    startDate: null
                }}
                uiLibrary={{ enabled: true, name: 'material-ui' }}
            >
                <FormField
                    name='name'
                    label='Name'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <TextField
                        fullWidth={true}
                        placeholder='Enter your name'
                        variant='outlined'
                    />
                </FormField>

                <FormField
                    name='email'
                    label='Email'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <TextField
                        fullWidth={true}
                        type='email'
                        placeholder='Enter your email'
                        variant='outlined'
                    />
                </FormField>

                <FormField
                    name='bio'
                    label='Bio'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
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
                    name='role'
                    label='Role'
                    required={true}
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <Select
                        fullWidth={true}
                        variant='outlined'
                    >
                        <MenuItem value=''>Select a role</MenuItem>
                        <MenuItem value='developer'>Developer</MenuItem>
                        <MenuItem value='designer'>Designer</MenuItem>
                        <MenuItem value='manager'>Manager</MenuItem>
                    </Select>
                </FormField>

                <FormField
                    name='newsletter'
                    label='Subscribe to newsletter'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <FormControlLabel
                        control={<Checkbox />}
                        label='Subscribe to newsletter'
                    />
                </FormField>

                {/* Autocomplete */}
                <FormField
                    name='programmingLanguage'
                    label='Programming Language'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <Autocomplete
                        options={programmingLanguages}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder='Select a language'
                                variant='outlined'
                                fullWidth={true}
                            />
                        )}
                    />
                </FormField>

                {/* Date Picker */}
                <FormField
                    name='startDate'
                    label='Start Date'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            slotProps={{
                                textField: { fullWidth: true, variant: 'outlined' }
                            }}
                        />
                    </LocalizationProvider>
                </FormField>

                {/* Radio Group */}
                <FormField
                    name='experience'
                    label='Experience Level'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <RadioGroup row={true}>
                        <FormControlLabel
                            value='beginner'
                            control={<Radio />}
                            label='Beginner'
                        />
                        <FormControlLabel
                            value='intermediate'
                            control={<Radio />}
                            label='Intermediate'
                        />
                        <FormControlLabel
                            value='expert'
                            control={<Radio />}
                            label='Expert'
                        />
                    </RadioGroup>
                </FormField>

                {/* Toggle Button Group */}
                <FormField
                    name='frameworks'
                    label='Frameworks'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }) => (
                        <ToggleButtonGroup
                            value={field.value}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            aria-label='frameworks'
                            multiple={true}
                        >
                            <ToggleButton value='react'>React</ToggleButton>
                            <ToggleButton value='angular'>Angular</ToggleButton>
                            <ToggleButton value='vue'>Vue</ToggleButton>
                            <ToggleButton value='svelte'>Svelte</ToggleButton>
                        </ToggleButtonGroup>
                    )}
                </FormField>

                {/* Switch */}
                <FormField
                    name='darkMode'
                    label='Dark Mode'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <FormControlLabel
                        control={<Switch />}
                        label='Enable Dark Mode'
                    />
                </FormField>

                <FormButtonsBar />
            </FormProvider>
        </div>
    );
}
