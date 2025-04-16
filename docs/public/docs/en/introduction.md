# Introduction

**Qazuor React Form Toolkit** is a comprehensive form management library built on top of [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/). It provides a simple, flexible, and type-safe way to build and validate forms in React applications.

## Key Features

- 🎯 **Type-safe validation** with Zod schemas
- 🌍 **Internationalization** support out of the box
- 💅 **Customizable styling** with Tailwind CSS
- ⚡ **Async validation** with loading states
- 📦 **Field arrays** for dynamic form fields
- 🔄 **Form state management** with React Hook Form
- 🎨 **Compound components** for flexible layouts
- 🚀 **Framework agnostic** - works with Next.js, Remix, etc.
- 🧩 **Conditional fields** for dynamic forms
- 🔄 **Dependent fields** for cascading selects
- 🎭 **UI library integration** with Material UI, Chakra UI, and more

## Why React Form Toolkit?

Building forms in React can be challenging. You need to handle form state, validation, error messages, and more. **Qazuor React Form Toolkit** simplifies this process by providing a set of components and hooks that handle all the complexity for you.

### Problems We Solve

- **Complex form validation**: Zod integration provides powerful schema-based validation
- **Type safety**: Built with TypeScript from the ground up
- **Form state management**: Efficient form state handling with React Hook Form
- **Internationalization**: Built-in i18n support for multiple languages
- **UI flexibility**: Works with any UI library or framework
- **Developer experience**: Intuitive API and great DX

## Quick Example

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

## Core Concepts

**Qazuor React Form Toolkit** is built around a few core concepts:

1. **Form Provider**: The root component that manages form state and validation
2. **Form Fields**: Components for rendering and validating individual fields
3. **Field Arrays**: Support for dynamic form arrays with validation
4. **Async Validation**: Built-in support for asynchronous field validation
5. **Form Buttons**: Pre-built components for form actions
6. **Internationalization**: Multi-language support with i18next
7. **Style System**: Flexible styling with Tailwind CSS

These concepts work together to provide a complete form management solution.

## Related Documentation

- [Getting Started](./getting-started.md) - Installation and basic setup
- [Form Provider](./form-provider.md) - Learn about the FormProvider component
- [Form Field](./form-field.md) - Explore the FormField component
- [Validation](./validation.md) - Learn about form validation

## Next Steps

Ready to get started? Head over to the [Getting Started](./getting-started.md) guide to learn how to install and set up React Form Toolkit in your project.
