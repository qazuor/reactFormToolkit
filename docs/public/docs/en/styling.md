# Styling

**Qazuor React Form Toolkit** provides a flexible styling system that works with Tailwind CSS.

## Style System

Styles can be applied at multiple levels:

1. Default styles (built-in)
2. Provider-level styles (all components)
3. Component-level styles (specific components)

## Basic Usage

```tsx
// Provider-level styles
<FormProvider
  styleOptions={{
    field: {
      input: 'custom-input-class',
      label: 'custom-label-class'
    }
  }}
>
  {/* Form fields */}
</FormProvider>

// Component-level styles
<FormField
  styleOptions={{
    input: 'specific-input-class'
  }}
>
  <input type="text" />
</FormField>
```

## Style Options

### Field Styles

```tsx
interface FieldStyleOptions {
  wrapper?: string;
  label?: string;
  description?: string;
  error?: string;
  requiredMark?: string;
  input?: string;
  select?: string;
  textarea?: string;
  checkbox?: string;
  isValid?: string;
  isInvalid?: string;
  isValidating?: string;
  isLoading?: string;
}
```

### Button Styles

```tsx
interface ButtonStyleOptions {
  submit?: string;
  reset?: string;
  cancel?: string;
}
```

### Form Styles

```tsx
interface FormStyleOptions {
  wrapper?: string;
}
```

### Tooltip Styles

```tsx
interface TooltipStyleOptions {
  icon?: string;
  content?: string;
}
```

## Examples

### Custom Field Styles

```tsx
<FormField
  styleOptions={{
    wrapper: 'space-y-2',
    label: 'font-bold text-gray-700',
    input: 'border-2 rounded-lg p-2 focus:ring-2',
    description: 'text-sm text-gray-500',
    error: 'text-red-500 text-sm',
    isValid: 'border-green-500',
    isInvalid: 'border-red-500'
  }}
>
  <input type="text" />
</FormField>
```

### Custom Button Styles

```tsx
<FormButtonsBar
  buttonStyles={{
    submit: 'bg-green-600 hover:bg-green-700 text-white',
    reset: 'bg-gray-200 hover:bg-gray-300',
    cancel: 'bg-red-100 hover:bg-red-200'
  }}
/>
```

### Validation States

```tsx
const styles = {
  field: {
    isValid: 'border-green-500 bg-green-50',
    isInvalid: 'border-red-500 bg-red-50',
    isValidating: 'border-yellow-500 bg-yellow-50',
    isLoading: 'opacity-50 cursor-wait'
  }
};
```

### Responsive Styles

```tsx
const styles = {
  field: {
    wrapper: 'space-y-2 md:space-y-4',
    input: 'w-full md:w-auto p-2 md:p-4'
  }
};
```

### Dark Mode

```tsx
const styles = {
  field: {
    input: 'dark:bg-gray-800 dark:text-white',
    label: 'dark:text-gray-200'
  }
};
```

## Tailwind CSS Integration

**Qazuor React Form Toolkit** works seamlessly with Tailwind CSS. Here's how to set it up:

### Setup

```css
/* In your CSS file */
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/@qazuor/react-form-toolkit/dist/index.js";
```

### Animations

Import the animations CSS file:

```tsx
// In your main entry file
import '@qazuor/react-form-toolkit/animations.css';
```

## Custom Themes

You can create custom themes by defining a set of styles:

```tsx
// themes.ts
export const lightTheme = {
  field: {
    wrapper: 'space-y-2',
    label: 'font-medium text-gray-700',
    input: 'border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500',
    error: 'text-red-500 text-sm',
    isValid: 'border-green-500',
    isInvalid: 'border-red-500'
  },
  buttons: {
    submit: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700',
    reset: 'bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300',
    cancel: 'bg-red-100 px-4 py-2 rounded-md hover:bg-red-200'
  }
};

export const darkTheme = {
  field: {
    wrapper: 'space-y-2',
    label: 'font-medium text-gray-200',
    input: 'border border-gray-600 bg-gray-800 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-400',
    error: 'text-red-400 text-sm',
    isValid: 'border-green-400',
    isInvalid: 'border-red-400'
  },
  buttons: {
    submit: 'bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600',
    reset: 'bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600',
    cancel: 'bg-red-900 text-red-100 px-4 py-2 rounded-md hover:bg-red-800'
  }
};
```

Then use the theme in your form:

```tsx
import { useTheme } from './hooks/useTheme';
import { lightTheme, darkTheme } from './themes';

function MyForm() {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      styleOptions={currentTheme}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

## UI Library Integration

When using UI libraries like Material UI or Chakra UI, you can disable **Qazuor React Form Toolkit**'s default styles:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  uiLibrary={{ enabled: true, name: 'material-ui' }}
>
  {/* Form fields with Material UI components */}
</FormProvider>
```

This will prevent style conflicts between React Form Toolkit and the UI library.

## Best Practices

1. **Consistent Styling**
   - Use a consistent style system throughout your application
   - Define common styles at the provider level
   - Override only when necessary at the component level

2. **Responsive Design**
   - Use Tailwind's responsive utilities for different screen sizes
   - Test your forms on various devices

3. **Accessibility**
   - Ensure sufficient color contrast for all states
   - Don't rely solely on color to convey information
   - Test with screen readers

4. **Performance**
   - Avoid complex CSS that might cause layout thrashing
   - Use CSS transitions instead of JavaScript animations when possible

5. **Theme Switching**
   - For dark mode support, use CSS variables or theme objects
   - Consider user preferences with `prefers-color-scheme`

## Related Components

- [FormProvider](./form-provider.md) - For setting provider-level styles
- [FormField](./form-field.md) - For component-level style overrides

## Examples

Check out the [styled form example](/examples/styled) to see custom styling in action.
