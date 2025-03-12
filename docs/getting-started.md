# Getting Started

## Installation

To start using React Form Toolkit in your project, you need to install the package along with its dependencies:

```bash
# npm
npm install react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# yarn
yarn add react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# pnpm
pnpm add react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss
```

## Setup

### Tailwind Configuration

Add the React Form Toolkit source in your Tailwind configuration file:

```scss
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/react-form-toolkit/dist/index.js";
```

## Basic Usage

The following example shows how to create a simple form with validation:

```tsx
import { z } from 'zod';
import { FormProvider, FormField } from 'react-form-toolkit';

// Define your form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

function MyForm() {
  const handleSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={formSchema}
      defaultValues={{ name: '', email: '' }}
    >
      <FormField name="name" label="Name" required>
        <input type="text" />
      </FormField>

      <FormField name="email" label="Email" required>
        <input type="email" />
      </FormField>

      <button type="submit">Submit</button>
    </FormProvider>
  );
}
```

## Core Components

### FormProvider

The main component that provides form context to all child components.

```tsx
<FormProvider
  onSubmit={handleSubmit}
  schema={formSchema}
  defaultValues={{ name: '', email: '' }}
>
  {/* Form fields */}
</FormProvider>
```

### FormField

Component for rendering form fields with labels, validation, and error messages.

```tsx
<FormField
  name="email"
  label="Email"
  description="We'll use this email to contact you"
  required
>
  <input type="email" />
</FormField>
```

## Common Examples

<details>
<summary>Contact Form</summary>

```tsx
import { z } from 'zod';
import { FormProvider, FormField } from 'react-form-toolkit';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter a valid name'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactForm = z.infer<typeof contactSchema>;

function ContactForm() {
  const handleSubmit = (data: ContactForm) => {
    console.log('Sending message:', data);
    // Logic to submit the form
  };

  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={contactSchema}
      defaultValues={{ name: '', email: '', message: '' }}
    >
      <FormField name="name" label="Name" required>
        <input type="text" />
      </FormField>

      <FormField name="email" label="Email" required>
        <input type="email" />
      </FormField>

      <FormField name="message" label="Message" required>
        <textarea rows={4} />
      </FormField>

      <button type="submit">Send Message</button>
    </FormProvider>
  );
}
```

</details>

<details>
<summary>Registration Form</summary>

```tsx
import { z } from 'zod';
import { FormProvider, FormField } from 'react-form-toolkit';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterForm() {
  const handleSubmit = (data: RegisterForm) => {
    console.log('Registering user:', data);
    // Registration logic
  };

  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={registerSchema}
      defaultValues={{ username: '', email: '', password: '', confirmPassword: '' }}
    >
      <FormField name="username" label="Username" required>
        <input type="text" />
      </FormField>

      <FormField name="email" label="Email" required>
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password" required>
        <input type="password" />
      </FormField>

      <FormField name="confirmPassword" label="Confirm Password" required>
        <input type="password" />
      </FormField>

      <button type="submit">Register</button>
    </FormProvider>
  );
}
```

</details>

## Next Steps

- Check out [Advanced Usage](./advanced-usage.md) for customization and more advanced features
- Explore the [API Reference](./api-reference.md) for complete details on available components
- Learn about [Internationalization](./i18n.md) to set up your form in multiple languages
