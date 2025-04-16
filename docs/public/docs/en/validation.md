# Validation

**Qazuor React Form Toolkit** provides comprehensive validation capabilities through Zod integration and additional features for async validation, error display, and more.

## Schema Validation with Zod

The primary way to validate forms is through Zod schemas:

```tsx
import { z } from 'zod';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

function RegistrationForm() {
  return (
    <FormProvider schema={schema} onSubmit={handleSubmit}>
      <FormField name="username" label="Username">
        <input type="text" />
      </FormField>

      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>

      <button type="submit">Register</button>
    </FormProvider>
  );
}
```

## Validation Modes

You can control when validation occurs using the `mode` prop:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  mode="onChange" // Validate on every change
>
  {/* Form fields */}
</FormProvider>
```

Available modes:
- `onBlur`: Validate when fields are blurred (default)
- `onChange`: Validate on every change
- `onSubmit`: Validate only on form submission
- `onTouched`: Validate when fields are blurred or changed
- `all`: Validate on all events

## Async Validation

For validations that require server interaction (like checking if a username is available), use async validation:

```tsx
<FormField
  name="username"
  label="Username"
  asyncValidation={{
    asyncValidationFn: async (value) => {
      // Check if username is available
      const response = await fetch(`/api/check-username?username=${value}`);
      const data = await response.json();
      return data.available ? true : 'Username is already taken';
    },
    asyncValidationDebounce: 500, // Wait 500ms before validating
    showValidationIcons: true,
    showLoadingSpinner: true,
    textWhenValidating: 'Checking username availability...'
  }}
>
  <input type="text" />
</FormField>
```

## Error Display Configuration

You can customize how errors are displayed:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  errorDisplayOptions={{
    position: 'below', // 'below', 'above', 'right', or 'tooltip'
    animation: 'fadeIn', // 'none', 'fadeIn', 'slideIn', 'pulse', or 'shake'
    showIcon: true,
    delay: 0, // Delay in ms before showing errors
    autoDismiss: false,
    dismissAfter: 5000, // Auto dismiss after 5 seconds if autoDismiss is true
    groupErrors: false // Group all errors at form level
  }}
>
  {/* Form fields */}
</FormProvider>
```

You can also override these settings for individual fields:

```tsx
<FormField
  name="email"
  label="Email"
  errorDisplayOptions={{
    position: 'tooltip',
    animation: 'shake'
  }}
>
  <input type="email" />
</FormField>
```

## Grouped Errors

For complex forms, you can display all errors in one place:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  errorDisplayOptions={{
    groupErrors: true,
    maxErrors: 3 // Show only the first 3 errors
  }}
>
  {/* Form fields */}
</FormProvider>
```

## Global Form Errors

For errors that apply to the entire form (like API errors), use global errors:

```tsx
<FormProvider
  schema={schema}
  onSubmit={async (data) => {
    try {
      await submitToAPI(data);
    } catch (error) {
      // Return the error to display it as a global error
      return error;
    }
  }}
  globalErrorOptions={{
    position: 'top', // 'top' or 'bottom'
    animation: 'fadeIn',
    autoDismiss: true,
    dismissAfter: 5000
  }}
>
  {/* Form fields */}
</FormProvider>
```

## Complex Validation with Zod Refinements

For validation that depends on multiple fields, use Zod refinements:

```tsx
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"] // Path determines which field shows the error
});
```

## Conditional Validation

For fields that are conditionally required:

```tsx
const schema = z.object({
  shippingMethod: z.enum(['standard', 'express']),
  expressAddress: z.string().optional()
}).refine(data => {
  if (data.shippingMethod === 'express' && !data.expressAddress) {
    return false;
  }
  return true;
}, {
  message: "Express address is required for express shipping",
  path: ["expressAddress"]
});
```

## Field Array Validation

For validating arrays of fields:

```tsx
const schema = z.object({
  contacts: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email")
    })
  ).min(1, "At least one contact is required")
});
```

## Validation Hooks

For custom validation logic, you can use the `useFieldState` hook:

```tsx
import { useFieldState } from '@qazuor/react-form-toolkit';

function CustomField() {
  const { error, isTouched, isDirty, hasError } = useFieldState('email');

  return (
    <div>
      <input
        type="email"
        className={hasError ? 'border-red-500' : 'border-gray-300'}
      />
      {hasError && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

## Best Practices

1. **Schema Definition**
   - Define your schema outside the component to prevent unnecessary re-renders
   - Use descriptive error messages in your schema
   - Group related fields in nested objects

2. **Validation Timing**
   - Use `mode="onBlur"` for better user experience (default)
   - Use `mode="onChange"` for immediate feedback on critical fields
   - Consider performance implications of frequent validation

3. **Async Validation**
   - Always use debouncing for async validation to prevent excessive API calls
   - Provide clear loading states and error messages
   - Handle network errors gracefully

4. **Error Display**
   - Choose error positions that don't disrupt the form layout
   - Use animations sparingly to avoid distracting users
   - Ensure error messages are clear and actionable

5. **Accessibility**
   - Ensure error messages are announced to screen readers
   - Use appropriate ARIA attributes
   - Provide sufficient color contrast for error states

## Related Components

- [FormProvider](/docs/form-provider) - For form-level validation configuration
- [FormField](/docs/form-field) - For field-level validation
- [ConditionalField](/docs/conditional-field) - For conditional validation
- [DependantField](/docs/dependant-field) - For dependent field validation

## Examples

Check out the [validation examples](/examples/validation) to see these features in action.
