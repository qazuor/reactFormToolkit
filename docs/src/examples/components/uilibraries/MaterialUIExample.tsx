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
    ThemeProvider,
    ToggleButton,
    ToggleButtonGroup,
    createTheme
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormButtonsBar, FormField, FormProvider } from '@qazuor/react-form-toolkit';
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
    darkMode: z.boolean().optional(),
    startDate: z.any().optional()
});

interface MaterialUIExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
    currentTheme?: string;
}

export function MaterialUIExample({ setResult, currentTheme }: MaterialUIExampleProps) {
    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    // Get the current theme from the documentation site
    // Use the passed currentTheme prop instead of directly accessing the theme
    const themeToUse = currentTheme || 'light';

    const variant = 'filled'; // Change this to 'outlined' or 'standard' as needed

    // Create a Material UI theme that matches the site theme
    const muiTheme = createTheme({
        palette: {
            mode: themeToUse === 'dark' ? 'dark' : 'light',
            primary: {
                main: themeToUse === 'dark' ? '#4493f8' : '#0969da'
            },
            secondary: {
                main: themeToUse === 'dark' ? '#8957e5' : '#6639ba'
            },
            background: {
                default: themeToUse === 'dark' ? '#0d1117' : '#ffffff',
                paper: themeToUse === 'dark' ? '#151b23' : '#f6f8fa'
            },
            text: {
                primary: themeToUse === 'dark' ? '#f0f6fc' : '#1f2328',
                secondary: themeToUse === 'dark' ? '#9198a1' : '#59636e'
            }
        }
    });

    return (
        <ThemeProvider theme={muiTheme}>
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
                            variant={variant}
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
                            variant={variant}
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
                            variant={variant}
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
                            variant={variant}
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
                        label='Programming language'
                        required={true}
                        styleOptions={{ wrapper: 'mb-4 pb-4' }}
                    >
                        {({ field }: { field: { value: unknown; onChange: (value: unknown) => void } }) => (
                            <Autocomplete
                                options={['JavaScript', 'Python', 'C#', 'Java', 'Go']}
                                value={(field.value as string) || ''}
                                onChange={(_event, newValue) => {
                                    field.onChange(newValue ?? '');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Programming language'
                                        variant={variant}
                                    />
                                )}
                            />
                        )}
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
                                    textField: { fullWidth: true, variant: variant }
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
                        {({
                            field
                        }: { field: { value: unknown; onChange: (value: unknown) => void; onBlur: () => void } }) => (
                            <ToggleButtonGroup
                                value={Array.isArray(field.value) ? (field.value as string[]) : []}
                                onChange={(_, newValue) => field.onChange(newValue)}
                                aria-label='frameworks'
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
        </ThemeProvider>
    );
}
