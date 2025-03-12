# Advanced Usage

This document covers more advanced use cases for React Form Toolkit, including custom styling, input types, advanced validation, and more.

## Custom Styling

You can easily customize the styles of your form components:

<details>
<summary>Complete Style Customization</summary>

```tsx
import { FormProvider, FormField } from 'react-form-toolkit';

// Custom styles
const customStyles = {
  form: 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-md',
  field: {
    wrapper: 'mb-4',
    label: 'block text-gray-700 text-sm font-bold mb-2',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    error: 'text-red-500 text-xs mt-1',
    description: 'text-gray-500 text-xs mt-1',
    requiredMark: 'text-red-500 ml-1',
  }
};

function StyledForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
      styles={customStyles}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

</details>

## Different Input Types

React Form Toolkit supports various input types:

```tsx
// Text input
<FormField name="name" label="Name">
  <input type="text" />
</FormField>

// Email input
<FormField name="email" label="Email">
  <input type="email" />
</FormField>

// Password input
<FormField name="password" label="Password">
  <input type="password" />
</FormField>

// Textarea
<FormField name="message" label="Message">
  <textarea rows={4} />
</FormField>

// Select
<FormField name="country" label="Country">
  <select>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="uk">United Kingdom</option>
  </select>
</FormField>

// Checkbox
<FormField name="agreeToTerms" label="I agree to the terms">
  <input type="checkbox" />
</FormField>
```

## Using External Form Instance

You can use an external form instance from React Hook Form:

<details>
<summary>Usage with External Instance</summary>

```tsx
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-form-toolkit';

function ExternalFormExample() {
  const form = useForm({
    defaultValues: { name: '', email: '' }
  });

  // Access form methods outside the FormProvider
  const resetForm = () => form.reset();

  return (
    <>
      <button type="button" onClick={resetForm}>Reset Form</button>

      <FormProvider
        form={form}
        onSubmit={handleSubmit}
      >
        {/* Form fields */}
      </FormProvider>
    </>
  );
}
```

</details>

## Form Context

Use the `useFormContext` hook to access form context within child components:

```tsx
import { useFormContext } from 'react-form-toolkit';

function FormButton() {
  const { form } = useFormContext();

  return (
    <button
      type="button"
      onClick={() => form.reset()}
    >
      Reset
    </button>
  );
}
```

## Advanced Validation

<details>
<summary>Custom Validation</summary>

```tsx
import { z } from 'zod';
import { FormProvider, FormField } from 'react-form-toolkit';

// Custom validation with Zod
const advancedSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .refine(value => /^[a-z0-9_]+$/.test(value), {
      message: 'Username can only contain lowercase letters, numbers, and underscores'
    }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(value => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter'
    })
    .refine(value => /[0-9]/.test(value), {
      message: 'Password must contain at least one number'
    }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Additional validation rules for FormField
<FormField
  name="username"
  label="Username"
  rules={{
    validate: {
      notAdmin: value => value !== 'admin' || 'This username is not available',
      checkAvailability: async value => {
        // Simulated async validation
        await new Promise(resolve => setTimeout(resolve, 500));
        return value !== 'takenUsername' || 'This username is already taken';
      }
    }
  }}
>
  <input type="text" />
</FormField>
```

</details>

## Integration with Component Libraries

<details>
<summary>Integration with Shadcn/UI</summary>

```tsx
import { FormProvider, FormField } from 'react-form-toolkit';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function ShadcnForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
    >
      <FormField name="name" label="Name">
        <Input />
      </FormField>

      <FormField name="message" label="Message">
        <Textarea />
      </FormField>

      <FormField name="country" label="Country">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <Button type="submit">Submit</Button>
    </FormProvider>
  );
}
```

</details>

## Dynamic Forms

<details>
<summary>Conditional Fields</summary>

```tsx
import { useState } from 'react';
import { FormProvider, FormField } from 'react-form-toolkit';

function ConditionalForm() {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
    >
      <FormField name="accountType" label="Account Type">
        <select onChange={(e) => setShowAdditionalFields(e.target.value === 'business')}>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
      </FormField>

      {showAdditionalFields && (
        <>
          <FormField name="companyName" label="Company Name">
            <input type="text" />
          </FormField>

          <FormField name="taxId" label="Tax ID">
            <input type="text" />
          </FormField>
        </>
      )}

      <button type="submit">Register</button>
    </FormProvider>
  );
}
```

</details>

## Performance

For very large or complex forms, you can optimize performance:

<details>
<summary>Performance Optimizations</summary>

```tsx
import { memo } from 'react';
import { FormProvider, FormField } from 'react-form-toolkit';

// Memoize field components to prevent unnecessary re-renders
const MemoizedField = memo(({ name, label, type }) => (
  <FormField name={name} label={label}>
    <input type={type} />
  </FormField>
));

function LargeForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
      mode="onBlur" // Change validation mode to improve performance
    >
      {/* Many form fields */}
      {Array.from({ length: 20 }).map((_, index) => (
        <MemoizedField
          key={index}
          name={`field${index}`}
          label={`Field ${index}`}
          type="text"
        />
      ))}

      <button type="submit">Submit</button>
    </FormProvider>
  );
}
```

</details>

## See Also

- [Internationalization](./i18n.md) - Learn how to set up your form in multiple languages
- [API Reference](./api-reference.md) - For complete documentation of all components and options
