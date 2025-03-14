# Visual Feedback

## Table of Contents

- [Visual Feedback](#visual-feedback)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Field State Indicators](#field-state-indicators)
    - [Valid State](#valid-state)
    - [Invalid State](#invalid-state)
    - [Loading State](#loading-state)
    - [Validating State](#validating-state)
  - [Form Submission States](#form-submission-states)
    - [Loading State](#loading-state-1)
    - [Success State](#success-state)
    - [Error State](#error-state)
  - [Animations](#animations)
    - [Built-in Animations](#built-in-animations)
    - [Animation Timing](#animation-timing)
  - [Customizing Visual Feedback](#customizing-visual-feedback)
    - [Custom Styles](#custom-styles)
    - [Custom Icons](#custom-icons)
    - [Custom Animations](#custom-animations)
    - [Theming](#theming)
  - [Accessibility Considerations](#accessibility-considerations)
    - [Screen Reader Support](#screen-reader-support)
    - [Focus Management](#focus-management)
    - [Color Contrast](#color-contrast)
  - [Examples](#examples)
    - [Basic Form with Visual Feedback](#basic-form-with-visual-feedback)
    - [Async Validation with Visual Indicators](#async-validation-with-visual-indicators)
    - [Custom Styled Feedback](#custom-styled-feedback)
  - [Best Practices](#best-practices)
  - [Testing Visual Feedback](#testing-visual-feedback)

## Introduction

React Form Toolkit provides rich visual feedback to enhance the user experience when interacting with forms. These visual cues help users understand the current state of form fields, validation results, and submission status without requiring explicit text messages for every state change.

Visual feedback is automatically applied to all form fields and submission buttons, providing a consistent and intuitive experience across your application. This feedback includes:

- Field validation indicators (valid, invalid, loading)
- Form submission states (loading, success, error)
- Animated transitions between states
- Accessible feedback for screen readers

## Field State Indicators

### Valid State

When a field passes validation, a visual indicator appears to confirm the input is valid:

- A green checkmark icon appears next to the field
- The field border changes to green (with the default styling)
- The transition is animated for a smooth user experience

This feedback is triggered when:

- The field has been touched (focused and blurred)
- The field value passes all validation rules
- Any async validation has completed successfully

```tsx
<FormField name="email" label="Email" required>
  <input type="email" />
</FormField>
```

### Invalid State

When a field fails validation, visual indicators help users identify and fix the issue:

- A red X icon appears next to the field
- The field border changes to red
- An error message appears below the field
- The error message appears with a fade-in animation

This feedback is triggered when:

- The field has been touched (focused and blurred)
- The field value fails validation rules
- The form is submitted with invalid data

```tsx
<FormField
  name="password"
  label="Password"
  required
  description="Must be at least 8 characters with one uppercase letter"
>
  <input type="password" />
</FormField>
```

### Loading State

During form submission or when performing async operations, loading indicators provide feedback:

- A spinning animation appears next to the field or button
- The submit button shows a loading state
- The form may be disabled during submission

This prevents users from submitting the form multiple times and provides visual confirmation that their action is being processed.

### Validating State

During asynchronous validation (like checking if a username is available), a validating state is shown:

- A spinning indicator appears next to the field
- "Validating..." text may appear (configurable)
- The field maintains its current style until validation completes

```tsx
<FormField
  name="username"
  label="Username"
  required
  asyncValidate={checkUsernameAvailability}
  debounceTime={500}
>
  <input type="text" />
</FormField>
```

## Form Submission States

### Loading State

When a form is being submitted, the submit button transitions to a loading state:

- The button text changes to a loading message (configurable)
- A spinner icon appears next to the text
- The button is disabled to prevent multiple submissions
- The button may change color or opacity to indicate the disabled state

```tsx
<SubmitButton
  text="Create Account"
  loadingText="Creating Account..."
/>
```

### Success State

After successful form submission, a success state can be displayed:

- The button text changes to a success message (configurable)
- A checkmark icon appears next to the text
- The button color may change to indicate success (green by default)
- This state can be configured to automatically revert after a specified duration

```tsx
<SubmitButton
  text="Submit"
  loadingText="Processing..."
  successText="Success!"
  successDuration={2000}
/>
```

### Error State

If form submission fails, an error state can be displayed:

- Error messages appear below the form or relevant fields
- The submit button may revert to its original state
- Global form errors can be displayed in a prominent location

## Animations

### Built-in Animations

React Form Toolkit includes several built-in animations to enhance the user experience:

- `fadeIn`: Smooth fade-in effect for elements appearing (error messages, success indicators)
- `fadeOut`: Smooth fade-out effect for elements disappearing
- `pulse`: Subtle pulsing effect for drawing attention to elements
- `spin`: Rotation animation for loading indicators
- `shake`: Brief shaking animation for error states

These animations are implemented using CSS animations and can be customized through the styling system.

### Animation Timing

Animations are carefully timed to provide feedback without being distracting:

- Quick animations (300ms) for immediate feedback
- Medium animations (500ms) for state transitions
- Longer durations (2000ms) for temporary states like success messages

## Customizing Visual Feedback

### Custom Styles

You can define custom styles for valid, invalid, and loading states:

```tsx
const customStyles = {
  field: {
    valid: 'border-green-500',
    invalid: 'border-red-500',
    loading: 'border-yellow-500',
  },
};

<FormProvider styles={customStyles}>
  <FormField name="email" label="Email" required>
    <input type="email" />
  </FormField>
</FormProvider>
```

### Custom Icons

While the default icons provide a clean, consistent look, you can customize them by overriding the relevant style classes and providing your own SVG icons or icon components.

### Theming

To create a cohesive look across your application, you can create a theme by customizing all visual feedback elements:

```tsx
const purpleTheme = {
  form: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg",
  field: {
    wrapper: "mb-5 relative",
    label: "block text-gray-800 text-sm font-semibold mb-2",
    input: "w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-purple-500 transition-all duration-300",
    error: "text-red-600 text-xs mt-1 font-medium animate-shake",
    description: "text-gray-500 text-xs mt-1 italic",
    requiredMark: "text-purple-500 ml-1",
    validating: "ml-2 text-xs text-purple-500 animate-pulse",
    valid: "absolute right-3 top-10 text-purple-500",
    invalid: "absolute right-3 top-10 text-red-500",
    loading: "absolute right-3 top-10 text-purple-500 animate-spin",
  },
};
```

## Accessibility Considerations

### Screen Reader Support

All visual feedback is complemented with appropriate ARIA attributes to ensure screen readers can announce the current state:

- Error messages use `role="alert"` to ensure they're announced
- Loading states include appropriate text for screen readers
- Success messages are properly announced
- Required fields are marked with both visual and programmatic indicators

### Focus Management

The form toolkit manages focus appropriately during state changes:

- Focus remains on fields with errors after submission
- After successful submission, focus can be moved to a logical next element
- During async validation, the field remains interactive

### Color Contrast

Default styles are designed to meet WCAG 2.1 AA contrast requirements:

- Error text uses high-contrast red on light backgrounds
- Success indicators use sufficiently contrasting green
- All text meets minimum contrast ratios

When customizing styles, ensure you maintain sufficient contrast for all users.

## Examples

### Basic Form with Visual Feedback

```tsx
import { z } from 'zod';
import { FormProvider, FormField, SubmitButton } from '@qazuor/react-form-toolkit';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

function ContactForm() {
  const handleSubmit = async (data) => {
    // Submit form data
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={formSchema}
      defaultValues={{ name: '', email: '' }}
    >
      <FormField name="name" label="Name" required>
        <input type="text" className="w-full rounded-md border px-3 py-2" />
      </FormField>

      <FormField name="email" label="Email" required>
        <input type="email" className="w-full rounded-md border px-3 py-2" />
      </FormField>

      <SubmitButton
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md"
        text="Submit"
        loadingText="Submitting..."
        successText="Submitted!"
      />
    </FormProvider>
  );
}
```

### Async Validation with Visual Indicators

```tsx
import { z } from 'zod';
import { FormProvider, FormField, SubmitButton } from '@qazuor/react-form-toolkit';
import type { AsyncValidateFunction } from '@qazuor/react-form-toolkit';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

// Async validation function
const checkUsername: AsyncValidateFunction = async (value) => {
  // Simulate API call to check username availability
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return true if valid, or an error message if invalid
  return value === 'admin' ? 'This username is already taken' : true;
};

function RegistrationForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={formSchema}
      defaultValues={{ username: '' }}
      mode="onChange"
    >
      <FormField
        name="username"
        label="Username"
        required
        asyncValidate={checkUsername}
        debounceTime={500}
      >
        <input type="text" className="w-full rounded-md border px-3 py-2" />
      </FormField>

      <SubmitButton className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md" />
    </FormProvider>
  );
}
```

### Custom Styled Feedback

```tsx
import { z } from 'zod';
import { FormProvider, FormField, SubmitButton } from '@qazuor/react-form-toolkit';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

// Custom styles with different visual feedback
const customStyles = {
  form: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg",
  field: {
    wrapper: "mb-5 relative",
    label: "block text-gray-800 text-sm font-semibold mb-2",
    input: "w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-purple-500 transition-all duration-300",
    error: "text-red-600 text-xs mt-1 font-medium animate-shake",
    description: "text-gray-500 text-xs mt-1 italic",
    requiredMark: "text-purple-500 ml-1",
    validating: "ml-2 text-xs text-purple-500 animate-pulse",
    valid: "absolute right-3 top-10 text-purple-500",
    invalid: "absolute right-3 top-10 text-red-500",
    loading: "absolute right-3 top-10 text-purple-500 animate-spin",
  },
};

function CustomFeedbackForm() {
  return (
    <FormProvider
      onSubmit={handleSubmit}
      schema={formSchema}
      defaultValues={{ name: '', email: '' }}
      styles={customStyles}
    >
      <FormField name="name" label="Name" required>
        <input type="text" />
      </FormField>

      <FormField name="email" label="Email" required>
        <input type="email" />
      </FormField>

      <SubmitButton
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        text="Submit"
        loadingText="Processing..."
        successText="Success!"
      />
    </FormProvider>
  );
}
```

## Best Practices

1. **Be consistent**: Use the same visual feedback patterns throughout your application
2. **Don't overdo animations**: Keep animations subtle and purposeful
3. **Provide both visual and text feedback**: Visual indicators should complement, not replace, text messages
4. **Consider mobile users**: Ensure indicators are visible and touch-friendly on small screens
5. **Test with users**: Validate that your visual feedback is intuitive and helpful
6. **Maintain accessibility**: Ensure all states are accessible to all users, including those using assistive technologies
7. **Use appropriate timing**: Quick feedback for immediate actions, longer persistence for important messages
8. **Consider cultural differences**: Some visual cues may have different meanings in different cultures

## Testing Visual Feedback

React Form Toolkit includes testing utilities to help you verify that visual feedback is working correctly:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

test('shows validation indicators for valid input', async () => {
  render(
    <FormProvider onSubmit={() => {}} mode="onChange">
      <FormField name="email" label="Email">
        <input type="email" data-testid="email-input" />
      </FormField>
    </FormProvider>
  );

  const input = screen.getByTestId('email-input');

  // Enter valid input
  fireEvent.change(input, { target: { value: 'test@example.com' } });
  fireEvent.blur(input);

  // Check for valid indicator
  await waitFor(() => {
    const validIndicator = document.querySelector('.text-green-500 svg');
    expect(validIndicator).toBeInTheDocument();
  });
});
```

By following these guidelines and leveraging the built-in visual feedback features, you can create forms that are not only functional but also provide an excellent user experience with clear, intuitive feedback at every step.
