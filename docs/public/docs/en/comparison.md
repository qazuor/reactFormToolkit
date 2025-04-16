# Comparison with Other Libraries

This guide compares React Form Toolkit with other popular form libraries to help you understand its advantages and use cases.

## React Form Toolkit vs React Hook Form

[React Hook Form](https://react-hook-form.com/) is the foundation of React Form Toolkit, which extends it with additional features.

### Similarities

- Both use uncontrolled components for better performance
- Both support form validation
- Both have minimal re-renders

### Differences

| Feature | React Form Toolkit | React Hook Form |
|---------|-------------------|-----------------|
| UI Components | ✅ Built-in components | ❌ Requires custom implementation |
| Schema Validation | ✅ Built-in Zod integration | ❌ Requires resolver setup |
| Conditional Fields | ✅ Built-in components | ❌ Requires custom implementation |
| Dependent Fields | ✅ Built-in components | ❌ Requires custom implementation |
| Internationalization | ✅ Built-in i18n support | ❌ Requires custom implementation |
| Style System | ✅ Built-in style system | ❌ No styling |
| UI Library Integration | ✅ Built-in support | ❌ Requires custom implementation |

### Code Comparison

**React Hook Form:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

**React Form Toolkit:**

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function LoginForm() {
  const handleSubmit = (data) => console.log(data);

  return (
    <FormProvider schema={schema} onSubmit={handleSubmit}>
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## React Form Toolkit vs Formik

[Formik](https://formik.org/) is another popular form library for React.

### Similarities

- Both provide form validation
- Both have form-level and field-level components
- Both support custom validation

### Differences

| Feature | React Form Toolkit | Formik |
|---------|-------------------|--------|
| Performance | ✅ Uncontrolled components | ❌ Controlled components (more re-renders) |
| Schema Validation | ✅ Built-in Zod integration | ❌ Requires Yup or custom validation |
| Conditional Fields | ✅ Built-in components | ❌ Requires custom implementation |
| Dependent Fields | ✅ Built-in components | ❌ Requires custom implementation |
| Internationalization | ✅ Built-in i18n support | ❌ Requires custom implementation |
| Style System | ✅ Built-in style system | ❌ No styling |
| UI Library Integration | ✅ Built-in support | ❌ Requires custom implementation |

### Code Comparison

**Formik:**

```tsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Must be at least 8 characters').required('Required')
});

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" component="div" className="error" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="div" className="error" />
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
```

**React Form Toolkit:**

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
});

function LoginForm() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={(data) => console.log(data)}
      defaultValues={{ email: '', password: '' }}
    >
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## React Form Toolkit vs React Final Form

[React Final Form](https://final-form.org/react) is a subscription-based form library.

### Similarities

- Both focus on performance
- Both support form validation
- Both have field-level components

### Differences

| Feature | React Form Toolkit | React Final Form |
|---------|-------------------|------------------|
| Schema Validation | ✅ Built-in Zod integration | ❌ Requires custom validation |
| Conditional Fields | ✅ Built-in components | ❌ Requires custom implementation |
| Dependent Fields | ✅ Built-in components | ❌ Requires custom implementation |
| Internationalization | ✅ Built-in i18n support | ❌ Requires custom implementation |
| Style System | ✅ Built-in style system | ❌ No styling |
| UI Library Integration | ✅ Built-in support | ❌ Requires custom implementation |
| Bundle Size | ✅ Smaller | ❌ Larger |

### Code Comparison

**React Final Form:**

```tsx
import { Form, Field } from 'react-final-form';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'Must be at least 8 characters';
  }
  return errors;
};

function LoginForm() {
  return (
    <Form
      onSubmit={(values) => console.log(values)}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <Field name="email">
              {({ input, meta }) => (
                <div>
                  <input {...input} type="email" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          <div>
            <label>Password</label>
            <Field name="password">
              {({ input, meta }) => (
                <div>
                  <input {...input} type="password" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          <button type="submit">Submit</button>
        </form>
      )}
    />
  );
}
```

**React Form Toolkit:**

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Must be at least 8 characters')
});

function LoginForm() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={(data) => console.log(data)}
    >
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## When to Use React Form Toolkit

React Form Toolkit is ideal for:

1. **Complex Forms**: When you need conditional fields, dependent fields, or field arrays
2. **Type-Safe Applications**: When you want full TypeScript support
3. **Internationalized Applications**: When you need multi-language support
4. **Design System Integration**: When you want to integrate with UI libraries
5. **Rapid Development**: When you want to reduce boilerplate code

## When to Use Other Libraries

You might prefer other libraries when:

1. **Minimal Bundle Size**: If you need the absolute smallest bundle size
2. **Simple Forms**: For very simple forms with minimal validation
3. **Custom Validation Logic**: If you need highly custom validation that doesn't fit with Zod
4. **Legacy Applications**: If you're working with older React versions

## Conclusion

React Form Toolkit builds on the strengths of React Hook Form while adding powerful features that simplify complex form development. It's particularly well-suited for TypeScript projects and applications that require sophisticated form behavior with minimal boilerplate.

By providing built-in components for common form patterns, React Form Toolkit helps you build robust forms faster while maintaining excellent performance and type safety.
