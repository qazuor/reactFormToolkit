# Hooks Documentation

## useFieldStatus

Custom hook for managing form field status including validation state.

### Parameters

- `fieldName` (string): Name of the form field to track

### Returns

```typescript
{
    error: FieldError | undefined;     // Current validation error
    isTouched: boolean;               // Whether field has been touched
    isDirty: boolean;                 // Whether field value has changed
    hasError: boolean;                // Whether field has validation errors
}
```

### Example

```tsx
function CustomField({ name }: { name: string }) {
    const { hasError, error } = useFieldStatus(name);

    return (
        <div className={hasError ? 'error' : ''}>
            <input name={name} />
            {error && <span>{error.message}</span>}
        </div>
    );
}
```
