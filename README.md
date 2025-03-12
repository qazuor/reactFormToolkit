# React Form Toolkit

[![npm version](https://img.shields.io/npm/v/react-form-toolkit.svg)](https://www.npmjs.com/package/react-form-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A strongly-typed React form toolkit built on top of React Hook Form with Zod validation. This library provides a simple, flexible, and type-safe way to build forms in React applications.

## Features

- 🔒 **Type-safe**: Built with TypeScript for complete type safety
- 🧩 **Composable**: Build complex forms with simple, reusable components
- 📝 **Validation**: Seamless integration with Zod for schema validation
- 🎨 **Customizable**: Easily customize styles and behavior
- 🔄 **React Hook Form**: Built on top of the powerful React Hook Form library
- 🧪 **Well-tested**: Comprehensive test suite ensures reliability

## Installation

```bash
# npm
npm install react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# yarn
yarn add react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# pnpm
pnpm add react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss
```

Next add the source in your tailwind file:

```scss
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/react-form-toolkit/dist/index.js";
```

## Basic Usage

Here's a simple example of how to use React Form Toolkit:

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

## Advanced Usage

### Custom Styling

You can customize the styles of your form components:

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

### Different Input Types

React Form Toolkit supports various input types:

```tsx
<FormField name="name" label="Name">
  <input type="text" />
</FormField>

<FormField name="email" label="Email">
  <input type="email" />
</FormField>

<FormField name="password" label="Password">
  <input type="password" />
</FormField>

<FormField name="message" label="Message">
  <textarea rows={4} />
</FormField>

<FormField name="country" label="Country">
  <select>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="uk">United Kingdom</option>
  </select>
</FormField>

<FormField name="agreeToTerms" label="I agree to the terms">
  <input type="checkbox" />
</FormField>
```

### Using External Form Instance

You can use an external form instance from React Hook Form:

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

### Internationalization (i18n)

React Form Toolkit supports internationalization out of the box using i18next. It comes with built-in translations for English, Spanish, French, and Portuguese.

```tsx
import { FormProvider, FormField } from 'react-form-toolkit';

function InternationalizedForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
      i18n={{ lng: 'es' }} // Set language to Spanish
    >
      <FormField name="name" label="Nombre" required>
        <input type="text" />
      </FormField>

      <button type="submit">Enviar</button>
    </FormProvider>
  );
}
```

#### Custom Translations

You can provide custom translations that will override the default ones:

```tsx
const customResources = {
  en: {
    translation: {
      validation: {
        required: 'This field cannot be empty',
      },
    },
  },
  es: {
    translation: {
      form: {
        submit: 'Enviar formulario',
      },
    },
  },
};

function CustomTranslationsForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
      i18n={{
        lng: 'es',
        resources: customResources,
      }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

#### Using Your Own i18n Instance

If you already have an i18n instance in your application, you can pass it directly:

```tsx
import i18n from './your-i18n-config';

function CustomI18nForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={schema}
      i18n={{ i18n }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

## API Reference

### FormProvider

The main component that provides form context to all child components.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Form fields and other components |
| `onSubmit` | `SubmitHandler<TFieldValues>` | Function called when the form is submitted |
| `schema` | `ZodType<TFieldValues>` | Zod schema for form validation |
| `defaultValues` | `DefaultValues<TFieldValues>` | Default values for form fields |
| `className` | `string` | CSS class for the form element |
| `form` | `UseFormReturn<TFieldValues>` | External form instance from React Hook Form |
| `resetOnSubmit` | `boolean` | Whether to reset the form after submission |
| `styles` | `FormStyles` | Custom styles for form elements |
| `i18n` | `I18nOptions` | Internationalization options (language, custom translations) |

### FormField

Component for rendering form fields with labels, validation, and error messages.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name (must match schema) |
| `label` | `string` | Label text for the field |
| `description` | `string` | Description text displayed below the field |
| `children` | `ReactNode` | Input element (input, select, textarea, etc.) |
| `className` | `string` | CSS class for the field wrapper |
| `labelClassName` | `string` | CSS class for the label |
| `descriptionClassName` | `string` | CSS class for the description |
| `errorClassName` | `string` | CSS class for error messages |
| `required` | `boolean` | Whether the field is required |
| `rules` | `Record<string, unknown>` | Additional validation rules |

### useFormContext

Hook for accessing form context within child components.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## TODO

- [ ] Validation
  - [ ] Add Toast as option to show errors
- [ ] Add more examples
- [ ] Add more testing
- [ ] Field Arrays
- [ ] Conditional Fields
- [ ] Dependants Fields
- [ ] UI
  - [ ] Add styles for non Tailwind projects
  - [ ] Add extrahtml prop
  - [ ] Add FormLayouts feature
- [ ] Common Form implementations
  - [ ] Signin, Signup, ForgotPassowrd
  - [ ] Contact us
- [ ] Add form persistense feature
- [ ] Add Form generation from schema feature
- [ ] Add more internacionalized texts
- [ ] Add more languages
- [ ] Create a demo website

### In Progress

- [ ] Extract types and interface code into several files by scope
- [ ] UI
  - [ ] Loading button, Cancel, Reset
  - [ ] Add info tooltips
  - [ ] support components libraries (shadcn, mantine, MUI, etc)
- [ ] Validation
  - [ ] set validation mode configurable
  - [ ] add form context global errors
  - [ ] async validation for FormField
  - [ ] disable complete form on validate/submit
  - [ ] make errors msg more flexible and configurable

### Done ✓

- [x] Add internacionalization
