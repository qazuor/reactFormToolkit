# Form Description

The `FormDescription` component is used to add descriptive text to forms. It can be positioned above or below the form fields.

## Basic Usage

```tsx
import { FormDescription, FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function LoginForm() {
  return (
    <FormProvider schema={schema} onSubmit={handleSubmit}>
      <FormDescription position="above">
        Please enter your login credentials.
      </FormDescription>

      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>

      <button type="submit">Login</button>
    </FormProvider>
  );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Description content |
| `position` | `'above' \| 'below'` | Position relative to form |
| `className` | `string` | Custom CSS classes |
| `id` | `string` | Custom element ID |

## Features

### Positioning

You can position the description above or below the form:

```tsx
// Above the form (default)
<FormDescription position="above">
  Please fill out all required fields.
</FormDescription>

// Below the form
<FormDescription position="below">
  By submitting this form, you agree to our terms and conditions.
</FormDescription>
```

### Custom Styling

You can apply custom styles to the description:

```tsx
<FormDescription
  className="bg-blue-50 p-4 rounded-lg text-blue-800 border border-blue-200"
  position="above"
>
  <strong>Note:</strong> All fields marked with an asterisk (*) are required.
</FormDescription>
```

### Rich Content

The description can contain rich content, not just text:

```tsx
<FormDescription position="above">
  <div className="flex items-center space-x-2">
    <InfoIcon className="text-blue-500" />
    <span>Please complete the form below to register.</span>
  </div>
  <ul className="list-disc pl-5 mt-2">
    <li>All fields are required</li>
    <li>Password must be at least 8 characters</li>
    <li>Email must be valid</li>
  </ul>
</FormDescription>
```

### Accessibility

The component includes proper accessibility attributes:

```tsx
<FormDescription
  id="login-form-description"
  role="region"
  aria-label="Form instructions"
>
  Please enter your login credentials.
</FormDescription>
```

## Best Practices

1. **Keep descriptions concise**
   - Use clear, simple language
   - Focus on the most important information

2. **Use appropriate positioning**
   - Place general instructions above the form
   - Place terms and conditions or submission notes below the form

3. **Enhance with visual elements**
   - Use icons to draw attention to important information
   - Use color and formatting to improve readability

4. **Ensure accessibility**
   - Provide sufficient color contrast
   - Don't rely solely on color to convey information

## Related Components

- [FormProvider](./form-provider.md) - The parent component for all form elements
- [FormField](./form-field.md) - For rendering individual form fields with their own descriptions

## Examples

### Form with Instructions

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormDescription position="above">
    <h3 className="text-lg font-semibold mb-2">Registration Instructions</h3>
    <p className="mb-2">Please fill out the form below to create your account.</p>
    <ul className="list-disc pl-5">
      <li>Use a strong password with at least 8 characters</li>
      <li>Provide a valid email address for verification</li>
      <li>Your username must be unique</li>
    </ul>
  </FormDescription>

  {/* Form fields */}

  <FormDescription position="below">
    By clicking "Register", you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
  </FormDescription>

  <button type="submit">Register</button>
</FormProvider>
```

### Alert-Style Description

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormDescription
    position="above"
    className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800"
  >
    <div className="flex">
      <WarningIcon className="h-5 w-5 mr-2" />
      <div>
        <p className="font-medium">Important</p>
        <p>This action cannot be undone. Please review your information carefully before submitting.</p>
      </div>
    </div>
  </FormDescription>

  {/* Form fields */}
</FormProvider>
```
