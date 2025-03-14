# Form Field Tooltips

## Table of Contents

- [Introduction](#introduction)
- [Basic Usage](#basic-usage)
- [Tooltip Positioning](#tooltip-positioning)
- [Customizing Tooltips](#customizing-tooltips)
  - [Styling](#styling)
  - [Behavior](#behavior)
  - [Styling Tooltips](#styling-tooltips)
  - [Tooltip Positioning](#tooltip-positioning-1)
  - [Animations](#animations)
- [Accessibility](#accessibility)
- [Examples](#examples)
  - [Simple Tooltip](#simple-tooltip)
  - [Custom Styled Tooltip](#custom-styled-tooltip)
  - [Form with Multiple Tooltips](#form-with-multiple-tooltips)
- [API Reference](#api-reference)

## Introduction

Form field tooltips provide a way to display additional information or guidance to users without cluttering the form interface. They are particularly useful for explaining complex fields, providing format requirements, or offering context about how the information will be used.

React Form Toolkit makes it easy to add tooltips to any form field through the `tooltip` prop on the `FormField` component.

## Basic Usage

To add a tooltip to a form field, simply include the `tooltip` prop with the content you want to display:

```tsx
<FormField
  name="password"
  label="Password"
  tooltip="Password must be at least 8 characters and include uppercase letters, numbers, and symbols."
>
  <input type="password" />
</FormField>
```

## Customizing Tooltips

You can customize the appearance and behavior of tooltips in your forms. This includes styling, positioning, and animations.

### Tooltip Positioning
You can control where the tooltip appears relative to the form field:

```tsx
<FormField
  name="username"
  label="Username"
  tooltip="Choose a unique username"
  tooltipPosition="top"
>
  <input type="text" />
</FormField>
```

## Accessibility

## Examples

### Simple Tooltip

### Custom Styled Tooltip

### Form with Multiple Tooltips

## API Reference
