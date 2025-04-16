# Dependent Fields

The Dependent Fields feature in **Qazuor React Form Toolkit** allows you to dynamically load options for a field based on the value of another field. This is useful for creating cascading select fields, such as country/state or category/subcategory relationships.

## Features

- **Dynamic Loading**: Automatically loads options based on parent field value
- **Loading States**: Shows loading indicators during data fetching
- **Caching**: Optionally caches results to avoid repeated API calls
- **Field State**: Provides validation and state information for styling
- **Auto Reset**: Automatically resets dependent field when parent field changes

## Basic Usage

```tsx
import { DependantField, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
    country: z.string(),
    state: z.string().optional()
});

// Function to fetch states based on country
const getStatesByCountry = async (country) => {
    // In a real app, this would be an API call
    const states = {
        us: [
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' }
        ],
        ca: [
            { value: 'on', label: 'Ontario' },
            { value: 'bc', label: 'British Columbia' }
        ]
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return states[country] || [];
};

function LocationForm() {
    return (
        <FormProvider schema={schema}>
            <FormField name="country" label="Country">
                <select>
                    <option value="">Select a country</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                </select>
            </FormField>

            <DependantField
                dependsOnField="country"
                dependentValuesCallback={getStatesByCountry}
                dependentField="state"
            >
                <FormField name="state" label="State">
                    {({ field }, dependentValues, isLoading) => (
                        <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                        >
                            {isLoading ? (
                                <option>Loading...</option>
                            ) : (
                                <>
                                    <option value="">Select a state</option>
                                    {dependentValues.map((state) => (
                                        <option key={state.value} value={state.value}>
                                            {state.label}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    )}
                </FormField>
            </DependantField>
        </FormProvider>
    );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| `dependsOnField` | `string` | Field name that this field depends on |
| `dependentField` | `string` | Optional name of the dependent field (for validation state) |
| `dependentValuesCallback` | `(value: unknown) => Promise<DependentOption[]> \| DependentOption[]` | Function to fetch dependent values |
| `children` | `ReactNode` | Form fields to render with dependent values |
| `loadingDelay` | `number` | Delay before showing loading state (ms) |
| `cacheResults` | `boolean` | Whether to cache results to avoid repeated API calls |

## Features

### Render Function

The child `FormField` component should use a render function to access the dependent values, loading state, and field state:

```tsx
<FormField name="state" label="State">
    {({ field }, dependentValues, isLoading, styleProps, fieldState) => (
        <select
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            className={cn(
                styleProps.styles.select,
                fieldState.isValid && styleProps.styles.isValid,
                fieldState.isInvalid && styleProps.styles.isInvalid,
                fieldState.isValidating && styleProps.styles.isValidating,
                fieldState.isEmpty && 'text-gray-400'
            )}
        >
            {isLoading ? (
                <option>Loading...</option>
            ) : (
                // Render options
            )}
        </select>
    )}
</FormField>
```

### Field State

The component provides a `fieldState` object with the following properties:

```tsx
interface DependentFieldState {
    isValid: boolean;      // Whether the field is in a valid state
    isInvalid: boolean;    // Whether the field is in an invalid state
    isValidating: boolean; // Whether the field is currently validating
    isEmpty: boolean;      // Whether the field has no dependent values loaded
}
```

You can use these properties to apply conditional styling:

```tsx
{({ field }, dependentValues, isLoading, styleProps, fieldState) => (
    <div>
        <select
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className={cn(
                fieldState.isValid && 'border-green-500',
                fieldState.isInvalid && 'border-red-500',
                fieldState.isEmpty && 'text-gray-400'
            )}
        >
            {/* Options */}
        </select>
        {fieldState.isValidating && <span>Validating...</span>}
    </div>
)}
```

### Auto Reset

The component automatically resets the dependent field value when the parent field changes:

```tsx
<DependantField
    dependsOnField="country"
    dependentField="state"
    dependentValuesCallback={getStatesByCountry}
