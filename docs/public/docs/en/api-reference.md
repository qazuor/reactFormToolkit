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

## ConditionalField

Component for conditionally rendering form fields based on another field's value.

```tsx
<ConditionalField
  watchField="accountType"
  condition="business"
  keepRegistered={false}
>
  <FormField name="companyName">
    <input type="text" />
  </FormField>
</ConditionalField>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `watchField` | `string` | - | Field name to watch for changes |
| `condition` | `string \| ((value: unknown) => boolean)` | - | Value to match or function that returns boolean |
| `children` | `ReactNode` | - | Content to show when condition is met |
| `fallback` | `ReactNode` | `null` | Optional content to show when condition is not met |
| `keepRegistered` | `boolean` | `false` | Keep fields registered when hidden |

## ConditionalFieldGroup

Component for switching between different sets of form fields based on a field's value.

```tsx
<ConditionalFieldGroup
  watchField="accountType"
  conditions={{
    personal: <PersonalFields />,
    business: <BusinessFields />
  }}
  className="space-y-4"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `watchField` | `string` | - | Field name to watch for changes |
| `conditions` | `Record<string, ReactNode>` | - | Map of field values to content |
| `fallback` | `ReactNode` | `null` | Content to show when no condition matches |
| `className` | `string` | `''` | Optional CSS class for wrapper |
| `keepRegistered` | `boolean` | `false` | Keep fields registered when hidden |

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

## DependantField

Component for managing fields that depend on the value of another field.

```tsx
<DependantField
  dependsOnField="country"
  dependentValuesCallback={getStatesByCountry}
>
  <FormField name="state">
    {({ field }, dependentValues, isLoading) => (
      <select>
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          dependentValues.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    )}
  </FormField>
</DependantField>
```

Enables dynamic loading of options based on another field's value.

| Prop | Type | Description |
|------|------|-------------|
| `dependsOnField` | `string` | Field name that this field depends on |
| `dependentField` | `string` | Optional name of the dependent field (for validation state) |
| `dependentValuesCallback` | `(value: unknown) => Promise<DependentOption[]> \| DependentOption[]` | Function to fetch dependent values |
| `children` | `ReactNode` | Form fields to render with dependent values |
| `loadingDelay` | `number` | Delay before showing loading state (ms) |
| `cacheResults` | `boolean` | Whether to cache results to avoid repeated API calls |

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

## Hooks

### useFieldState

```tsx
const { error, isTouched, isDirty, hasError } = useFieldState('email');
```

Returns validation state for a field.

### useFormWatch

```tsx
const value = useFormWatch({
  name: 'email',
  onChange: (value) => console.log(value)
});
```

Watches a field for changes.

### useQRFTTranslation

```tsx
const { t, i18n } = useQRFTTranslation();
```

Provides translation functions.

### useConditionalField

```tsx
const { isConditionMet } = useConditionalField({
  form,
  watchField: 'type',
  condition: 'business'
});
```

Manages conditional field visibility.

### useConditionalFieldGroup

```tsx
const { currentValue, conditions } = useConditionalFieldGroup({
  form,
  watchField: 'type',
  conditions: {
    personal: <PersonalFields />,
    business: <BusinessFields />
  }
});
```

Manages conditional field group visibility.

### useFieldValidation

```tsx
const {
  className,
  ariaInvalid,
  asyncError,
  asyncValidating
} = useFieldValidation({
  fieldPath: 'email',
  asyncValidation: {
    asyncValidationFn: checkEmail
  }
});
```

Manages field validation state and styling.

### useDependantField

```tsx
const { dependentValues, isLoading, fieldState } = useDependantField({
  dependsOnField: 'country',
  dependentValuesCallback: getStatesByCountry
});
```

Manages dependent field values.

## Utility Functions

### formUtils

```tsx
const isRequired = formUtils.isFieldRequired('email', schema);
const validation = formUtils.getFieldValidation('email', schema);
```

Utility functions for form operations.

### i18nUtils

```tsx
const i18n = i18nUtils.initializeI18n(options);
const lang = i18nUtils.getCurrentLanguage(i18n);
const text = i18nUtils.getTranslation(i18n, 'path.to.key');
```

Utility functions for internationalization.

### Style Utilities

```tsx
const finalStyles = mergeStyles(defaultStyles, providerStyles, componentStyles);
const className = cn('base-class', isActive && 'active');
```

Utility functions for styling.
