# React Hook Form vs **Qazuor React Form Toolkit**

This comparison illustrates how forms would look using **plain React Hook Form** versus using **Qazuor React Form Toolkit**, highlighting the differences in structure, boilerplate, and maintainability.

## Motivation

The primary motivation behind **Qazuor React Form Toolkit** is to **reduce boilerplate code** when working with forms. While React Hook Form is an excellent library, it often requires repetitive code patterns for common form scenarios. **Qazuor React Form Toolkit** builds on top of React Hook Form to provide a more declarative API, built-in components for common patterns, and additional features that simplify day-to-day web application development.

## Basic Form Example

Let's compare a simple login form with email and password fields.

### Using React Hook Form (Vanilla)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Submit data to API
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={`w-full rounded-md border p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}
```

### Using Qazuor React Form Toolkit

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const handleSubmit = async (data: FormValues) => {
    try {
      // Submit data to API
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
      return error; // Return error to display as global error
    }
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{ email: '', password: '' }}
    >
      <FormField name="email" label="Email" required>
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password" required>
        <input type="password" />
      </FormField>

      <FormButtonsBar submitText="Sign In" />
    </FormProvider>
  );
}
```

## Complex Form Example

Now let's compare a more complex form with conditional fields, validation, and field arrays.

### Using React Hook Form (Vanilla)

```tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  accountType: z.enum(['personal', 'business']),
  // Conditional fields
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  // Field array
  contacts: z.array(
    z.object({
      name: z.string().min(2, 'Contact name is required'),
      email: z.string().email('Please enter a valid email')
    })
  ).min(1, 'At least one contact is required')
});

type FormValues = z.infer<typeof schema>;

function ComplexForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      accountType: 'personal',
      companyName: '',
      taxId: '',
      contacts: [{ name: '', email: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts'
  });

  // Watch account type for conditional fields
  const accountType = watch('accountType');

  // Reset conditional fields when account type changes
  useEffect(() => {
    if (accountType === 'personal') {
      setValue('companyName', '');
      setValue('taxId', '');
    }
  }, [accountType, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Submit data to API
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            {...register('name')}
            className={`w-full rounded-md border p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="accountType" className="block text-sm font-medium">
            Account Type
          </label>
          <select
            id="accountType"
            {...register('accountType')}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Conditional fields */}
        {accountType === 'business' && (
          <>
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium">
                Company Name
              </label>
              <input
                id="companyName"
                {...register('companyName')}
                className={`w-full rounded-md border p-2 ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="taxId" className="block text-sm font-medium">
                Tax ID
              </label>
              <input
                id="taxId"
                {...register('taxId')}
                className={`w-full rounded-md border p-2 ${errors.taxId ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.taxId && (
                <p className="text-sm text-red-500">{errors.taxId.message}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Field array */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contacts</h3>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">Contact {index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-md bg-red-100 px-2 py-1 text-sm text-red-600 hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={`contacts.${index}.name`} className="block text-sm font-medium">
                  Contact Name
                </label>
                <input
                  id={`contacts.${index}.name`}
                  {...register(`contacts.${index}.name`)}
                  className={`w-full rounded-md border p-2 ${
                    errors.contacts?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contacts?.[index]?.name && (
                  <p className="text-sm text-red-500">{errors.contacts?.[index]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor={`contacts.${index}.email`} className="block text-sm font-medium">
                  Contact Email
                </label>
                <input
                  id={`contacts.${index}.email`}
                  type="email"
                  {...register(`contacts.${index}.email`)}
                  className={`w-full rounded-md border p-2 ${
                    errors.contacts?.[index]?.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contacts?.[index]?.email && (
                  <p className="text-sm text-red-500">{errors.contacts?.[index]?.email?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', email: '' })}
          className="rounded-md bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200"
        >
          Add Contact
        </button>

        {errors.contacts && errors.contacts.message && (
          <p className="text-sm text-red-500">{errors.contacts.message}</p>
        )}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
```

### Using Qazuor React Form Toolkit

```tsx
import { FormProvider, FormField, FormButtonsBar, ConditionalField, FieldArray } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  accountType: z.enum(['personal', 'business']),
  // Conditional fields
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  // Field array
  contacts: z.array(
    z.object({
      name: z.string().min(2, 'Contact name is required'),
      email: z.string().email('Please enter a valid email')
    })
  ).min(1, 'At least one contact is required')
});

type FormValues = z.infer<typeof schema>;

function ComplexForm() {
  const handleSubmit = async (data: FormValues) => {
    try {
      // Submit data to API
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
      return error; // Return error to display as global error
    }
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{
        name: '',
        email: '',
        accountType: 'personal',
        companyName: '',
        taxId: '',
        contacts: [{ name: '', email: '' }]
      }}
    >
      <div className="space-y-6">
        <FormField name="name" label="Name" required>
          <input type="text" />
        </FormField>

        <FormField name="email" label="Email" required>
          <input type="email" />
        </FormField>

        <FormField name="accountType" label="Account Type">
          <select>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </FormField>

        {/* Conditional fields */}
        <ConditionalField watchField="accountType" condition="business">
          <div className="space-y-4">
            <FormField name="companyName" label="Company Name">
              <input type="text" />
            </FormField>

            <FormField name="taxId" label="Tax ID">
              <input type="text" />
            </FormField>
          </div>
        </ConditionalField>

        {/* Field array */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contacts</h3>

          <FieldArray name="contacts" minItems={1}>
            <div className="space-y-4">
              <FormField name="name" label="Contact Name" required>
                <input type="text" />
              </FormField>

              <FormField name="email" label="Contact Email" required>
                <input type="email" />
              </FormField>
            </div>
          </FieldArray>
        </div>

        <FormButtonsBar />
      </div>
    </FormProvider>
  );
}
```

## Key Differences

### 1. Boilerplate Reduction

**Qazuor React Form Toolkit** significantly reduces boilerplate code:

- **No manual error handling**: Error display is handled automatically
- **No manual field registration**: Fields are registered through components
- **Built-in form buttons**: Common form actions are pre-built
- **Automatic label and description handling**: No need to manually create labels

### 2. Declarative API

**Qazuor React Form Toolkit** provides a more declarative API:

- **Component-based approach**: Form structure is defined through components
- **Prop-based configuration**: Behavior is configured through props
- **Consistent patterns**: Common patterns are standardized

### 3. Advanced Features

**Qazuor React Form Toolkit** includes built-in support for advanced features:

- **Conditional fields**: Show/hide fields based on other field values
- **Dependent fields**: Load options based on other field values
- **Field arrays**: Dynamic arrays of fields with validation
- **Async validation**: Validate fields asynchronously with loading states
- **Internationalization**: Support for multiple languages
- **UI library integration**: Works with Material UI, Chakra UI, and more

### 4. Type Safety

Both libraries provide type safety, but **Qazuor React Form Toolkit** makes it more straightforward:

- **Automatic type inference**: Types are inferred from Zod schemas
- **Component prop types**: All component props are properly typed
- **Hook return types**: All hooks return properly typed values

## Summary Table

| Feature | React Hook Form | React Form Toolkit |
|---------|----------------|-------------------|
| **Code Volume** | More verbose | More concise |
| **Error Handling** | Manual | Automatic |
| **Conditional Fields** | Manual implementation | Built-in component |
| **Field Arrays** | Manual setup | Built-in component |
| **Styling** | Manual | Built-in system |
| **Internationalization** | Manual | Built-in |
| **Type Safety** | Good | Excellent |
| **Learning Curve** | Moderate | Low |
| **Flexibility** | Very high | High |
| **Performance** | Excellent | Excellent |

## When to Use Qazuor React Form Toolkit

Use **Qazuor React Form Toolkit** when:

- You want to reduce boilerplate code
- You need built-in support for advanced form patterns
- You want consistent styling and behavior across forms
- You need internationalization support
- You're building forms with complex validation requirements

## When to Use React Hook Form Directly

Use React Hook Form directly when:

- You need maximum control over every aspect of the form
- You have very specific custom requirements that don't fit the React Form Toolkit patterns
- You're building a very simple form with minimal validation
- You need to minimize bundle size to the absolute minimum

## Conclusion

**Qazuor React Form Toolkit** builds on the solid foundation of React Hook Form to provide a more developer-friendly experience. By reducing boilerplate and providing built-in solutions for common form patterns, it allows you to build complex forms faster while maintaining the performance benefits of React Hook Form.

The choice between the two libraries depends on your specific needs, but for most applications, **Qazuor React Form Toolkit** will provide a better developer experience and faster development time.
