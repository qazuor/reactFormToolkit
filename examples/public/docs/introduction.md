# Introduction

React Form Toolkit is a strongly-typed form management library built on top of React Hook Form and Zod. It provides a simple yet powerful way to build and validate forms in React applications.

## Key Features

- 🎯 **Type-safe validation** with Zod schemas
- 🌍 **Internationalization** support out of the box
- 💅 **Customizable styling** with Tailwind CSS
- ⚡ **Async validation** with loading states
- 📦 **Field arrays** for dynamic form fields
- 🔄 **Form state management** with React Hook Form
- 🎨 **Compound components** for flexible layouts
- 🚀 **Framework agnostic** - works with Next.js, Remix, etc.

## Quick Start

```bash
# npm
npm install @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# pnpm
pnpm add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# yarn
yarn add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod
```

### Basic Example

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function LoginForm() {
  const handleSubmit = async (data) => {
    console.log(data);
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
    >
      <FormField
        name="email"
        label="Email"
        required
      >
        <input type="email" />
      </FormField>

      <FormField
        name="password"
        label="Password"
        required
      >
        <input type="password" />
      </FormField>

      <button type="submit">
        Sign In
      </button>
    </FormProvider>
  );
}
```

## Why React Form Toolkit?

- **Type Safety**: Built with TypeScript from the ground up
- **Validation**: Powerful schema-based validation with Zod
- **Flexibility**: Works with any UI library or framework
- **Performance**: Efficient form state management
- **Developer Experience**: Intuitive API and great DX
- **Internationalization**: Built-in i18n support
- **Customization**: Extensive styling and theming options

## Core Concepts

React Form Toolkit is built around a few core concepts:

1. **Form Provider**: The root component that manages form state and validation
2. **Form Fields**: Components for rendering and validating individual fields
3. **Field Arrays**: Support for dynamic form arrays with validation
4. **Async Validation**: Built-in support for asynchronous field validation
5. **Form Buttons**: Pre-built components for form actions
6. **Internationalization**: Multi-language support with i18next
7. **Style System**: Flexible styling with Tailwind CSS

These concepts work together to provide a complete form management solution.
