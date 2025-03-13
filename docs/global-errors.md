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

