# API Reference

This page provides a complete reference for all components, properties, and types available in React Form Toolkit.

## FormProvider

The main component that provides form context to all child components.

### Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `children` | `ReactNode` | Form fields and other components | Yes |
| `onSubmit` | `SubmitHandler<TFieldValues>` | Function called when the form is submitted | Yes |
| `schema` | `ZodType<TFieldValues>` | Zod schema for form validation | No |
| `defaultValues` | `DefaultValues<TFieldValues>` | Default values for form fields | No |
| `className` | `string` | CSS class for the form element | No |
| `form` | `UseFormReturn<TFieldValues>` | External form instance from React Hook Form | No |
| `resetOnSubmit` | `boolean` | Whether to reset the form after submission | No |
| `styles` | `FormStyles` | Custom styles for form elements | No |
| `i18n` | `I18nOptions` | Internationalization options (language, custom translations) | No |
| `mode` | `"onSubmit" \| "onChange" \| "onBlur" \| "onTouched" \| "all"` | Validation mode | No |

### Example

```tsx
<FormProvider
  onSubmit={handleSubmit}
  schema={formSchema}
  defaultValues={{ name: '', email: '' }}
  mode="onChange"
  resetOnSubmit={true}
  className="max-w-md mx-auto"
>
  {/* Form fields */}
</FormProvider>
```

## FormField

Component for rendering form fields with labels, validation, and error messages.

### Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `name` | `string` | Field name (must match schema) | Yes |
| `label` | `string` | Label text for the field | No |
| `description` | `string` | Description text displayed below the field | No |
| `children` | `ReactNode` | Input element (input, select, textarea, etc.) | Yes |
| `className` | `string` | CSS class for the field wrapper | No |
| `labelClassName` | `string` | CSS class for the label | No |
| `descriptionClassName` | `string` | CSS class for the description | No |
| `errorClassName` | `string` | CSS class for error messages | No |
| `required` | `boolean` | Whether the field is required | No |
| `rules` | `Record<string, unknown>` | Additional validation rules | No |

### Example

```tsx
<FormField
  name="email"
  label="Email"
  description="We'll use this email to contact you"
  required
  className="mb-4"
  labelClassName="font-bold"
  descriptionClassName="text-sm text-gray-500"
  errorClassName="text-red-500 text-xs"
>
  <input type="email" />
</FormField>
```

## useFormContext

Hook for accessing form context within child components.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `form` | `UseFormReturn<TFieldValues>` | Form instance from React Hook Form |
| `styles` | `FormStyles` | Styles configured for the form |
| `i18n` | `i18n` | Configured i18n instance |

### Example

```tsx
import { useFormContext } from 'react-form-toolkit';

function FormActions() {
  const { form } = useFormContext();

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="flex gap-2">
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </div>
  );
}
```

## Types

### FormStyles

```typescript
interface FormStyles {
  form?: string;
  field?: {
    wrapper?: string;
    label?: string;
    input?: string;
    error?: string;
    description?: string;
    requiredMark?: string;
  };
}
```

### I18nOptions

```typescript
interface I18nOptions {
  lng?: string;
  resources?: Resource;
  i18n?: i18n;
}
```

## Data Models

<details>
<summary>Complete Zod Schema Example</summary>

```typescript
import { z } from 'zod';

const userSchema = z.object({
  // Personal fields
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),

  // Address
  address: z.object({
    street: z.string().min(5, 'Please enter a valid address'),
    city: z.string(),
    state: z.string(),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code')
  }),

  // Preferences
  preferences: z.object({
    newsletter: z.boolean().default(false),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.array(z.enum(['email', 'sms', 'push'])).default([])
  })
});

type UserFormData = z.infer<typeof userSchema>;
```

</details>

## Modifying Default Behavior

You can customize the default behavior of React Form Toolkit:

<details>
<summary>Global Configuration</summary>

```tsx
import { ConfigProvider } from 'react-form-toolkit';

function App() {
  return (
    <ConfigProvider
      defaultStyles={{
        form: 'max-w-md mx-auto p-4',
        field: {
          wrapper: 'mb-4',
          label: 'font-bold mb-1',
          input: 'border p-2 w-full rounded',
          error: 'text-red-500 text-xs mt-1'
        }
      }}
      defaultI18n={{
        lng: 'en',
        resources: customTranslations
      }}
    >
      <YourApp />
    </ConfigProvider>
  );
}
```

</details>

## Tool Integration

### TypeScript

React Form Toolkit is written in TypeScript and provides complete types for all its APIs.

### React Hook Form

React Form Toolkit is built on top of React Hook Form, so all methods and configurations from React Hook Form are available:

```tsx
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-form-toolkit';

function AdvancedForm() {
  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldUnregister: false,
    // ...other React Hook Form options
  });

  return (
    <FormProvider
      form={form}
      onSubmit={handleSubmit}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

### Zod

React Form Toolkit uses Zod for schema validation:

```tsx
import { z } from 'zod';

// Advanced Zod schema definitions
const schema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      quantity: z.number().int().positive()
    })
  ).min(1, 'You must add at least one item'),

  // Conditional validations
  paymentMethod: z.enum(['credit', 'debit', 'paypal']),
  creditCardNumber: z.string().optional()
    .refine(
      (val, ctx) => {
        if (ctx.parent.paymentMethod === 'credit' && !val) {
          return false;
        }
        return true;
      },
      'Credit card number is required'
    )
});
```
