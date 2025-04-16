# UI Libraries Integration

**Qazuor React Form Toolkit** is designed to work seamlessly with popular UI libraries. This guide explains how to integrate with Material UI, Chakra UI, and Shadcn UI.

## Overview

When integrating with UI libraries, you need to:

1. Configure FormProvider to use the UI library
2. Use render functions to connect form fields with UI components
3. Apply appropriate styling and behavior

## Basic Setup

To enable UI library integration, use the `uiLibrary` prop on FormProvider:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  uiLibrary={{
    enabled: true,
    name: 'material-ui' // or 'chakra-ui', 'shadcn'
  }}
>
  {/* Form fields */}
</FormProvider>
```

When `uiLibrary.enabled` is set to `true`, **Qazuor React Form Toolkit** will:
- Not apply its default input styles
- Allow the UI library's native styles to be used
- Still handle form state, validation, and error messages

## Material UI Integration

### Setup

```tsx
import { TextField, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

function MaterialUIForm() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      uiLibrary={{ enabled: true, name: 'material-ui' }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

### Text Input

```tsx
<FormField name="name" label="Name">
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Enter your name"
  />
</FormField>
```

### Select

```tsx
<FormField name="country" label="Country">
  <Select fullWidth>
    <MenuItem value="">Select a country</MenuItem>
    <MenuItem value="us">United States</MenuItem>
    <MenuItem value="ca">Canada</MenuItem>
  </Select>
</FormField>
```

### Checkbox

```tsx
<FormField name="agree" label="Terms">
  <FormControlLabel
    control={<Checkbox />}
    label="I agree to the terms and conditions"
  />
</FormField>
```

### Advanced Components

For more complex components, use the render function pattern:

```tsx
<FormField name="date" label="Date">
  {({ field }) => (
    <DatePicker
      value={field.value}
      onChange={(date) => field.onChange(date)}
      renderInput={(params) => <TextField {...params} />}
    />
  )}
</FormField>
```

## Chakra UI Integration

### Setup

```tsx
import { Input, Select, Checkbox, FormLabel } from '@chakra-ui/react';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

function ChakraUIForm() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      uiLibrary={{ enabled: true, name: 'chakra-ui' }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

### Text Input

```tsx
<FormField name="name" label="Name">
  <Input placeholder="Enter your name" />
</FormField>
```

### Select

```tsx
<FormField name="country" label="Country">
  <Select placeholder="Select a country">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </Select>
</FormField>
```

### Checkbox

```tsx
<FormField name="agree">
  {({ field }) => (
    <Checkbox
      isChecked={field.value}
      onChange={(e) => field.onChange(e.target.checked)}
    >
      I agree to the terms
    </Checkbox>
  )}
</FormField>
```

## Shadcn UI Integration

### Setup

```tsx
import { Input, Select, Checkbox } from '@/components/ui';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

function ShadcnUIForm() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      uiLibrary={{ enabled: true, name: 'shadcn' }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

### Text Input

```tsx
<FormField name="name" label="Name">
  <Input placeholder="Enter your name" />
</FormField>
```

### Select

```tsx
<FormField name="country" label="Country">
  {({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
      </SelectContent>
    </Select>
  )}
</FormField>
```

### Checkbox

```tsx
<FormField name="agree">
  {({ field }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="agree"
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      <label htmlFor="agree">I agree to the terms</label>
    </div>
  )}
</FormField>
```

## Common Patterns

### Handling Value Changes

Different UI libraries have different ways of handling value changes:

```tsx
// Material UI
<FormField name="country" label="Country">
  {({ field }) => (
    <Select
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
    >
      {/* Options */}
    </Select>
  )}
</FormField>

// Chakra UI
<FormField name="country" label="Country">
  {({ field }) => (
    <Select
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
    >
      {/* Options */}
    </Select>
  )}
</FormField>

// Shadcn UI
<FormField name="country" label="Country">
  {({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
    >
      {/* Options */}
    </Select>
  )}
</FormField>
```

### Error States

You can access error states to apply UI library-specific error styling:

```tsx
<FormField name="email" label="Email">
  {({ field }, _, _, fieldState) => (
    <>
      <TextField
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        error={fieldState.isInvalid}
        helperText={fieldState.isInvalid ? "Invalid email" : ""}
      />
    </>
  )}
</FormField>
```

## Best Practices

1. **Use Render Functions**
   - For complex UI components, always use the render function pattern
   - This gives you full control over how the component is rendered

2. **Consistent Error Handling**
   - Use the UI library's native error states when possible
   - For custom error displays, use the `errorDisplayOptions` prop

3. **Form Layout**
   - Use the UI library's layout components for consistent spacing
   - Consider using grid systems for responsive forms

4. **Accessibility**
   - Ensure UI library components maintain proper accessibility
   - Test with screen readers and keyboard navigation

5. **Performance**
   - Be mindful of re-renders with complex UI components
   - Use memoization techniques when necessary

## Troubleshooting

### Common Issues

1. **Value Handling**
   - Different UI libraries handle values differently
   - Use console.log to debug value changes

2. **Styling Conflicts**
   - Ensure `uiLibrary.enabled` is set to `true` to prevent style conflicts
   - Use the UI library's theming system for consistent styles

3. **Validation Timing**
   - Some UI libraries have their own validation timing
   - Adjust the `mode` prop on FormProvider if needed

## Examples

Check out the [UI Libraries example](/examples/ui-library) to see these integrations in action.
