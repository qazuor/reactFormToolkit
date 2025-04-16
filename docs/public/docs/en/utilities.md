# Utilities

**Qazuor React Form Toolkit** provides utility functions for common form operations.

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

## Advanced Utilities

### Conditional Field Utilities

```tsx
import { findFieldNames, evaluateCondition } from '@qazuor/react-form-toolkit';

// Find all field names in a React node tree
const fieldNames = findFieldNames(myComponent);

// Evaluate a condition against a value
const isConditionMet = evaluateCondition(fieldValue, condition);
```

### UI Library Utilities

```tsx
import { shouldApplyInputStyles, getUiLibraryCompatibleStyles } from '@qazuor/react-form-toolkit';

// Check if default input styles should be applied
const shouldApply = shouldApplyInputStyles(uiLibrary);

// Get styles compatible with UI libraries
const compatibleStyles = getUiLibraryCompatibleStyles(styles);
```

## Best Practices

### Using Style Utilities

```tsx
// Combine multiple class names conditionally
const inputClassName = cn(
  'base-input',
  isValid && 'input-valid',
  isInvalid && 'input-invalid',
  isDisabled && 'input-disabled'
);

// Merge style objects
const mergedStyles = mergeStyles(
  defaultStyles,
  {
    field: {
      input: 'custom-input'
    }
  }
);
```

### Using Form Utilities

```tsx
// Dynamically determine if a field is required
function MyField({ name }) {
  const isRequired = formUtils.isFieldRequired(name, schema);

  return (
    <div>
      <label>{name} {isRequired && '*'}</label>
      <input />
    </div>
  );
}

// Get validation rules for custom validation logic
function CustomValidation({ name }) {
  const rules = formUtils.getFieldValidation(name, schema);

  // Use rules for custom validation
  console.log('Validation rules:', rules);

  return null;
}
```

### Using i18n Utilities

```tsx
// Initialize i18n with custom resources
const i18n = i18nUtils.initializeI18n({
  resources: {
    en: {
      validation: {
        custom: 'Custom validation message'
      }
    }
  },
  lng: 'en'
});

// Get translations with parameters
const message = i18nUtils.getTranslation(i18n, 'validation.minLength', { min: 8 });
```

## Examples

### Custom Form Component with Utilities

```tsx
import { cn, formUtils, useQRFTTranslation } from '@qazuor/react-form-toolkit';

function CustomForm({ schema, children }) {
  const { t } = useQRFTTranslation();

  // Process children to add required indicators
  const processedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === FormField) {
      const fieldName = child.props.name;
      const isRequired = formUtils.isFieldRequired(fieldName, schema);

      return React.cloneElement(child, {
        required: isRequired,
        label: `${child.props.label} ${isRequired ? '*' : ''}`,
        className: cn(
          child.props.className,
          'custom-field'
        )
      });
    }
    return child;
  });

  return (
    <FormProvider schema={schema}>
      <div className="custom-form">
        <h2>{t('form.title')}</h2>
        {processedChildren}
      </div>
    </FormProvider>
  );
}
```

### Dynamic Form Generation

```tsx
import { formUtils, cn } from '@qazuor/react-form-toolkit';

function DynamicForm({ schema, onSubmit }) {
  // Generate form fields from schema
  const fields = Object.entries(schema.shape).map(([name, fieldSchema]) => {
    const isRequired = formUtils.isFieldRequired(name, schema);
    const fieldType = getFieldType(fieldSchema); // Custom function to determine field type

    return (
      <FormField
        key={name}
        name={name}
        label={formatFieldName(name)} // Custom function to format field name
        required={isRequired}
        className={cn(
          'dynamic-field',
          `field-type-${fieldType}`
        )}
      >
        {renderFieldByType(fieldType, name)} {/* Custom function to render field by type */}
      </FormField>
    );
  });

  return (
    <FormProvider schema={schema} onSubmit={onSubmit}>
      {fields}
      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Related Documentation

- [Form Provider](./form-provider.md) - The parent component for all form fields
- [Form Field](./form-field.md) - For rendering individual form fields
- [Styling](./styling.md) - For more information on styling options
- [Internationalization](./i18n.md) - For more information on i18n options
