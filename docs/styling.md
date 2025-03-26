# Styling

React Form Toolkit provides a flexible styling system that works with Tailwind CSS.

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
