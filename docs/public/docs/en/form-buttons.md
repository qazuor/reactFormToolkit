# Form Buttons

The `FormButtonsBar` component provides a consistent way to render form action buttons.

## Basic Usage

```tsx
import { FormButtonsBar } from '@qazuor/react-form-toolkit';

function MyForm() {
  return (
    <FormProvider schema={schema}>
      {/* Form fields */}
      <FormButtonsBar
        direction="horizontal"
        fullWidth={false}
        onCancel={() => console.log('cancelled')}
      />
    </FormProvider>
  );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | Button layout direction |
| `fullWidth` | `boolean` | Make buttons take full width |
| `className` | `string` | Container CSS class |
| `buttonStyles` | `ButtonStyleOptions` | Custom button styles |
| `showSubmit` | `boolean` | Show submit button |
| `showReset` | `boolean` | Show reset button |
| `showCancel` | `boolean` | Show cancel button |
| `submitText` | `string` | Custom submit button text |
| `resetText` | `string` | Custom reset button text |
| `cancelText` | `string` | Custom cancel button text |
| `onCancel` | `() => void` | Cancel handler |
| `children` | `ReactNode` | Additional buttons |

## Features

### Button Layout

```tsx
// Horizontal layout
<FormButtonsBar direction="horizontal" />

// Vertical layout
<FormButtonsBar direction="vertical" />
```

### Custom Styles

```tsx
<FormButtonsBar
  buttonStyles={{
    submit: 'bg-blue-600 hover:bg-blue-700',
    reset: 'bg-gray-200 hover:bg-gray-300',
    cancel: 'bg-red-100 hover:bg-red-200'
  }}
/>
```

### Button Selection

```tsx
<FormButtonsBar
  showSubmit={true}
  showReset={true}
  showCancel={false}
/>
```

### Custom Text

```tsx
<FormButtonsBar
  submitText="Save Changes"
  resetText="Start Over"
  cancelText="Go Back"
/>
```

### Additional Buttons

```tsx
<FormButtonsBar>
  <button
    type="button"
    onClick={handlePreview}
  >
    Preview
  </button>
</FormButtonsBar>
```

### Full Width

```tsx
<FormButtonsBar fullWidth={true} />
```

## Individual Button Components

In addition to the `FormButtonsBar`, you can use individual button components:

### SubmitButton

```tsx
import { SubmitButton } from '@qazuor/react-form-toolkit';

<SubmitButton>Submit</SubmitButton>
```

### ResetButton

```tsx
import { ResetButton } from '@qazuor/react-form-toolkit';

<ResetButton>Reset</ResetButton>
```

### CancelButton

```tsx
import { CancelButton } from '@qazuor/react-form-toolkit';

<CancelButton onCancel={() => console.log('cancelled')}>
  Cancel
</CancelButton>
```

## Button States

### Submit Button

- Disabled when:
  - Form has validation errors
  - Async validations are pending
  - Form is submitting
- Shows tooltips for:
  - Validation errors
  - Pending validations
  - Submission state

### Reset Button

- Enabled only when form is dirty
- Shows tooltip when disabled
- Resets form to initial values

### Cancel Button

- Always enabled
- Triggers `onCancel` callback
- Can be hidden with `showCancel={false}`

## Customization

### Styling with Tailwind CSS

```tsx
<FormButtonsBar
  className="mt-8 space-x-4"
  buttonStyles={{
    submit: "bg-indigo-600 hover:bg-indigo-700 text-white",
    reset: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    cancel: "bg-red-100 hover:bg-red-200 text-red-800"
  }}
/>
```

### Custom Button Layout

```tsx
<div className="flex justify-between">
  <div>
    <CancelButton>Back</CancelButton>
  </div>
  <div className="space-x-4">
    <ResetButton>Clear</ResetButton>
    <SubmitButton>Continue</SubmitButton>
  </div>
</div>
```

## Best Practices

1. **Consistent Button Order**
   - Follow platform conventions for button order
   - On Windows/Web: [Cancel] [Reset] [Submit]
   - On macOS/iOS: [Submit] [Reset] [Cancel]

2. **Clear Button Labels**
   - Use action verbs for button labels
   - Be specific about the action (e.g., "Save Changes" instead of "Submit")

3. **Visual Hierarchy**
   - Make the primary action (usually submit) visually distinct
   - Use color and size to indicate importance

4. **Responsive Design**
   - Use `direction="vertical"` and `fullWidth={true}` on small screens
   - Consider using media queries to adjust button layout

## Related Components

- [FormProvider](./form-provider.md) - The parent component for all form fields
- [FormField](./form-field.md) - For rendering individual form fields

## Examples

Check out the [examples section](/examples/basic) to see FormButtonsBar in action.
