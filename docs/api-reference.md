# API Reference

## FormProvider

Root component that manages form state and validation.

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormField name="email">
    <input type="email" />
  </FormField>
</FormProvider>
```

Provides form context and handles form state management, validation, and submission.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `z.ZodType` | - | Zod schema for form validation |
| `onSubmit` | `(data: T) => void \| Promise<void>` | - | Form submission handler |
| `defaultValues` | `DefaultValues<T>` | `{}` | Initial form values |
| `mode` | `'onBlur' \| 'onChange' \| 'onSubmit' \| 'onTouched' \| 'all'` | `'onBlur'` | Validation trigger mode |
| `i18n` | `I18nOptions` | - | Internationalization options |
| `styleOptions` | `FormProviderStyleOptions` | - | Style customization |
| `errorDisplayOptions` | `ErrorDisplayOptions` | - | Error display configuration |
| `form` | `UseFormReturn<T>` | - | External form instance |

## FormField

Component for rendering form inputs with validation.

```tsx
<FormField
  name="email"
  label="Email"
  required
  tooltip="Enter your email"
>
  <input type="email" />
</FormField>
```

Handles field rendering, validation, and error display.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Field name matching schema |
| `label` | `string` | - | Field label text |
| `required` | `boolean` | `false` | Whether field is required |
| `description` | `string \| ReactNode` | - | Field description |
| `tooltip` | `string` | - | Tooltip content |
| `children` | `ReactNode` | - | Input element |
| `descriptionOptions` | `DescriptionOptions` | - | Description configuration |
| `tooltipOptions` | `TooltipOptions` | - | Tooltip configuration |
| `styleOptions` | `ComponentStyleOptions` | - | Style overrides |
| `errorDisplayOptions` | `ErrorDisplayOptions` | - | Error display configuration |
| `asyncValidation` | `AsyncValidationProps` | - | Async validation configuration |

## FormButtonsBar

Component for rendering form action buttons.

```tsx
<FormButtonsBar
  direction="horizontal"
  fullWidth={false}
  onCancel={() => console.log('cancelled')}
/>
```

Provides submit, reset, and cancel buttons with consistent styling and behavior.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Button layout direction |
| `fullWidth` | `boolean` | `false` | Make buttons take full width |
| `className` | `string` | - | Container CSS class |
| `buttonStyles` | `ButtonStyleOptions` | - | Custom button styles |
| `showSubmit` | `boolean` | `true` | Show submit button |
| `showReset` | `boolean` | `true` | Show reset button |
| `showCancel` | `boolean` | `true` | Show cancel button |
| `submitText` | `string` | `'Submit'` | Custom submit button text |
| `resetText` | `string` | `'Reset'` | Custom reset button text |
| `cancelText` | `string` | `'Cancel'` | Custom cancel button text |
| `onCancel` | `() => void` | - | Cancel handler |
| `children` | `ReactNode` | - | Additional buttons |

## FieldArray

Component for managing dynamic form arrays.

```tsx
<FieldArray name="contacts" minItems={1} maxItems={5}>
  <FormField name="name">
    <input type="text" />
  </FormField>
</FieldArray>
```

Enables dynamic form arrays with validation support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Array field name |
| `children` | `ReactNode` | - | Form fields to repeat |
| `minItems` | `number` | `0` | Minimum items required |
| `maxItems` | `number` | - | Maximum items allowed |
| `addButtonText` | `string` | `'Add'` | Custom add button text |
| `removeButtonText` | `string` | `'Remove'` | Custom remove button text |
| `className` | `string` | - | Container CSS classes |
| `buttonClassName` | `string` | - | Button CSS classes |

## FormDescription

Component for form-level descriptions.

```tsx
<FormDescription position="above">
  Please fill out all required fields
</FormDescription>
```

Renders form-level description text with positioning support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Description content |
| `position` | `'above' \| 'below'` | `'above'` | Position relative to form |
| `className` | `string` | - | Custom CSS classes |
| `id` | `string` | - | Custom element ID |

## ErrorDisplayOptions

Configuration options for error message display.

```tsx
const options: ErrorDisplayOptions = {
  position: 'below',
  animation: 'fadeIn',
  showIcon: true
};
```

Controls how validation errors are displayed.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | `'below' \| 'above' \| 'right' \| 'tooltip'` | `'below'` | Error message position |
| `animation` | `'none' \| 'fadeIn' \| 'slideIn' \| 'pulse' \| 'shake'` | `'none'` | Error animation type |
| `showIcon` | `boolean` | `true` | Show error icon |
| `groupErrors` | `boolean` | `false` | Group all errors together |
| `maxErrors` | `number` | - | Maximum errors to show when grouped |
| `delay` | `number` | `0` | Delay before showing error |
| `autoDismiss` | `boolean` | `false` | Auto dismiss errors |
| `dismissAfter` | `number` | `5000` | Time before auto dismissal |

## AsyncValidationProps

Configuration for asynchronous field validation.

```tsx
const asyncValidation: AsyncValidationProps = {
  asyncValidationFn: checkEmail,
  asyncValidationDebounce: 500
};
```

Controls asynchronous validation behavior.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asyncValidationFn` | `(value: unknown) => Promise<boolean \| string>` | - | Validation function |
| `asyncValidationDebounce` | `number` | `500` | Debounce delay in ms |
| `showValidationIcons` | `boolean` | `true` | Show validation status icons |
| `showLoadingSpinner` | `boolean` | `true` | Show loading spinner |
| `textWhenValidating` | `string` | - | Text during validation |
| `textWhenBeforeStartValidating` | `string` | - | Text before validation |
