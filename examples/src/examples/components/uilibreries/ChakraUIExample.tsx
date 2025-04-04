import {
    Box,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    List,
    ListItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Switch,
    Textarea,
    useDisclosure
} from '@chakra-ui/react';
import { FormButtonsBar, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useEffect, useState } from 'react';
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
    darkMode: z.boolean().optional()
});

interface ChakraUIExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function ChakraUIExample({ setResult }: ChakraUIExampleProps) {
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
                uiLibrary={{ enabled: true, name: 'chakra-ui' }}
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
                    <Textarea
                        placeholder='Tell us about yourself'
                        size='md'
                    />
                </FormField>

                {/* Select */}
                <FormField
                    name='role'
                    label='Role'
                    required={true}
                >
                    <Select placeholder='Select a role'>
                        <option value='developer'>Developer</option>
                        <option value='designer'>Designer</option>
                        <option value='manager'>Manager</option>
                    </Select>
                </FormField>

                {/* Checkbox */}
                <FormField
                    name='newsletter'
                    label='Subscribe to newsletter'
                >
                    <Checkbox>Subscribe to newsletter</Checkbox>
                </FormField>

                {/* Autocomplete */}
                <FormField
                    name='programmingLanguage'
                    label='Programming Language'
                >
                    {({ field }) => {
                        const [inputValue, setInputValue] = useState('');
                        const [filteredOptions, setFilteredOptions] = useState(programmingLanguages);
                        const { isOpen, onOpen, onClose } = useDisclosure();

                        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setInputValue(value);

                            if (value) {
                                setFilteredOptions(
                                    programmingLanguages.filter((lang) =>
                                        lang.label.toLowerCase().includes(value.toLowerCase())
                                    )
                                );
                                onOpen();
                            } else {
                                setFilteredOptions(programmingLanguages);
                                onClose();
                            }
                        };

                        const handleSelect = (option: { value: string; label: string }) => {
                            field.onChange(option.value);
                            setInputValue(option.label);
                            onClose();
                        };

                        // Find the label for the current value
                        useEffect(() => {
                            if (field.value) {
                                const option = programmingLanguages.find((lang) => lang.value === field.value);
                                if (option) {
                                    setInputValue(option.label);
                                }
                            }
                        }, [field.value]);

                        return (
                            <Box position='relative'>
                                <InputGroup>
                                    <Input
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onFocus={onOpen}
                                        onBlur={() => {
                                            // Delay closing to allow for selection
                                            setTimeout(onClose, 200);
                                        }}
                                        placeholder='Select a language'
                                    />
                                    {inputValue && (
                                        <InputRightElement>
                                            <Box
                                                cursor='pointer'
                                                onClick={() => {
                                                    setInputValue('');
                                                    field.onChange('');
                                                }}
                                            >
                                                ✕
                                            </Box>
                                        </InputRightElement>
                                    )}
                                </InputGroup>
                                {isOpen && filteredOptions.length > 0 && (
                                    <List
                                        position='absolute'
                                        zIndex={10}
                                        width='100%'
                                        bg='white'
                                        boxShadow='md'
                                        borderRadius='md'
                                        mt={1}
                                        maxH='200px'
                                        overflowY='auto'
                                    >
                                        {filteredOptions.map((option) => (
                                            <ListItem
                                                key={option.value}
                                                px={4}
                                                py={2}
                                                cursor='pointer'
                                                _hover={{ bg: 'gray.100' }}
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option.label}
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        );
                    }}
                </FormField>

                {/* Radio Group */}
                <FormField
                    name='experience'
                    label='Experience Level'
                >
                    <RadioGroup defaultValue='beginner'>
                        <Stack
                            direction='row'
                            spacing={4}
                        >
                            <FormControl>
                                <Radio value='beginner'>Beginner</Radio>
                            </FormControl>
                            <FormControl>
                                <Radio value='intermediate'>Intermediate</Radio>
                            </FormControl>
                            <FormControl>
                                <Radio value='expert'>Expert</Radio>
                            </FormControl>
                        </Stack>
                    </RadioGroup>
                </FormField>

                {/* Switch */}
                <FormField
                    name='darkMode'
                    label='Dark Mode'
                >
                    <FormControl
                        display='flex'
                        alignItems='center'
                    >
                        <Switch id='chakra-dark-mode' />
                        <FormLabel
                            htmlFor='chakra-dark-mode'
                            mb='0'
                            ml='2'
                        >
                            Enable Dark Mode
                        </FormLabel>
                    </FormControl>
                </FormField>

                <FormButtonsBar />
            </FormProvider>
        </div>
    );
}
