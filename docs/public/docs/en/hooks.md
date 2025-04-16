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

## useFormWatch

Hook for efficiently watching form field changes.

```tsx
import { useFormWatch } from '@qazuor/react-form-toolkit';

function CountryStateForm() {
  // Watch the country field and fetch states when it changes
  useFormWatch({
    name: 'country',
    onChange: (value) => {
      fetchStates(value as string);
    }
  });

  return (
    <div>
      <FormField name="country">
        <select>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </select>
      </FormField>
    </div>
  );
}
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name to watch |
| `onChange` | `(value: unknown) => void` | Callback when field changes |
| `executeOnMount` | `boolean` | Whether to execute callback on mount |
| `skipIfSameValue` | `boolean` | Skip callback if value hasn't changed |

### Returns

The current value of the watched field.

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

## useConditionalField

Hook for handling conditional field logic based on a single condition.

```tsx
import { useConditionalField } from '@qazuor/react-form-toolkit';

function CustomConditionalField() {
  const { isConditionMet } = useConditionalField({
    form,
    watchField: 'type',
    condition: 'business',
    content: <BusinessFields />
  });

  return isConditionMet ? <BusinessFields /> : null;
}
```

### Parameters

```typescript
interface UseConditionalFieldOptions<TFieldValues extends FieldValues> {
  form: Form<TFieldValues>;
  watchField: string;
  condition: unknown | ((value: unknown) => boolean);
  content: ReactNode;
  keepRegistered?: boolean;
}
```

### Returns

| Name | Type | Description |
|------|------|-------------|
| `isConditionMet` | `boolean` | Whether the condition is currently met |

## useConditionalFieldGroup

Hook for handling conditional field group logic based on multiple conditions.

```tsx
import { useConditionalFieldGroup } from '@qazuor/react-form-toolkit';

function CustomConditionalFieldGroup() {
  const { currentValue, conditions } = useConditionalFieldGroup({
    form,
    watchField: 'type',
    conditions: {
      personal: <PersonalFields />,
      business: <BusinessFields />
    }
  });

  return conditions[currentValue] || null;
}
```

### Parameters

```typescript
interface UseConditionalFieldGroupOptions<TFieldValues extends FieldValues> {
  form: Form<TFieldValues>;
  watchField: string;
  conditions: Record<string, ReactNode>;
  keepRegistered?: boolean;
}
```

### Returns

| Name | Type | Description |
|------|------|-------------|
| `currentValue` | `string` | Current value of the watched field |
| `conditions` | `Record<string, ReactNode>` | Map of conditions to content |

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

## useDependantField

Hook for handling dependent field values based on another field's value.

```tsx
import { useDependantField } from '@qazuor/react-form-toolkit';

function CustomDependentField() {
  const { dependentValues, isLoading, fieldState } = useDependantField({
    dependsOnField: 'country',
    dependentField: 'state',
    dependentValuesCallback: getStatesByCountry,
    loadingDelay: 300,
    cacheResults: true
  });

  return (
    <div>
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
    </div>
  );
}
```

### Parameters

```typescript
interface UseDependantFieldOptions {
  dependsOnField: string;
  dependentField?: string;
  dependentValuesCallback: (value: unknown) => Promise<DependentOption[]> | DependentOption[];
  loadingDelay?: number;
  cacheResults?: boolean;
}
```

### Returns

```typescript
interface UseDependantFieldReturn {
  dependentValues: DependentOption[];
  isLoading: boolean;
  fieldState: DependentFieldState;
}
```

## Best Practices

1. **Performance**
   - Use `useFormWatch` instead of directly accessing form values for better performance
   - Set appropriate debounce values for async operations

2. **Component Organization**
   - Use hooks to extract complex logic from your components
   - Create custom hooks for reusable form patterns

3. **Type Safety**
   - Leverage TypeScript generics for type-safe form values
   - Use proper typing for hook parameters and return values

4. **Error Handling**
   - Handle errors gracefully in async operations
   - Provide fallback UI for error states

## Examples

### Custom Form Field with Hooks

```tsx
function CustomEmailField() {
  const { error, hasError } = useFieldState('email');
  const { t } = useQRFTTranslation();

  const {
    className,
    ariaInvalid,
    asyncValidating
  } = useFieldValidation({
    fieldPath: 'email',
    asyncValidation: {
      asyncValidationFn: async (value) => {
        // Check if email is available
        const response = await fetch(`/api/check-email?email=${value}`);
        const data = await response.json();
        return data.available ? true : t('validation.emailTaken');
      },
      asyncValidationDebounce: 500
    }
  });

  return (
    <div className="space-y-2">
      <label htmlFor="email">{t('field.email')}</label>
      <input
        id="email"
        type="email"
        className={className}
        aria-invalid={ariaInvalid}
      />
      {asyncValidating && <span>{t('validation.checking')}</span>}
      {hasError && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}
```

### Watching Multiple Fields

```tsx
function PricingCalculator() {
  const [total, setTotal] = useState(0);

  const quantity = useFormWatch({ name: 'quantity' });
  const price = useFormWatch({ name: 'price' });

  useEffect(() => {
    if (quantity && price) {
      setTotal(Number(quantity) * Number(price));
    }
  }, [quantity, price]);

  return (
    <div>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

## Related Documentation

- [Form Provider](./form-provider.md) - The parent component for all form fields
- [Form Field](./form-field.md) - For rendering individual form fields
- [Conditional Field](./conditional-field.md) - For conditionally rendering fields
- [Dependent Field](./dependent-field.md) - For fields that depend on other fields
