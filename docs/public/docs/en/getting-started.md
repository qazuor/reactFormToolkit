# Getting Started

This guide will help you set up **Qazuor React Form Toolkit** in your project and create your first form.

## Installation

You can install **Qazuor React Form Toolkit** using npm, yarn, or pnpm:

```bash
# npm
npm install @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# yarn
yarn add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# pnpm
pnpm add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod
```

## Basic Setup

### CSS Setup

To ensure proper styling, you need to import the CSS file in your main entry point:

```tsx
// In your main entry file (e.g., main.tsx, App.tsx)
import '@qazuor/react-form-toolkit/animations.css';
```

If you're using Tailwind CSS, make sure to include the following in your CSS file:

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/@qazuor/react-form-toolkit/dist/index.js";
```

### Creating Your First Form

Let's create a simple login form with email and password fields:

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

// Define the form schema using Zod
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof schema>;

function LoginForm() {
  // Handle form submission
  const handleSubmit = async (data: LoginFormValues) => {
    console.log('Form submitted:', data);
    // You can make API calls here
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{ email: '', password: '' }}
    >
      <FormField
        name="email"
        label="Email"
        required
        tooltip="Enter your email address"
      >
        <input type="email" placeholder="Enter your email" />
      </FormField>

      <FormField
        name="password"
        label="Password"
        required
        tooltip="Password must be at least 8 characters"
      >
        <input type="password" placeholder="Enter your password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Key Components

### FormProvider

The `FormProvider` component is the foundation of **Qazuor React Form Toolkit**. It manages form state, validation, and provides context to child components.

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  defaultValues={defaultValues}
  mode="onBlur"
>
  {/* Form fields */}
</FormProvider>
```

Learn more about [FormProvider](./form-provider.md).

### FormField

The `FormField` component handles individual form fields with validation, labels, descriptions, and error messages.

```tsx
<FormField
  name="email"
  label="Email"
  required
  description="We'll never share your email"
  tooltip="Enter your primary email address"
>
  <input type="email" />
</FormField>
```

Learn more about [FormField](./form-field.md).

### FormButtonsBar

The `FormButtonsBar` component provides a consistent way to render form action buttons.

```tsx
<FormButtonsBar
  direction="horizontal"
  fullWidth={false}
  onCancel={() => console.log('cancelled')}
/>
```

Learn more about [Form Buttons](./form-buttons.md).

## Advanced Features

**Qazuor React Form Toolkit** offers many advanced features:

- **Conditional Fields**: Show/hide fields based on other field values
- **Dependent Fields**: Load options for a field based on another field's value
- **Field Arrays**: Dynamic form arrays with validation
- **Async Validation**: Validate fields asynchronously with loading states
- **Internationalization**: Support for multiple languages
- **Custom Styling**: Customize the appearance of form components

Explore these features in the respective documentation sections.

## Next Steps

Now that you've set up your first form, you can explore more advanced features:

- [Form Provider](/docs/form-provider) - Learn more about form configuration
- [Form Field](/docs/form-field) - Explore field options and validation
- [Conditional Fields](/docs/conditional-field) - Create dynamic forms
- [Field Arrays](/docs/field-array) - Work with dynamic arrays of fields
- [Validation](/docs/validation) - Learn about validation options

## Troubleshooting

### Common Issues

- **Styling issues**: Make sure you've imported the CSS file correctly
- **Type errors**: Ensure you're using the correct types for your form values
- **Validation not working**: Check that your Zod schema is correctly defined

If you encounter any issues, check the [GitHub repository](https://github.com/qazuor/reactFormToolkit) for known issues or to report a new one.
