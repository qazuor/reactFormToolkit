# TypeScript Integration

**Qazuor React Form Toolkit** is built with TypeScript from the ground up, providing excellent type safety and developer experience.

## Type-Safe Forms

The library leverages Zod's type inference to provide type-safe forms:

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

// Define your schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  // Type-safe form submission
  const handleSubmit = (data: LoginFormValues) => {
    // TypeScript knows that data has email and password properties
    console.log(data.email, data.password);
  };

  return (
    <FormProvider
      schema={loginSchema}
      onSubmit={handleSubmit}
    >
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>
      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>
      <button type="submit">Login</button>
    </FormProvider>
  );
}
```

## Generic Types

The library uses generics to provide type safety across components:

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  age: z.number()
});

// Explicitly specify the type
function MyForm() {
  return (
    <FormProvider<z.infer<typeof schema>>
      schema={schema}
      onSubmit={(data) => {
        // data is typed as { name: string; age: number }
        console.log(data.name, data.age);
      }}
    >
      {/* Form fields */}
    </FormProvider>
  );
}
```

## Type Definitions

### Form Schema

```tsx
import type { FormSchema } from '@qazuor/react-form-toolkit';

// Use FormSchema to type your schema
const schema: FormSchema<{ email: string; password: string }> = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

### Form Provider Props

```tsx
import type { FormProviderProps } from '@qazuor/react-form-toolkit';

// Define props type for a custom form provider
type MyFormProviderProps<T> = FormProviderProps<T> & {
  customProp: string;
};
```

### Style Options

```tsx
import type { FormProviderStyleOptions } from '@qazuor/react-form-toolkit';

// Define custom styles with proper typing
const styles: FormProviderStyleOptions = {
  field: {
    input: 'custom-input',
    label: 'custom-label'
  },
  buttons: {
    submit: 'custom-submit'
  }
};
```

### Error Display Options

```tsx
import type { ErrorDisplayOptions } from '@qazuor/react-form-toolkit';

// Define error display options with proper typing
const errorOptions: ErrorDisplayOptions = {
  position: 'below',
  animation: 'fadeIn',
  showIcon: true
};
```

## Advanced TypeScript Usage

### Conditional Types

```tsx
import type { ConditionalFieldProps } from '@qazuor/react-form-toolkit';

// Create a type that changes based on a condition
type MyFieldProps<T extends boolean> = T extends true
  ? ConditionalFieldProps & { required: true }
  : ConditionalFieldProps;

// Usage
const props: MyFieldProps<true> = {
  watchField: 'type',
  condition: 'advanced',
  required: true,
  children: <div />
};
```

### Mapped Types

```tsx
import type { FormSchema } from '@qazuor/react-form-toolkit';

// Create a type that maps all properties to be optional
type PartialFormSchema<T> = {
  [K in keyof T]?: T[K];
};

// Usage
type UserSchema = FormSchema<{
  name: string;
  email: string;
}>;

type PartialUserSchema = PartialFormSchema<UserSchema>;
```

### Utility Types

```tsx
import type { Form, FieldValues } from '@qazuor/react-form-toolkit';

// Extract the type of a form field
type FieldType<
  TFieldValues extends FieldValues,
  TFieldName extends keyof TFieldValues
> = TFieldValues[TFieldName];

// Usage
type UserForm = {
  name: string;
  email: string;
  age: number;
};

type AgeField = FieldType<UserForm, 'age'>; // number
```

## Type-Safe Hooks

### useFieldState

```tsx
import { useFieldState } from '@qazuor/react-form-toolkit';

function EmailField() {
  // TypeScript knows the structure of the returned object
  const { error, isTouched, isDirty, hasError } = useFieldState('email');

  return (
    <div>
      {hasError && <span>{error.message}</span>}
    </div>
  );
}
```

### useFormWatch

```tsx
import { useFormWatch } from '@qazuor/react-form-toolkit';

function PriceCalculator() {
  // Watch quantity field with type safety
  const quantity = useFormWatch<number>({
    name: 'quantity',
    onChange: (value) => {
      // value is typed as number
      console.log(value * 2);
    }
  });

  return <div>Quantity: {quantity}</div>;
}
```

## Best Practices

1. **Use Zod for Schema Definition**
   - Define your schema with Zod to get automatic type inference
   - Use `z.infer<typeof schema>` to extract the type

2. **Explicit Generics**
   - Use explicit generics when TypeScript can't infer types
   - This is especially important for complex nested forms

3. **Type Guards**
   - Use type guards when working with unknown data
   - Example: `if (typeof value === 'string') { /* value is string */ }`

4. **Avoid Type Assertions**
   - Minimize the use of type assertions (`as` keyword)
   - Use proper type guards and inference instead

5. **Document Types**
   - Add JSDoc comments to your types for better IDE support
   - This helps other developers understand your code

## Common TypeScript Errors

### Property 'x' does not exist on type 'y'

This often happens when you try to access a property that doesn't exist in your form values type:

```tsx
// Error: Property 'address' does not exist on type '{ name: string; email: string; }'
const handleSubmit = (data: { name: string; email: string }) => {
  console.log(data.address); // Error!
};
```

Solution: Make sure your schema and types match:

```tsx
const schema = z.object({
  name: z.string(),
  email: z.string(),
  address: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

const handleSubmit = (data: FormValues) => {
  console.log(data.address); // OK, TypeScript knows address might be undefined
};
```

### Type 'string | undefined' is not assignable to type 'string'

This happens when you try to assign an optional value to a required field:

```tsx
// Error: Type 'string | undefined' is not assignable to type 'string'
const email: string = form.getValues('email');
```

Solution: Use type guards or optional chaining:

```tsx
const email = form.getValues('email') || '';
// or
const email = form.getValues('email');
if (email) {
  // email is string here
}
```

## Related Documentation

- [Form Provider](./form-provider.md) - For form-level type safety
- [Form Field](./form-field.md) - For field-level type safety
- [Zod Documentation](https://zod.dev/) - For more information on Zod schemas
