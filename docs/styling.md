# Style System Documentation

## Overview

The React Form Toolkit provides a comprehensive style system that allows you to customize the appearance of all form components. The system uses Tailwind CSS classes and supports multiple levels of style customization:

1. Default styles (built-in)
2. Provider-level styles (applied to all form components)
3. Component-level styles (applied to specific components)

## Style Options Structure

```typescript
interface FormProviderStyleOptions {
    field?: {
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
    };
    form?: {
        wrapper?: string;
    };
    buttons?: {
        submit?: string;
        cancel?: string;
        reset?: string;
    };
    tooltip?: {
        icon?: string;
        content?: string;
    };
}
```

## Usage Examples

### Provider-Level Styling

Apply styles to all form components:

```tsx
const customStyles = {
    field: {
        input: 'border-2 rounded-lg p-2',
        label: 'text-lg font-bold',
        isValid: 'border-green-500',
        isInvalid: 'border-red-500'
    },
    buttons: {
        submit: 'bg-blue-600 text-white px-4 py-2 rounded'
    }
};

function MyForm() {
    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
            styleOptions={customStyles}
        >
            {/* Form fields */}
        </FormProvider>
    );
}
```

### Component-Level Styling

Override styles for specific components:

```tsx
<FormField
    name="email"
    label="Email"
    styleOptions={{
        input: 'border-blue-500 rounded-full',
        label: 'text-blue-600 uppercase'
    }}
>
    <input type="email" />
</FormField>
```

## Style Precedence

Styles are merged in the following order (later styles override earlier ones):

1. Default styles (lowest priority)
2. Provider styles (overrides defaults)
3. Component styles (highest priority)

## State-Based Styling

The system supports different states for form elements:

- `isValid`: Applied when field validation passes
- `isInvalid`: Applied when field has validation errors
- `isValidating`: Applied during async validation
- `isLoading`: Applied when field is in a loading state

```tsx
const styles = {
    field: {
        isValid: 'border-green-500 bg-green-50',
        isInvalid: 'border-red-500 bg-red-50',
        isLoading: 'opacity-50 cursor-wait'
    }
};
```

## Best Practices

1. **Consistent Theme**: Maintain consistent colors and spacing across your form styles

2. **Responsive Design**: Include responsive classes when needed:
   ```tsx
   input: 'w-full md:w-auto p-2 md:p-4'
   ```

3. **State Handling**: Always provide styles for different states:
   - Valid/Invalid states
   - Loading states
   - Focus states

4. **Accessibility**: Ensure sufficient contrast and focus indicators:
   ```tsx
   input: 'focus:ring-2 focus:ring-blue-500 focus:outline-none'
   ```

5. **Component Organization**: Group related styles together:
   ```tsx
   const fieldStyles = {
       wrapper: 'space-y-2',
       label: 'font-bold',
       input: 'border rounded'
   };
   ```
