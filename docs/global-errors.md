# Global Errors

## Table of Contents

- [Introduction](#introduction)
- [When to Use Global Errors](#when-to-use-global-errors)
- [Implementation](#implementation)
  - [Using the FormError Component](#using-the-formerror-component)
  - [Setting Global Errors Programmatically](#setting-global-errors-programmatically)
  - [Clearing Global Errors](#clearing-global-errors)
- [Error Handling Strategies](#error-handling-strategies)
  - [API Errors](#api-errors)
  - [Validation Errors](#validation-errors)
  - [Network Errors](#network-errors)
- [Handling Global Errors](#handling-global-errors)
- [Customization](#customization)
  - [Styling](#styling)
  - [Custom Error Components](#custom-error-components)
- [Examples](#examples)
  - [Basic Global Error](#basic-global-error)
  - [Error with Custom Styling](#error-with-custom-styling)
  - [Comprehensive Error Handling](#comprehensive-error-handling)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## Introduction

Global errors are a crucial feature in form management that provide a way to handle and display error messages that affect the entire form rather than individual fields. In React Form Toolkit, global errors serve as a centralized mechanism for communicating form-wide issues to users.

Unlike field-specific validation errors that are tied to particular inputs, global errors typically represent:

- Server-side validation failures
- API response errors
- Network connectivity issues
- Authentication or authorization problems
- Business logic violations that span multiple fields
- Any other errors that cannot be attributed to a specific form field

Global errors help improve user experience by clearly communicating what went wrong at the form level, providing context about why a submission failed, and often suggesting steps to resolve the issue.

In React Form Toolkit, the global error system is designed to be simple to implement yet flexible enough to handle complex error scenarios across your application's forms.

## When to Use Global Errors

Global errors are ideal for:

- Server-side validation failures
- Authentication errors (e.g., "Invalid credentials")
- Network connectivity issues
- Permission or authorization errors
- General API errors
- Any error that doesn't map to a specific form field

## Implementation

### Using the FormError Component

The `FormError` component is designed to display global errors within your form:

```tsx
import { FormProvider, FormField, FormError, SubmitButton } from '@qazuor/react-form-toolkit';

function LoginForm() {
  const handleSubmit = async (data) => {
    try {
      // Attempt login
      await loginUser(data);
    } catch (error) {
      // The error will be automatically set as a global error
      throw new Error('Invalid username or password');
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit} schema={loginSchema}>
      <FormField name="username" label="Username">
        <input type="text" />
      </FormField>

      <FormField name="password" label="Password">
        <input type="password" />
      </FormField>

      {/* Display global error */}
      <FormError />

      <SubmitButton text="Log In" />
    </FormProvider>
  );
}
```

## Handling Global Errors

To handle global errors effectively, consider the following strategies:

- **Centralized Error State**: Maintain a centralized state for global errors in your form component. This allows you to manage and display errors consistently across your application.
- **User Feedback**: Provide clear feedback to users when an error occurs. Use the `FormError` component to display messages that inform users of the issue and suggest corrective actions.
- **Logging**: Implement logging for global errors to track issues that occur in production. This will help you identify and resolve problems quickly.

### Example of Global Error Handling
```tsx
import { FormProvider, FormError } from '@qazuor/react-form-toolkit';

function MyForm() {
  const handleSubmit = async (data) => {
    try {
      // Submit data
    } catch (error) {
      // Set global error
      throw new Error('Submission failed. Please try again later.');
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit}>
      <FormError />
      <button type="submit">Submit</button>
    </FormProvider>
  );
}
```

## Error Handling Strategies

### API Errors

API errors occur when there's a problem with the API request or response. These errors can be handled by catching the error and setting a global error message.

### Validation Errors

Validation errors occur when the user input fails to meet the validation rules. These errors can be handled by displaying an error message next to the field or by setting a global error message.

### Network Errors

Network errors occur when there's a problem with the network connection. These errors can be handled by displaying an error message and providing an option to retry the request.

## Customization

### Styling

You can customize the styling of the `FormError` component by using CSS classes or by passing a custom `className` prop.

### Custom Error Components

You can create a custom error component by extending the `FormError` component or by creating a new component that displays the error message.

## Examples

### Basic Global Error

```tsx
import { FormProvider, FormError } from '@qazuor/react-form-toolkit';

function MyForm() {
  const handleSubmit = async (data) => {
    try {
      // Submit data
    } catch (error) {
      // Set global error
      throw new Error('Submission failed. Please try again later.');
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit}>
      <FormError />
      <button type="submit">Submit</button>
    </FormProvider>
  );
}
```

### Error with Custom Styling

```tsx
import { FormProvider, FormError } from '@qazuor/react-form-toolkit';

function MyForm() {
  const handleSubmit = async (data) => {
    try {
      // Submit data
    } catch (error) {
      // Set global error
      throw new Error('Submission failed. Please try again later.');
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit}>
      <FormError className="custom-error" />
      <button type="submit">Submit</button>
    </FormProvider>
  );
}
```

### Comprehensive Error Handling

```tsx
import { FormProvider, FormError } from '@qazuor/react-form-toolkit';

function MyForm() {
  const handleSubmit = async (data) => {
    try {
      // Submit data
    } catch (error) {
      // Set global error
      throw new Error('Submission failed. Please try again later.');
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit}>
      <FormError />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => console.log('Error logged')}>Log Error</button>
    </FormProvider>
  );
}
```

## API Reference

* `FormError` component
* `FormProvider` component
* `onSubmit` prop
* `schema` prop

## Best Practices

* Always handle global errors in your form components.
* Provide clear feedback to users when an error occurs.
* Implement logging for global errors to track issues that occur in production.
* Use a centralized state for global errors in your form component.
