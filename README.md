<p align="center">
  <img src="/logo.webp" alt="Qazuor React Form Toolkit" width="800" />
</p>

A comprehensive React form management library built with React Hook Form and Zod.

> [!CAUTION]
> **Do not use** in production environments. This package is currently in development, and we do not have an alpha version yet.

## Features

- 🎯 Type-safe form validation with Zod
- 🌍 Internationalization support
- 🎨 Tailwind CSS styling with customization options
- 💅 Comprehensive style system with component-level overrides
- ⚡ Framework agnostic (works with Next.js, Remix, etc.)
- 📦 Tree-shakeable and lightweight

## Installation

```bash
# npm
npm install @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# yarn
yarn add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss

# pnpm
pnpm add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod tailwindcss
```

### Basic Setup

#### In your main css file

> [!IMPORTANT]
> Without this, your tailwind css remove the needes classes and dont style the form.

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
import "../node_modules/@qazuor/react-form-toolkit/dist/style.css";
```

## Quick Start

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const customStyles = {
    field: {
        input: 'border-2 rounded-lg p-2',
        label: 'text-lg font-bold'
    }
};

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
            styleOptions={customStyles}
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

## Documentation

For detailed documentation and examples, visit our [documentation site](https://github.com/qazuor/reactFormToolkit/blob/main/README.md).

## License

MIT
