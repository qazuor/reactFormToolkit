# Form Provider

The `FormProvider` component is the foundation of React Form Toolkit. It manages form state, validation, and provides context to child components.

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
