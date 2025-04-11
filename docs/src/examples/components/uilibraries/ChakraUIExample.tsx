import { FormButtonsBar, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

// Importes de Chakra:
import {
    Box,
    Checkbox,
    FormControl,
    FormLabel,
    Heading,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    PinInput,
    PinInputField,
    Radio,
    RadioGroup,
    Select,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Switch,
    Textarea
} from '@chakra-ui/react';

const schema = z.object({
    name: z.string().nonempty('Name is required'),
    color: z.array(z.string()).min(1), // checkbox group
    quantity: z.number().optional(), // NumberInput
    file: z.any().optional(), // file upload
    pin: z.string().optional(),
    role: z.string().optional(),
    experience: z.string().optional(),
    sliderValue: z.number().optional(),
    newsletter: z.boolean().optional(),
    comment: z.string().optional() // textarea
});

interface ChakraUIExampleProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function ChakraUIExample({ setResult }: ChakraUIExampleProps) {
    const handleSubmit = (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <Box
            maxW='600px'
            mx='auto'
            mt='6'
        >
            <Heading
                as='h2'
                size='lg'
                mb='4'
            >
                Chakra UI
            </Heading>

            <FormProvider
                schema={schema}
                onSubmit={handleSubmit}
                defaultValues={{
                    name: '',
                    color: ['green'],
                    quantity: 0,
                    file: null,
                    pin: '',
                    segmentChoice: '',
                    role: '',
                    experience: '',
                    sliderValue: 50,
                    newsletter: false,
                    comment: ''
                }}
                uiLibrary={{ enabled: true, name: 'chakra' }}
            >
                {/* Text Input */}
                <FormField
                    name='name'
                    label='Name'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                    required={true}
                >
                    <Input
                        variant='flushed'
                        placeholder='Enter your name'
                    />
                </FormField>

                {/* Checkbox */}
                <FormField
                    name='newsletter'
                    label='Newsletter'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }) => (
                        <FormControl
                            display='flex'
                            alignItems='center'
                        >
                            <FormLabel mb='0'>Subscribe to newsletter?</FormLabel>
                            <Checkbox
                                isChecked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        </FormControl>
                    )}
                </FormField>

                {/* Checkbox Group */}
                <FormField
                    name='color'
                    label='Color'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: string[]; onChange: (value: string[]) => void } }) => {
                        const handledChange = (value: string): void => {
                            const newValue = [...field.value];
                            if (field.value.includes(value)) {
                                newValue.splice(newValue.indexOf(value), 1);
                            } else {
                                newValue.push(value);
                            }
                            field.onChange(newValue);
                        };
                        return (
                            <Stack
                                spacing={5}
                                direction='row'
                            >
                                <Checkbox
                                    isChecked={field.value.includes('red')}
                                    onChange={() => handledChange('red')}
                                    colorScheme='red'
                                    defaultChecked={true}
                                >
                                    Red
                                </Checkbox>
                                <Checkbox
                                    isChecked={field.value.includes('green')}
                                    onChange={() => handledChange('green')}
                                    colorScheme='green'
                                    defaultChecked={true}
                                >
                                    Green
                                </Checkbox>
                                <Checkbox
                                    isChecked={field.value.includes('blue')}
                                    onChange={() => handledChange('blue')}
                                    colorScheme='blue'
                                    defaultChecked={true}
                                >
                                    Blue
                                </Checkbox>
                            </Stack>
                        );
                    }}
                </FormField>

                {/* NumberInput */}
                <FormField
                    name='quantity'
                    label='Quantity'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: number; onChange: (value: number) => void } }) => (
                        <NumberInput
                            variant='flushed'
                            value={field.value ?? 0}
                            onChange={(_valStr, valNum) => {
                                field.onChange(valNum);
                            }}
                            min={0}
                            max={100}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    )}
                </FormField>

                {/* File Upload */}
                <FormField
                    name='file'
                    label='Upload file'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { onChange: (value: File | null) => void } }) => (
                        <Input
                            variant='flushed'
                            type='file'
                            onChange={(e) => {
                                const fileList = e.target.files;
                                field.onChange(fileList?.[0] || null);
                            }}
                        />
                    )}
                </FormField>

                {/* PinInput */}
                <FormField
                    name='pin'
                    label='Security PIN'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                        <PinInput
                            value={field.value || ''}
                            onChange={(val) => field.onChange(val)}
                            otp={true}
                        >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    )}
                </FormField>

                {/* Select */}
                <FormField
                    name='role'
                    label='Role'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                        <Select
                            variant='flushed'
                            placeholder='Select a role'
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                        >
                            <option value='developer'>Developer</option>
                            <option value='designer'>Designer</option>
                            <option value='manager'>Manager</option>
                        </Select>
                    )}
                </FormField>

                {/* RadioGroup */}
                <FormField
                    name='experience'
                    label='Experience Level'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                        <RadioGroup
                            value={field.value || ''}
                            onChange={(val) => field.onChange(val)}
                        >
                            <Stack direction='row'>
                                <Radio value='beginner'>Beginner</Radio>
                                <Radio value='intermediate'>Intermediate</Radio>
                                <Radio value='expert'>Expert</Radio>
                            </Stack>
                        </RadioGroup>
                    )}
                </FormField>

                {/* Slider */}
                <FormField
                    name='sliderValue'
                    label='Volume'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: number; onChange: (value: number) => void } }) => (
                        <Box>
                            <Slider
                                value={field.value ?? 50}
                                onChange={(val) => field.onChange(val)}
                                min={0}
                                max={100}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Box mt={2}>Value: {field.value}</Box>
                        </Box>
                    )}
                </FormField>

                {/* Switch */}
                <FormField
                    name='toogle'
                    label='Toggled'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    {({ field }: { field: { value: boolean; onChange: (value: boolean) => void } }) => (
                        <FormControl
                            display='flex'
                            alignItems='center'
                        >
                            <FormLabel mb='0'>Toggle Me</FormLabel>
                            <Switch
                                isChecked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        </FormControl>
                    )}
                </FormField>

                {/* Textarea */}
                <FormField
                    name='comment'
                    label='Comments'
                    styleOptions={{ wrapper: 'mb-4 pb-4' }}
                >
                    <Textarea
                        variant='flushed'
                        placeholder='Write your comment...'
                    />
                </FormField>

                <FormButtonsBar />
            </FormProvider>
        </Box>
    );
}
