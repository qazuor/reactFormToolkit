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

### useFieldStatus

Hook for accessing field validation state.

```tsx
const { error, isTouched, isDirty, hasError } = useFieldStatus('email');
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
