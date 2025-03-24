# Components Documentation

## Style System

All components support customization through the style system. Styles can be applied at both the provider level and component level:

```tsx
// Provider-level styles
<FormProvider styleOptions={{
    field: {
        input: 'custom-input-class',
        label: 'custom-label-class'
    }
}}>

// Component-level styles
<FormField
    styleOptions={{
        input: 'specific-input-class'
    }}
>
```

## Form Utilities

The form toolkit provides utility functions for form handling:

```tsx
import { formUtils } from '@qazuor/react-form-toolkit';

// Check if a field is required based on schema
const isRequired = formUtils.isFieldRequired('email', schema);

// Get field validation rules
const validationRules = formUtils.getFieldValidation('email', schema);
```

## FormField

The `FormField` component is a compound component that handles form field rendering, validation, and error display.

### Props

- `name` (string, required): Field identifier that matches the schema property
- `label` (string, optional): Field label text
- `required` (boolean, optional): Override schema-based required validation
- `children` (ReactNode, required): Input element to render
- `styleOptions` (ComponentStyleOptions, optional): Style overrides for this field
- `description` (string | ReactNode, optional): Field description content
- `descriptionOptions` (object, optional): Configuration options for the description
  - `className`: string - Custom CSS classes
  - `id`: string - Custom ID for the description element
  - `position`: 'above' | 'below' - Position relative to the input
  - `aria-label`: string - Accessible label
  - `role`: string - ARIA role
- `tooltip` (string, optional): Content text for the tooltip
- `tooltipOptions` (object, optional): Configuration options for the tooltip
  - `position`: 'top' | 'right' | 'bottom' | 'left'
  - `align`: 'start' | 'center' | 'end'
  - `delay`: number
  - `className`: string
  - `sideOffset`: number
  - `hideDelay`: number

### Example

```tsx
<FormField
    name="email"
    label="Email Address"
    required
    description={
        <span className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Enter your primary email address
        </span>
    }
    descriptionOptions={{
        className: 'text-blue-600',
        role: 'note'
    }}
    tooltip="Enter your primary email address"
    tooltipOptions={{
        position: 'right',
        align: 'start',
        sideOffset: 8
    }}
    description="Enter your primary email address"
>
    <input type="email" />
</FormField>
```

## FieldLabel

Renders a form field label with optional required indicator and tooltip.

### Props

- `htmlFor` (string, required): ID of the associated input element
- `children` (string, required): Label text
- `required` (boolean, optional): Shows required indicator
- `styleOptions` (ComponentStyleOptions, optional): Style overrides for this label
- `tooltip` (string, optional): Content text for the tooltip
- `tooltipOptions` (object, optional): Configuration options for the tooltip
  - `position`: 'top' | 'right' | 'bottom' | 'left'
  - `align`: 'start' | 'center' | 'end'
  - `delay`: number
  - `className`: string
  - `sideOffset`: number
  - `hideDelay`: number

```tsx
<FieldLabel
    htmlFor="email"
    required
    tooltip="Enter your primary email address"
    tooltipOptions={{
        position: 'right',
        align: 'start',
        sideOffset: 8
    }}
>
    Email Address
</FieldLabel>
```

## FieldArray

The `FieldArray` component enables dynamic form arrays with validation support.

### Props

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Name of the array field |
| `children` | `ReactNode` | Form fields to repeat |
| `minItems` | `number` | Minimum number of items |
| `maxItems` | `number` | Maximum number of items |
| `addButtonText` | `string` | Custom add button text |
| `removeButtonText` | `string` | Custom remove button text |
| `className` | `string` | Container CSS classes |
| `buttonClassName` | `string` | Button CSS classes |

### Example

```tsx
const schema = z.object({
  items: z.array(z.object({
    name: z.string(),
    email: z.string().email()
  })).min(1)
});

function MyForm() {
  return (
    <FormProvider schema={schema}>
      <FieldArray
        name="items"
        minItems={1}
        maxItems={5}
      >
        <FormField name="name">
          <input type="text" />
        </FormField>
        <FormField name="email">
          <input type="email" />
        </FormField>
      </FieldArray>
    </FormProvider>
  );
}
```

## FieldDescription

Renders a description for form fields with positioning support.

### Props

- `children` (ReactNode, required): Description content
- `className` (string, optional): Custom CSS classes
- `position` ('above' | 'below', optional): Position relative to the field
- `styleOptions` (ComponentStyleOptions, optional): Style overrides for this description
- Additional HTML attributes are supported

```tsx
<FieldDescription
    position="above"
    className="text-blue-600"
    role="note"
>
    Enter your primary email address
</FieldDescription>
```

## FormDescription

Renders a form-level description with positioning support.

### Props

- `children` (ReactNode, required): Description content
- `className` (string, optional): Custom CSS classes
- `position` ('above' | 'below', optional): Position relative to the form
- `styleOptions` (ComponentStyleOptions, optional): Style overrides for this description
- Additional HTML attributes are supported

```tsx
<FormDescription
    position="above"
    className="text-blue-600"
    role="note"
>
    Please fill out all required fields marked with an asterisk (*)
</FormDescription>
```

## FieldError

Displays field validation errors with an icon.

### Props

- `message` (string, optional): Error message to display
