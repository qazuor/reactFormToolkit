# Field Array

The `FieldArray` component in **Qazuor React Form Toolkit** enables dynamic form arrays with validation support. This is useful for forms where users need to add multiple items, such as contacts, addresses, or any other repeatable data.

## Basic Usage

```tsx
import { FieldArray, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
  contacts: z.array(z.object({
    name: z.string(),
    email: z.string().email()
  })).min(1)
});

function MyForm() {
  return (
    <FormProvider schema={schema}>
      <FieldArray
        name="contacts"
        minItems={1}
        maxItems={5}
      >
        <FormField name="name">
          <input type="text" />
        </FormField>
        <FormField name="email">
          <input type="email" />
        </FormField>
      </FieldArray>
    </FormProvider>
  );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Array field name |
| `children` | `ReactNode` | Form fields to repeat |
| `minItems` | `number` | Minimum items required |
| `maxItems` | `number` | Maximum items allowed |
| `addButtonText` | `string` | Custom add button text |
| `removeButtonText` | `string` | Custom remove button text |
| `className` | `string` | Container CSS classes |
| `buttonClassName` | `string` | Button CSS classes |

## Features

### Nested Arrays

```tsx
<FieldArray name="departments">
  <FormField name="name">
    <input type="text" />
  </FormField>

  <FieldArray name="employees">
    <FormField name="name">
      <input type="text" />
    </FormField>
    <FormField name="role">
      <input type="text" />
    </FormField>
  </FieldArray>
</FieldArray>
```

### Custom Buttons

```tsx
<FieldArray
  name="items"
  addButtonText="Add Another Item"
  removeButtonText="Remove This Item"
  buttonClassName="custom-button"
>
  {/* Fields */}
</FieldArray>
```

### Min/Max Items

```tsx
<FieldArray
  name="phones"
  minItems={1}
  maxItems={3}
>
  {/* Fields */}
</FieldArray>
```

### Validation

```tsx
const schema = z.object({
  phones: z.array(
    z.object({
      type: z.string(),
      number: z.string().regex(/^\+?[1-9]\d{1,14}$/)
    })
  ).min(1).max(3)
});
```

### Custom Styling

```tsx
<FieldArray
  name="items"
  className="space-y-4 p-4 bg-gray-50 rounded-lg"
  buttonClassName="bg-blue-500 text-white px-4 py-2 rounded"
>
  {/* Fields */}
</FieldArray>
```

## Advanced Usage

### Complex Nested Arrays

```tsx
const schema = z.object({
  company: z.object({
    name: z.string(),
    departments: z.array(
      z.object({
        name: z.string(),
        employees: z.array(
          z.object({
            name: z.string(),
            skills: z.array(
              z.object({
                name: z.string(),
                level: z.number().min(1).max(5)
              })
            )
          })
        )
      })
    )
  })
});

function CompanyForm() {
  return (
    <FormProvider schema={schema}>
      <FormField name="company.name" label="Company Name">
        <input type="text" />
      </FormField>

      <FieldArray name="company.departments">
        <FormField name="name" label="Department Name">
          <input type="text" />
        </FormField>

        <FieldArray name="employees">
          <FormField name="name" label="Employee Name">
            <input type="text" />
          </FormField>

          <FieldArray name="skills">
            <FormField name="name" label="Skill Name">
              <input type="text" />
            </FormField>
            <FormField name="level" label="Skill Level">
              <input type="number" min="1" max="5" />
            </FormField>
          </FieldArray>
        </FieldArray>
      </FieldArray>
    </FormProvider>
  );
}
```

### Custom Item Rendering

```tsx
<FieldArray name="contacts">
  {(index) => (
    <div className="p-4 border rounded-lg">
      <h3>Contact {index + 1}</h3>
      <FormField name="name" label="Name">
        <input type="text" />
      </FormField>
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>
    </div>
  )}
</FieldArray>
```

### Dynamic Default Values

```tsx
function OrderForm() {
  const [defaultItems, setDefaultItems] = useState([
    { name: 'Item 1', quantity: 1, price: 10 },
    { name: 'Item 2', quantity: 2, price: 20 }
  ]);

  return (
    <FormProvider
      schema={schema}
      defaultValues={{ items: defaultItems }}
    >
      <FieldArray name="items">
        <FormField name="name" label="Item Name">
          <input type="text" />
        </FormField>
        <FormField name="quantity" label="Quantity">
          <input type="number" min="1" />
        </FormField>
        <FormField name="price" label="Price">
          <input type="number" step="0.01" />
        </FormField>
      </FieldArray>
    </FormProvider>
  );
}
```

## Best Practices

1. **Schema Definition**
   - Define array validation rules in your schema
   - Use `min` and `max` to enforce array length constraints
   - Define validation for each field in the array items

```tsx
const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      quantity: z.number().min(1, "Quantity must be at least 1")
    })
  ).min(1, "At least one item is required").max(10, "Maximum 10 items allowed")
});
```

2. **Performance**
   - Be cautious with deeply nested arrays
   - Consider pagination or virtualization for large arrays
   - Use `React.memo` for complex item components

3. **User Experience**
   - Provide clear add/remove buttons
   - Show validation errors at both item and array levels
   - Consider using drag-and-drop for reordering

4. **Accessibility**
   - Ensure add/remove buttons have proper labels
   - Use appropriate ARIA attributes
   - Test keyboard navigation

5. **Default Values**
   - Always provide default values for array fields
   - For empty arrays, provide at least one empty item if `minItems` > 0

```tsx
const defaultValues = {
  contacts: [{ name: '', email: '' }]
};
```

## Related Components

- [FormProvider](./form-provider.md) - The parent component for all form fields
- [FormField](./form-field.md) - For rendering individual form fields
- [ConditionalField](./conditional-field.md) - For conditionally rendering fields

## Examples

Check out the [examples section](/examples/field-array) to see FieldArray in action.
