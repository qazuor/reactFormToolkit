# Form Provider

The `FormProvider` component is the foundation of **Qazuor React Form Toolkit**. It manages form state, validation, and provides context to child components.

## Basic Usage

```tsx
import { FormProvider } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function MyForm() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{ email: '', password: '' }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| `schema` | `z.ZodType` | Zod schema for form validation |
| `onSubmit` | `(data: T) => void \| Promise<void>` | Form submission handler |
| `defaultValues` | `DefaultValues<T>` | Initial form values |
| `mode` | `'onBlur' \| 'onChange' \| 'onSubmit' \| 'onTouched' \| 'all'` | Validation trigger mode |
| `i18n` | `I18nOptions` | Internationalization options |
| `styleOptions` | `FormProviderStyleOptions` | Style customization |
| `errorDisplayOptions` | `ErrorDisplayOptions` | Error display configuration |
| `globalErrorOptions` | `GlobalErrorOptions` | Global error configuration |
| `uiLibrary` | `UILibraryOptions` | UI library integration options |
| `form` | `UseFormReturn<T>` | External form instance |

## Features

### Schema Validation

The `schema` prop accepts a Zod schema that defines the form's structure and validation rules:

```tsx
const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18)
});
```

### Form Submission

The `onSubmit` handler receives the validated form data:

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await submitToAPI(data);
  } catch (error) {
    console.error(error);
  }
};
```

### Default Values

Set initial form values with `defaultValues`:

```tsx
<FormProvider
  defaultValues={{
    username: 'johndoe',
    email: 'john@example.com'
  }}
>
  {/* ... */}
</FormProvider>
```

### Validation Modes

Control when validation occurs:

```tsx
<FormProvider mode="onChange">
  {/* Validates on every change */}
</FormProvider>

<FormProvider mode="onBlur">
  {/* Validates when fields are blurred */}
</FormProvider>
```

### Style Customization

Customize form styling:

```tsx
<FormProvider
  styleOptions={{
    field: {
      input: 'custom-input-class',
      label: 'custom-label-class'
    },
    buttons: {
      submit: 'custom-submit-class'
    }
  }}
>
  {/* ... */}
</FormProvider>
```

### Error Display

Configure error message display:

```tsx
<FormProvider
  errorDisplayOptions={{
    position: 'below',
    animation: 'fadeIn',
    showIcon: true,
    groupErrors: false
  }}
>
  {/* ... */}
</FormProvider>
```

### Internationalization

Add i18n support:

```tsx
<FormProvider
  i18n={{
    resources: {
      es: {
        validation: {
          required: 'Este campo es requerido'
        }
      }
    },
    lng: 'es'
  }}
>
  {/* ... */}
</FormProvider>
```

### UI Library Integration

Configure the form to work with UI libraries:

```tsx
<FormProvider
  uiLibrary={{
    enabled: true,
    name: 'material-ui'
  }}
>
  {/* Form fields */}
</FormProvider>
```

When `uiLibrary.enabled` is set to `true`, the form will not apply default input styles, allowing the UI library's native styles to be used.

### Global Error Handling

Handle form-level errors:

```tsx
<FormProvider
  globalErrorOptions={{
    position: 'top',
    animation: 'fadeIn',
    autoDismiss: true,
    dismissAfter: 5000
  }}
  onSubmit={async (data) => {
    try {
      await submitData(data);
    } catch (error) {
      // Return error to display as global error
      return error;
    }
  }}
>
  {/* ... */}
</FormProvider>
```

## Advanced Usage

### Using External Form Control

You can use an external form instance:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
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

### Form Reset

The form can be reset to its initial values:

```tsx
function MyForm() {
  const handleReset = () => {
    // The form will be reset to defaultValues
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
    >
      {/* Form fields */}
      <button type="reset">Reset Form</button>
    </FormProvider>
  );
}
```

## Best Practices

1. **Schema Definition**
   - Define your schema outside the component to prevent unnecessary re-renders
   - Use descriptive error messages in your schema

2. **Form Submission**
   - Handle async operations properly with try/catch
   - Return errors from the submit handler to display as global errors

3. **Default Values**
   - Always provide default values for all fields in your schema
   - For complex forms, consider using a factory function to generate default values

4. **Performance**
   - Use `mode="onBlur"` for better performance with large forms
   - Consider using `shouldUnregister: false` for fields that may be conditionally rendered

## Related Components

- [FormField](./form-field.md) - For rendering individual form fields
- [FormButtonsBar](./form-buttons.md) - For rendering form action buttons
- [FormDescription](./form-description.md) - For adding form-level descriptions

## Examples

Check out the [examples section](/examples/basic) to see FormProvider in action.
