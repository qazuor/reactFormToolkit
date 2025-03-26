# Hooks

React Form Toolkit provides several hooks for accessing form state and functionality.

## useFieldState

Hook for accessing field validation state.

```tsx
import { useFieldState } from '@qazuor/react-form-toolkit';

function CustomField() {
  const { error, isTouched, isDirty, hasError } = useFieldState('email');

  return (
    <div>
      {hasError && <span>{error.message}</span>}
      {isDirty && <span>Field modified</span>}
    </div>
  );
}
```

### Returns

| Name | Type | Description |
|------|------|-------------|
| `error` | `FieldError` | Current validation error |
| `isTouched` | `boolean` | Whether field was focused |
| `isDirty` | `boolean` | Whether value changed |
| `hasError` | `boolean` | Whether field has error |

## useQRFTTranslation

Hook for accessing translations.

```tsx
import { useQRFTTranslation } from '@qazuor/react-form-toolkit';

function CustomField() {
  const { t, i18n } = useQRFTTranslation();

  return (
    <div>
      <label>{t('field.label')}</label>
      <span>{t('validation.required')}</span>
    </div>
  );
}
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `options` | `UseTranslationOptions` | i18next options |

### Returns

| Name | Type | Description |
|------|------|-------------|
| `t` | `TFunction` | Translation function |
| `i18n` | `i18n` | i18next instance |

## useFieldValidation

Hook for handling field validation state and styling.

```tsx
import { useFieldValidation } from '@qazuor/react-form-toolkit';

function CustomField() {
  const {
    className,
    ariaInvalid,
    asyncError,
    asyncValidating,
    hasAsyncError
  } = useFieldValidation({
    fieldPath: 'email',
    asyncValidation: {
      asyncValidationFn: checkEmail
    }
  });

  return (
    <div>
      <input
        className={className}
        aria-invalid={ariaInvalid}
      />
      {asyncValidating && <span>Checking...</span>}
      {hasAsyncError && <span>{asyncError}</span>}
    </div>
  );
}
```

### Parameters

```typescript
interface UseFieldValidationProps {
  fieldPath: string;
  isCheckbox?: boolean;
  mergedStyles: FormProviderStyleOptions;
  asyncValidation?: AsyncValidationProps;
  schema?: ZodType;
  hasError?: boolean;
}
```

### Returns

```typescript
interface UseValidationReturn {
  className: string;
  ariaInvalid: boolean;
  ariaDescribedBy?: string;
  hasAsyncError: boolean;
  asyncValidating: boolean;
  asyncValidatingStarted: boolean;
  asyncError?: string;
  showValidationIcons: boolean;
  showLoadingSpinner: boolean;
  textWhenValidating?: string;
  textWhenBeforeStartValidating?: string;
}
```
