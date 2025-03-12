# React Form Toolkit

[![npm version](https://img.shields.io/npm/v/react-form-toolkit.svg)](https://www.npmjs.com/package/react-form-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A strongly-typed React form toolkit built on top of React Hook Form with Zod validation. This library provides a simple, flexible, and type-safe way to build forms in React applications.

## ✨ Features

- 🔒 **Type-safe**: Built with TypeScript for complete type safety
- 🧩 **Composable**: Build complex forms with simple, reusable components
- 📝 **Validation**: Seamless integration with Zod for schema validation
- 🎨 **Customizable**: Easily customize styles and behavior
- 🔄 **React Hook Form**: Built on top of the powerful React Hook Form library
- 🧪 **Well-tested**: Comprehensive test suite ensures reliability

## 🚀 Quick Start

### Installation

```bash
# npm
npm install react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# yarn
yarn add react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# pnpm
pnpm add react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss
```

### Basic Setup

```scss
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/react-form-toolkit/dist/index.js";
```

### Basic Example

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

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md) - Detailed instructions to get started
- [Advanced Usage](./docs/advanced-usage.md) - Customization, input types, and more
- [Internationalization](./docs/i18n.md) - i18n setup and usage
- [API Reference](./docs/api-reference.md) - Complete API documentation
- [Contribution Guide](./docs/contributing.md) - How to contribute to the project

## 📋 Project Status

<details>
<summary>View TODO and In-Progress list</summary>

### TODO

- [ ] Validation
  - [ ] Add Toast as an option to show errors
- [ ] Add more examples
- [ ] Add more testing
- [ ] Field Arrays
- [ ] Conditional Fields
- [ ] Dependants Fields
- [ ] UI
  - [ ] Add styles for non-Tailwind projects
  - [ ] Add extrahtml prop
  - [ ] Add FormLayouts feature
- [ ] Common Form implementations
  - [ ] Signin, Signup, ForgotPassword
  - [ ] Contact us
- [ ] Add form persistence feature
- [ ] Add Form generation from schema feature
- [ ] Add more internationalized texts
- [ ] Add more languages
- [ ] Create a demo website

### In Progress

- [ ] UI
  - [ ] Loading button, Cancel, Reset
  - [ ] Add info tooltips
  - [ ] support components libraries (shadcn, mantine, MUI, etc)
- [ ] Validation
  - [ ] add form context global errors
  - [ ] disable complete form on validate/submit
  - [ ] make errors msg more flexible and configurable

### Done ✓

- [x] Add internationalization
- [x] Extract types and interface code into several files by scope
- [x] Validation
  - [x] set validation mode configurable
  - [x] async validation for FormField
</details>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
