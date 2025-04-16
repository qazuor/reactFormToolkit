# Qazuor React Form Toolkit

<div style="display: flex; flex-wrap: wrap; gap: 5px;">
  <a href="https://www.npmjs.com/package/@qazuor/react-form-toolkit"><img src="https://img.shields.io/npm/v/@qazuor/react-form-toolkit.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" /></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.0-blue" alt="React" /></a>
  <a href="https://github.com/colinhacks/zod"><img src="https://img.shields.io/badge/Zod-3.22-blue" alt="Zod" /></a>
  <a href="https://bundlephobia.com/package/@qazuor/react-form-toolkit"><img src="https://img.shields.io/bundlephobia/minzip/@qazuor/react-form-toolkit" alt="Bundle Size" /></a>
</div>

A comprehensive React form management library built with React Hook Form and Zod.

> [!CAUTION]
> **Beta Release**: This package is currently in beta. While it's stable for most use cases, there might be breaking changes in future releases.

## Features

- 🎯 **Type-safe validation** with Zod schemas
- 🌍 **Internationalization** support (English, Spanish, Russian, Italian, Portuguese, French, German)
- 🎨 **Tailwind CSS styling** with customization options
- 💅 **Comprehensive style system** with component-level overrides
- ⚡ **Framework agnostic** (works with Next.js, Remix, etc.)
- 📦 **Tree-shakeable** and lightweight
- 🧩 **Conditional fields** for dynamic forms
- 🔄 **Dependent fields** for cascading selects
- 🎭 **UI library integration** with Material UI, Chakra UI, and more

## Installation

```bash
# npm
npm install @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# yarn
yarn add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# pnpm
pnpm add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod
```

### Basic Setup

#### In your main css file

> [!IMPORTANT]
> Without this, your tailwind css remove the needed classes and don't style the form.

```scss
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/@qazuor/react-form-toolkit/dist/index.js";

/* Optional: Import default styles */
@import "@qazuor/react-form-toolkit/dist/styles.css";
```

#### In your app entry point

```tsx
import '@qazuor/react-form-toolkit/animations.css';
```

## Quick Start

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

function LoginForm() {
  const handleSubmit = async (data) => {
    console.log(data);
    // Submit to your API
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

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Documentation

For detailed documentation and examples, visit our [documentation site](https://qazuor-react-form-toolkit.vercel.app/).

### Key Components

- **FormProvider**: The root component that manages form state and validation
- **FormField**: Component for rendering form inputs with validation
- **FormButtonsBar**: Component for rendering form action buttons
- **ConditionalField**: Component for conditionally rendering form fields
- **DependantField**: Component for fields that depend on other fields
- **FieldArray**: Component for managing dynamic form arrays

## Why React Form Toolkit?

**Qazuor React Form Toolkit** combines the power of React Hook Form and Zod with a developer-friendly API. It provides:

- **Simplified Form Building**: Create complex forms with minimal boilerplate
- **Type Safety**: Full TypeScript support with inferred types from Zod schemas
- **Flexible Styling**: Works with any UI library or custom styles
- **Advanced Features**: Conditional fields, dependent fields, and more
- **Great DX**: Intuitive API and comprehensive documentation

## Comparison with Other Libraries

| Feature | Qazuor React Form Toolkit | React Hook Form |
|---------|-------------------|-----------------|
| Schema Validation | ✅ (Zod) | ❌ (requires resolver) |
| TypeScript Support | ✅ | ✅ |
| UI Components | ✅ | ❌ |
| Conditional Fields | ✅ | ❌ |
| Dependent Fields | ✅ | ❌ |
| Field Arrays | ✅ | ✅ |
| Internationalization | ✅ | ❌ |
| Style System | ✅ | ❌ |

## Future Features/Changes

- [ ] FormLayouts
- [ ] MultiStepForm
- [ ] Form persistence (localStorage, sessionStorage)
- [ ] Add global context to set **Qazuor React Form Toolkit** options globally in an app (e.g., styling, translations, error display options)
- [ ] Improve performance
- [ ] Integrate async validation with Zod internally
- [ ] Enhanced accessibility features


## Contributing

We welcome contributions! Please see our [contributing guidelines](https://github.com/qazuor/reactFormToolkit/blob/main/CONTRIBUTING.md) for more details.

## License

MIT © [Qazuor](https://github.com/qazuor)
