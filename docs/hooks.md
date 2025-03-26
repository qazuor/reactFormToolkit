# Hooks Documentation

## useStyles

Custom hook for accessing and merging form styles.

### Parameters

- `componentStyles` (ComponentStyleOptions): Optional component-level style overrides

### Returns

```typescript
{
    styles: FormProviderStyleOptions;     // Merged styles
    mergeComponentStyles: (componentStyles?: ComponentStyleOptions) => FormProviderStyleOptions;
}
```

### Example

```tsx
function CustomField({ styleOptions }) {
    const { styles } = useStyles(styleOptions);

    return (
        <div className={styles.field?.wrapper}>
            <input className={styles.field?.input} />
        </div>
    );
}
```

## useFieldState

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
    const { hasError, error } = useFieldState(name);

    return (
        <div className={hasError ? 'error' : ''}>
            <input name={name} />
            {error && <span>{error.message}</span>}
        </div>
    );
}
```
