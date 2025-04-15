import { ConditionalField, FormButtonsBar, FormDescription, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const shippingFormSchema = z
    .object({
        shippingType: z.enum(['pickup', 'delivery']),
        // Conditional fields
        storeLocation: z.string().optional(),
        address: z.string().optional(),
        contactPhone: z.string().min(10, 'Please enter a valid phone number')
    })
    .superRefine((data, ctx) => {
        if (data.shippingType === 'pickup' && !data.storeLocation) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['storeLocation'],
                message: 'Please select a store location'
            });
        }
        if (data.shippingType === 'delivery' && !data.address) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['address'],
                message: 'Please enter a delivery address'
            });
        }
    });

// Infer the type from the schema
type ShippingFormValues = z.infer<typeof shippingFormSchema>;

// Default values
const defaultValues: Partial<ShippingFormValues> = {
    shippingType: 'pickup',
    storeLocation: '',
    address: '',
    contactPhone: ''
};

interface ConditionalFieldsExampleProps {
    setResult: Dispatch<SetStateAction<Record<string, unknown> | null>>;
}

export function ConditionalFieldsExample({ setResult }: ConditionalFieldsExampleProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: ShippingFormValues) => {
        console.info('Form submitted:', data);
        setResult(data);
    };

    return (
        <FormProvider<ShippingFormValues>
            onSubmit={handleSubmit}
            schema={shippingFormSchema}
            defaultValues={defaultValues}
        >
            <FormDescription position='above'>{t('form.conditionalFieldDescription')}</FormDescription>
            <div className='space-y-6'>
                <FormField
                    name='shippingType'
                    label='Shipping Method'
                >
                    <select>
                        <option value='pickup'>Store Pickup</option>
                        <option value='delivery'>Home Delivery</option>
                    </select>
                </FormField>

                {/* Show store location field only when shipping type is "pickup" */}
                <ConditionalField
                    watchField='shippingType'
                    condition='pickup'
                >
                    <FormField
                        name='storeLocation'
                        label='Store Location'
                    >
                        <select>
                            <option value=''>Select a store</option>
                            <option value='downtown'>Downtown Store</option>
                            <option value='uptown'>Uptown Store</option>
                        </select>
                    </FormField>
                </ConditionalField>

                {/* Show address field only when shipping type is "delivery" */}
                <ConditionalField
                    watchField='shippingType'
                    condition='delivery'
                >
                    <FormField
                        name='address'
                        label='Delivery Address'
                    >
                        <textarea rows={3} />
                    </FormField>
                </ConditionalField>
                {/* Always visible field */}
                <FormField
                    name='contactPhone'
                    label='Contact Phone Number'
                    required={true}
                >
                    <input
                        type='tel'
                        placeholder='(123) 456-7890'
                    />
                </FormField>
                <FormButtonsBar
                    direction='horizontal'
                    fullWidth={false}
                    onCancel={() => console.log('Cancelled')}
                />
            </div>
        </FormProvider>
    );
}
