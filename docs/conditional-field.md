# Conditional Fields

The Conditional Fields feature allows you to dynamically show or hide form fields based on the value of another field. This is useful for creating dynamic forms where certain fields should only appear under specific conditions.

## Basic Usage

### Single Conditional Field

Use `ConditionalField` when you need to show/hide a single field or group of fields based on a condition:

```tsx
import { ConditionalField, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
    shippingType: z.enum(['pickup', 'delivery']),
    storeLocation: z.string().optional(),
    address: z.string().optional()
});

function ShippingForm() {
    return (
        <FormProvider schema={schema}>
            <FormField name="shippingType">
                <select>
                    <option value="pickup">Store Pickup</option>
                    <option value="delivery">Home Delivery</option>
                </select>
            </FormField>

            <ConditionalField
                watchField="shippingType"
                condition="pickup"
            >
                <FormField name="storeLocation">
                    <select>
                        <option value="">Select a store</option>
                        <option value="downtown">Downtown Store</option>
                        <option value="uptown">Uptown Store</option>
                    </select>
                </FormField>
            </ConditionalField>

            <ConditionalField
                watchField="shippingType"
                condition="delivery"
            >
                <FormField name="address">
                    <textarea />
                </FormField>
            </ConditionalField>
        </FormProvider>
    );
}
```

### Multiple Conditional Fields

Use `ConditionalFieldGroup` when you need to switch between different sets of fields:

```tsx
import { ConditionalFieldGroup, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
    accountType: z.enum(['personal', 'business']),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    taxId: z.string().optional()
});

function AccountForm() {
    return (
        <FormProvider schema={schema}>
            <FormField name="accountType">
                <select>
                    <option value="personal">Personal Account</option>
                    <option value="business">Business Account</option>
                </select>
            </FormField>

            <ConditionalFieldGroup
                watchField="accountType"
                conditions={{
                    personal: (
                        <>
                            <FormField name="firstName">
                                <input type="text" />
                            </FormField>
                            <FormField name="lastName">
                                <input type="text" />
                            </FormField>
                        </>
                    ),
                    business: (
                        <>
                            <FormField name="companyName">
                                <input type="text" />
                            </FormField>
                            <FormField name="taxId">
                                <input type="text" />
                            </FormField>
                        </>
                    )
                }}
            />
        </FormProvider>
    );
}
```

## Props

### ConditionalField Props

| Name | Type | Description |
|------|------|-------------|
| `watchField` | `string` | Field name to watch for changes |
| `condition` | `string \| ((value: unknown) => boolean)` | Value to match or function that returns boolean |
| `children` | `ReactNode` | Content to show when condition is met |
| `fallback` | `ReactNode` | Optional content to show when condition is not met |
| `keepRegistered` | `boolean` | Keep fields registered when hidden |

### ConditionalFieldGroup Props

| Name | Type | Description |
|------|------|-------------|
| `watchField` | `string` | Field name to watch for changes |
| `conditions` | `Record<string, ReactNode>` | Map of field values to content |
| `fallback` | `ReactNode` | Content to show when no condition matches |
| `className` | `string` | Optional CSS class for wrapper |
| `keepRegistered` | `boolean` | Keep fields registered when hidden |

## Features

### Function Conditions

You can use a function for more complex conditions:

```tsx
<ConditionalField
    watchField="age"
    condition={(value) => Number(value) >= 18}
>
    <FormField name="drivingLicense">
        <input type="text" />
    </FormField>
</ConditionalField>
```

### Fallback Content

Show alternative content when conditions are not met:

```tsx
<ConditionalField
    watchField="hasAccount"
    condition="yes"
    fallback={<p>Please create an account first</p>}
>
    <FormField name="accountDetails">
        <input type="text" />
    </FormField>
</ConditionalField>
```

### Field Registration

By default, hidden fields are unregistered from the form to prevent unnecessary validation. Use `keepRegistered` to maintain field values:

```tsx
<ConditionalField
    watchField="type"
    condition="advanced"
    keepRegistered={true}
>
    <FormField name="advancedSettings">
        <input type="text" />
    </FormField>
</ConditionalField>
```

### Styling

Apply custom styles to the conditional field group wrapper:

```tsx
<ConditionalFieldGroup
    watchField="section"
    conditions={conditions}
    className="space-y-4 bg-gray-50 p-4 rounded-lg"
/>
```

## Best Practices

1. **Schema Validation**
   - Make conditional fields optional in the schema
   - Use schema refinements for complex validation rules

```tsx
const schema = z.object({
    type: z.enum(['A', 'B']),
    fieldA: z.string().optional(),
    fieldB: z.string().optional()
}).refine((data) => {
    if (data.type === 'A' && !data.fieldA) {
        return false;
    }
    return true;
}, {
    message: "Field A is required when type is A",
    path: ["fieldA"]
});
```

2. **Performance**
   - Use `keepRegistered` only when necessary
   - Group related conditional fields together
   - Avoid deep nesting of conditional fields

3. **Accessibility**
   - Provide clear labels and descriptions
   - Ensure keyboard navigation works correctly
   - Use ARIA attributes appropriately

4. **Error Handling**
   - Handle validation errors appropriately for conditional fields
   - Show clear error messages
   - Consider the UX when fields appear/disappear

## Examples

### Multi-step Form

```tsx
<ConditionalFieldGroup
    watchField="step"
    conditions={{
        personal: <PersonalInfoFields />,
        address: <AddressFields />,
        payment: <PaymentFields />
    }}
    className="space-y-6"
/>
```

### Nested Conditions

```tsx
<ConditionalField watchField="hasSubscription" condition={true}>
    <FormField name="plan">
        <select>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
        </select>
    </FormField>

    <ConditionalField watchField="plan" condition="premium">
        <FormField name="additionalFeatures">
            <input type="text" />
        </FormField>
    </ConditionalField>
</ConditionalField>
```

### Dynamic Validation

```tsx
const schema = z.object({
    contactMethod: z.enum(['email', 'phone']),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional()
}).refine((data) => {
    if (data.contactMethod === 'email' && !data.email) {
        return false;
    }
    if (data.contactMethod === 'phone' && !data.phone) {
        return false;
    }
    return true;
});

function ContactForm() {
    return (
        <FormProvider schema={schema}>
            <FormField name="contactMethod">
                <select>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                </select>
            </FormField>

            <ConditionalFieldGroup
                watchField="contactMethod"
                conditions={{
                    email: (
                        <FormField name="email">
                            <input type="email" />
                        </FormField>
                    ),
                    phone: (
                        <FormField name="phone">
                            <input type="tel" />
                        </FormField>
                    )
                }}
            />
        </FormProvider>
    );
}
```
