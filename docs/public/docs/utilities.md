# Utilities

React Form Toolkit provides utility functions for common form operations.

## Form Utilities

### formUtils

```tsx
import { formUtils } from '@qazuor/react-form-toolkit';

// Check if a field is required
const isRequired = formUtils.isFieldRequired('email', schema);

// Get field validation rules
const validation = formUtils.getFieldValidation('email', schema);
```

#### Methods

| Name | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `isFieldRequired` | `fieldName: string, schema?: ZodType` | `boolean` | Checks if field is required |
| `getFieldValidation` | `fieldName: string, schema?: ZodType` | `object` | Gets field validation rules |

## i18n Utilities

### i18nUtils

```tsx
import { i18nUtils } from '@qazuor/react-form-toolkit';

// Initialize i18n instance
const i18n = i18nUtils.initializeI18n(options);

// Get current language
const lang = i18nUtils.getCurrentLanguage(i18n);

// Get translation
const text = i18nUtils.getTranslation(i18n, 'path.to.key');
```

#### Methods

| Name | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `initializeI18n` | `options?: I18nOptions` | `i18n` | Initialize i18n instance |
| `getTranslation` | `i18n: i18n, path: string, params?: object` | `string` | Get translation |
| `getCurrentLanguage` | `i18n: i18n` | `string` | Get current language |

## Style Utilities

### Style Merging

```tsx
import { mergeStyles } from '@qazuor/react-form-toolkit';

const finalStyles = mergeStyles(
  defaultStyles,
  providerStyles,
  componentStyles
);
```

### Class Names

```tsx
import { cn } from '@qazuor/react-form-toolkit';

const className = cn(
  'base-class',
  isActive && 'active',
  variant === 'primary' && 'primary'
);
```

## Type Utilities

### Form Schema

```tsx
import type { FormSchema } from '@qazuor/react-form-toolkit';

type Schema = FormSchema<typeof zodSchema>;
```

### Style Types

```tsx
import type {
  FormProviderStyleOptions,
  ComponentStyleOptions
} from '@qazuor/react-form-toolkit';

const styles: FormProviderStyleOptions = {
  field: {
    input: 'custom-input',
    label: 'custom-label'
  }
};
```

### Validation Types

```tsx
import type {
  AsyncValidationProps,
  ValidationState
} from '@qazuor/react-form-toolkit';

const asyncValidation: AsyncValidationProps = {
  asyncValidationFn: checkEmail,
  asyncValidationDebounce: 500
};
```
