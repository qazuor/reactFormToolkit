# Form Field

The `FormField` component in **Qazuor React Form Toolkit** handles individual form fields with validation, labels, descriptions, and error messages.

## Basic Usage

```tsx
import { FormField } from '@qazuor/react-form-toolkit';

function MyForm() {
  return (
    <FormField
      name="email"
      label="Email Address"
      required
      description="We'll never share your email"
      tooltip="Enter your primary email address"
    >
      <input type="email" />
    </FormField>
  );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name matching schema |
| `label` | `string` | Field label text |
| `required` | `boolean` | Whether field is required |
| `description` | `string \| ReactNode` | Field description |
| `tooltip` | `string` | Tooltip content |
| `children` | `ReactNode` | Input element |
| `descriptionOptions` | `DescriptionOptions` | Description configuration |
| `tooltipOptions` | `TooltipOptions` | Tooltip configuration |
| `styleOptions` | `ComponentStyleOptions` | Style overrides |
| `errorDisplayOptions` | `ErrorDisplayOptions` | Error display configuration |
| `asyncValidation` | `AsyncValidationProps` | Async validation configuration |

## Features

### Render Function Children

You can use a render function as children to have more control over the field rendering:

```tsx
<FormField name="state" label="State">
  {({ field }, dependentValues, styleOptions, fieldState) => (
    <select
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
      className={cn(
        styleProps.styles.select,
        fieldState?.isValid && styleProps.styles.isValid,
        fieldState?.isInvalid && styleProps.styles.isInvalid
      )}
    >
      {/* Options */}
    </select>
  )}
</FormField>
```

The render function receives:
- `field`: The field props (value, onChange, onBlur)
- `dependentValues`: Array of options (when used with DependantField)
- `styleOptions`: Style information with all form and field properties
- `fieldState`: Field state information

### Labels and Descriptions

```tsx
<FormField
  name="email"
  label="Email Address"
  description={
    <span className="flex items-center">
      <InfoIcon className="mr-2" />
      Enter your primary email
    </span>
  }
  descriptionOptions={{
    position: 'below',
    className: 'text-gray-600'
  }}
>
  <input type="email" />
</FormField>
```

### Tooltips

```tsx
<FormField
  name="password"
  label="Password"
  tooltip="Must be at least 8 characters"
  tooltipOptions={{
    position: 'right',
    align: 'start',
    sideOffset: 8
  }}
>
  <input type="password" />
</FormField>
```

### Async Validation

```tsx
<FormField
  name="username"
  label="Username"
  asyncValidation={{
    asyncValidationFn: async (value) => {
      const isAvailable = await checkUsername(value);
      return isAvailable ? true : 'Username is taken';
    },
    asyncValidationDebounce: 500,
    showValidationIcons: true,
    textWhenValidating: 'Checking username...'
  }}
>
  <input type="text" />
</FormField>
```

### Custom Styling

```tsx
<FormField
  name="email"
  styleOptions={{
    input: 'custom-input',
    label: 'custom-label',
    description: 'custom-description'
  }}
>
  <input type="email" />
</FormField>
```

### Error Display

```tsx
<FormField
  name="email"
  errorDisplayOptions={{
    position: 'below',
    animation: 'fadeIn',
    showIcon: true
  }}
>
  <input type="email" />
</FormField>
```

### Required Fields

```tsx
<FormField
  name="email"
  required
  label="Email Address"
>
  <input type="email" />
</FormField>
```

The `required` prop can be:
- Explicitly set with the `required` prop
- Inferred from the schema
- Overridden with `required={false}`

## Input Types

FormField works with all HTML input types:

### Text Input

```tsx
<FormField name="name" label="Name">
  <input type="text" />
</FormField>
```

### Select

```tsx
<FormField name="country" label="Country">
  <select>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</FormField>
```

### Checkbox

```tsx
<FormField name="agree" label="I agree to the terms">
  <input type="checkbox" />
</FormField>
```

### Radio Buttons

```tsx
<FormField name="gender" label="Gender">
  {({ field }) => (
    <div className="space-y-2">
      <label className="flex items-center">
        <input
          type="radio"
          value="male"
          checked={field.value === 'male'}
          onChange={() => field.onChange('male')}
        />
        <span className="ml-2">Male</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          value="female"
          checked={field.value === 'female'}
          onChange={() => field.onChange('female')}
        />
        <span className="ml-2">Female</span>
      </label>
    </div>
  )}
</FormField>
```

### Textarea

```tsx
<FormField name="message" label="Message">
  <textarea rows={4} />
</FormField>
```

## Best Practices

1. **Field Naming**
   - Use consistent naming conventions for field names
   - Match field names with your schema properties

2. **Validation**
   - Use Zod schema for validation rules
   - Add descriptive error messages to your schema

3. **Accessibility**
   - Always include labels for form fields
   - Use descriptions and tooltips to provide additional context
   - Ensure error messages are clear and helpful

4. **Performance**
   - Use render function children for complex fields
   - Consider using `asyncValidationDebounce` for async validation

## Related Components

- [FormProvider](/docs/form-provider) - The parent component for all form fields
- [FormDescription](/docs/form-description) - For adding form-level descriptions
- [DependantField](/docs/dependant-field) - For fields that depend on other fields
- [ConditionalField](/docs/conditional-field) - For conditionally rendered fields

## Examples

Check out the [examples section](/examples/basic) to see FormField in action.
