# API Reference

## Components

### FormProvider

Main component for form state management and validation.

```tsx
<FormProvider<FormData>
    schema={zodSchema}
    onSubmit={handleSubmit}
    defaultValues={initialValues}
    mode="onBlur"
    i18n={i18nOptions}
>
    {children}
</FormProvider>
```

#### Props

| Name | Type | Description |
|------|------|-------------|
| `schema` | `z.ZodType` | Zod schema for form validation |
| `onSubmit` | `(data: T) => void \| Promise<void>` | Form submission handler |
| `defaultValues` | `DefaultValues<T>` | Initial form values |
| `mode` | `'onBlur' \| 'onChange' \| 'onSubmit' \| 'onTouched' \| 'all'` | Validation trigger mode |
| `i18n` | `I18nOptions` | Internationalization options |
| `children` | `ReactNode` | Form content |

### FormField

Component for rendering form fields with validation.

```tsx
<FormField
    name="email"
    label="Email Address"
    required
    description="Enter your primary email"
    tooltip="Must be a valid email address"
>
    <input type="email" />
</FormField>
```

#### Props

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
| `asyncValidation` | `(value: any) => Promise<string \| undefined>` | Async validation function |

### Example

```tsx
<FormField
    name="email"
    label="Email Address"
    required
    description="Enter your primary email"
    tooltip="Must be a valid email address"
>
    <input type="email" />
</FormField>
```

### Async Validation Example

```tsx
<FormField
    name="username"
    label="Username"
    asyncValidation={async (value) => {
        const response = await checkUsernameAvailability(value);
        return response.available ? undefined : 'Username already taken';
    }}
>
    <input type="text" />
</FormField>
```

The async validation function:
- Receives the current field value
- Returns a Promise that resolves to:
  - `undefined` if validation passes
  - An error message string if validation fails
- Shows loading state during validation
- Displays error message on validation failure

### FieldArray

Component for managing dynamic form arrays with validation.

```tsx
<FieldArray
    name="items"
    minItems={1}
    maxItems={5}
>
    <FormField name="name">
        <input type="text" />
    </FormField>
</FieldArray>
```

#### Props

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Array field name matching schema |
| `children` | `ReactNode` | Form fields to repeat |
| `minItems` | `number` | Minimum items required |
| `maxItems` | `number` | Maximum items allowed |
| `addButtonText` | `string` | Custom add button text |
| `removeButtonText` | `string` | Custom remove button text |
| `className` | `string` | Container CSS classes |
| `buttonClassName` | `string` | Button CSS classes |


### FormDescription

Component for form-level descriptions.

```tsx
<FormDescription position="above">
    Please fill out all required fields
</FormDescription>
```

#### Props

| Name | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Description content |
| `position` | `'above' \| 'below'` | Position relative to form |
| `className` | `string` | Custom CSS classes |

## Hooks

### useFieldState

Hook for accessing field validation state.

```tsx
const { error, isTouched, isDirty, hasError } = useFieldState('email');
```

#### Returns

| Name | Type | Description |
|------|------|-------------|
| `error` | `FieldError` | Current validation error |
| `isTouched` | `boolean` | Whether field was focused |
| `isDirty` | `boolean` | Whether value changed |
| `hasError` | `boolean` | Whether field has error |

### useQRFTTranslation

Hook for accessing translations.

```tsx
const { t, i18n } = useQRFTTranslation(options);
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `options` | `UseTranslationOptions` | i18next options |

#### Returns

| Name | Type | Description |
|------|------|-------------|
| `t` | `TFunction` | Translation function |
| `i18n` | `i18n` | i18next instance |

## Utilities

### formUtils

Utility functions for form handling.

```tsx
const isRequired = formUtils.isFieldRequired('email', schema);
const validation = formUtils.getFieldValidation('email', schema);
```

#### Methods

| Name | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `isFieldRequired` | `fieldName: string, schema?: ZodType` | `boolean` | Checks if field is required |
| `getFieldValidation` | `fieldName: string, schema?: ZodType` | `object` | Gets field validation rules |

### i18nUtils

Utilities for i18n handling.

```tsx
const i18n = i18nUtils.initializeI18n(options);
const lang = i18nUtils.getCurrentLanguage(i18n);
```

#### Methods

| Name | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `initializeI18n` | `options?: I18nOptions` | `i18n` | Initialize i18n instance |
| `getTranslation` | `i18n: i18n, path: string, params?: object` | `string` | Get translation |
| `getCurrentLanguage` | `i18n: i18n` | `string` | Get current language |
