# Components Documentation

## FormField

The `FormField` component is a compound component that handles form field rendering, validation, and error display.

### Props

- `name` (string, required): Field identifier that matches the schema property
- `label` (string, optional): Field label text
- `required` (boolean, optional): Whether the field is required
- `children` (ReactNode, required): Input element to render
- `description` (string, optional): Accessible description text
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

## FieldInput

Handles input rendering with proper styling and accessibility attributes.

### Props

- `id` (string, required): Input identifier
- `hasError` (boolean, optional): Applies error styling
- `disabled` (boolean, optional): Disables the input
- `children` (ReactElement, required): Input element to render
- `description` (string, optional): Accessible description

## FieldError

Displays field validation errors with an icon.

### Props

- `message` (string, optional): Error message to display