>
    {/* When country changes, state will be reset */}
</DependantField>
```

This prevents invalid selections from persisting when the parent field changes.

### Loading State

The component provides an `isLoading` flag to indicate when dependent values are being fetched:

```tsx
{isLoading ? (
    <option>Loading...</option>
) : (
    // Render options
)}
```

### Result Caching

By default, results are cached to avoid unnecessary API calls. You can disable this behavior:

```tsx
<DependantField
    dependsOnField="country"
    dependentValuesCallback={getStatesByCountry}
    cacheResults={false}
>
    {/* ... */}
</DependantField>
```

### Loading Delay

To prevent flickering for fast responses, you can set a delay before showing the loading state:

```tsx
<DependantField
    dependsOnField="country"
    dependentValuesCallback={getStatesByCountry}
    loadingDelay={500}
>
    {/* ... */}
</DependantField>
```

## Advanced Usage

### Multiple Dependent Fields

You can nest `DependantField` components to create multiple levels of dependencies, with each level resetting when its parent changes:

```tsx
<FormField name="country" label="Country">
    <select>{/* country options */}</select>
</FormField>

<DependantField
    dependsOnField="country"
    dependentField="state"
    dependentValuesCallback={getStatesByCountry}
>
    <FormField name="state" label="State">
        {({ field }, states, isLoadingStates) => (
            <select>{/* state options */}</select>
        )}
    </FormField>

    <DependantField
        dependsOnField="state"
        dependentField="city"
        dependentValuesCallback={getCitiesByState}
    >
        <FormField name="city" label="City">
            {({ field }, cities, isLoadingCities) => (
                <select>{/* city options */}</select>
            )}
        </FormField>
    </DependantField>
</DependantField>
```

### Custom Option Rendering

You can customize how options are rendered and use the field state for styling:

```tsx
<DependantField
    dependsOnField="category"
    dependentField="product"
    dependentValuesCallback={getProductsByCategory}
>
    <FormField name="product" label="Product">
        {({ field }, products, isLoading, styleProps, fieldState) => (
            <div className="custom-select">
                {isLoading ? (
                    <div className="loading-spinner">Loading products...</div>
                ) : (
                    <ul className={fieldState.isEmpty ? 'text-gray-400' : ''}>
                        {products.map(product => (
                            <li
                                key={product.value}
                                className={field.value === product.value ? 'selected' : ''}
                                onClick={() => field.onChange(product.value)}
                            >
                                <img src={product.imageUrl} alt={product.label} />
                                <span>{product.label}</span>
                                <span className="price">${product.price}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
    </FormField>
</DependantField>
```

### Error Handling

You can handle errors in the dependent values callback:

```tsx
const getCategoriesWithErrorHandling = async () => {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Return empty array or default options
        return [];
    }
};
```

## Best Practices

1. **Field Naming**
   - Use the `dependentField` prop to specify the name of the dependent field
   - This enables proper validation state tracking and auto-reset functionality

2. **Initial Loading**
   - Always handle the initial loading state
   - Provide a meaningful loading message or spinner

3. **Error Handling**
   - Implement error handling in your callback function
   - Return a default or empty array on error

4. **Performance**
   - Use `cacheResults` to avoid unnecessary API calls
   - Set an appropriate `loadingDelay` to prevent flickering

5. **Validation**
   - Add conditional validation rules based on dependent field values
   - Clear dependent field value when parent field changes

6. **Accessibility**
   - Ensure loading states are properly communicated to screen readers
   - Maintain focus management during loading and updates

7. **Field Reset**
   - The component automatically resets the dependent field when the parent changes
   - This prevents invalid selections from persisting

## Related Components

- [FormProvider](./form-provider.md) - The parent component for all form fields
- [FormField](./form-field.md) - For rendering individual form fields
- [ConditionalField](./conditional-field.md) - For conditionally rendering fields

## Examples

Check out the [examples section](/examples/dependent-field) to see DependantField in action.
