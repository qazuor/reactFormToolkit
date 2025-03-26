# Field Array

The `FieldArray` component enables dynamic form arrays with validation support.

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
