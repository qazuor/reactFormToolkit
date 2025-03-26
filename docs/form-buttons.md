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
