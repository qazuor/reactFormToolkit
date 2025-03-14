import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { z } from "zod"
import { FormField, FormProvider } from "../src"
import React from "react"

describe("Error Display System", () => {
  it("displays errors with default bottom position", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} mode="onChange">
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    const input = screen.getByTestId("name-input")

    // Enter invalid input
    fireEvent.change(input, { target: { value: "ab" } })
    fireEvent.blur(input)

    // Wait for error message to appear
    await waitFor(() => {
      const errorElement = screen.getByRole("alert")
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent("Name must be at least 3 characters")
      expect(errorElement.className).toContain("mt-1") // bottom position class
    })
  })

  it("displays errors with custom right position", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} mode="onChange" errorDisplay={{ position: "right" }}>
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    const input = screen.getByTestId("name-input")

    // Enter invalid input
    fireEvent.change(input, { target: { value: "ab" } })
    fireEvent.blur(input)

    // Wait for error message to appear
    await waitFor(() => {
      const errorElement = screen.getByRole("alert")
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent("Name must be at least 3 characters")
      expect(errorElement.className).toContain("ml-2") // right position class
    })
  })

  it("displays errors with field-specific position overriding global settings", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email format"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} mode="onChange" errorDisplay={{ position: "bottom" }}>
        <FormField name="name" label="Name" errorDisplay={{ position: "right" }}>
          <input type="text" data-testid="name-input" />
        </FormField>
        <FormField name="email" label="Email">
          <input type="email" data-testid="email-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    // Test name field with right position
    const nameInput = screen.getByTestId("name-input")
    fireEvent.change(nameInput, { target: { value: "ab" } })
    fireEvent.blur(nameInput)

    // Wait for name error message to appear
    await waitFor(() => {
      const nameError = screen.getByTestId("name-error")
      expect(nameError).toBeInTheDocument()
      expect(nameError).toHaveTextContent("Name must be at least 3 characters")
      expect(nameError.className).toContain("ml-2") // right position
    })

    // Test email field with bottom position (global setting)
    const emailInput = screen.getByTestId("email-input")

    // Submit the form to trigger validation for email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } })
    fireEvent.click(screen.getByText("Submit"))

    // Wait for email error message to appear
    await waitFor(() => {
      const errorElements = screen.getAllByRole("alert")
      const emailError = errorElements.find((el) => el.textContent?.includes("Invalid email format"))
      expect(emailError).toBeInTheDocument()
      expect(emailError?.className).toContain("mt-1") // bottom position
    })
  })

  it("groups errors when groupErrors is enabled", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email format"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} errorDisplay={{ groupErrors: true }}>
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
        <FormField name="email" label="Email">
          <input type="email" data-testid="email-input" />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </FormProvider>,
    )

    // Submit the form with empty fields
    fireEvent.click(screen.getByTestId("submit-button"))

    // Wait for error group to appear
    await waitFor(() => {
      const errorGroup = screen.getByRole("alert")
      expect(errorGroup).toBeInTheDocument()
      expect(errorGroup).toHaveTextContent(/Please correct the following errors/i)
    })

    // Check that errors are in the list
    const errorList = screen.getByRole("list")
    expect(errorList).toBeInTheDocument()
    expect(errorList.children.length).toBeGreaterThan(0)
  })

  it("limits the number of errors shown when maxErrors is set", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email format"),
      age: z.number().min(18, "Must be at least 18 years old"),
      phone: z.string().min(10, "Phone number must be at least 10 digits"),
    })

    render(
      <FormProvider
        onSubmit={() => {}}
        schema={schema}
        errorDisplay={{ groupErrors: true, maxErrors: 2 }}
        defaultValues={{ name: "", email: "", age: 0, phone: "" }}
      >
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
        <FormField name="email" label="Email">
          <input type="email" data-testid="email-input" />
        </FormField>
        <FormField name="age" label="Age">
          <input type="number" data-testid="age-input" />
        </FormField>
        <FormField name="phone" label="Phone">
          <input type="tel" data-testid="phone-input" />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </FormProvider>,
    )

    // Submit the form with empty fields
    fireEvent.click(screen.getByTestId("submit-button"))

    // Wait for error group to appear
    await waitFor(() => {
      const errorGroup = screen.getByRole("alert")
      expect(errorGroup).toBeInTheDocument()
    })

    // Only 2 errors should be shown plus the "more errors" message
    const errorList = screen.getByRole("list")
    expect(errorList.children.length).toBe(3) // 2 errors + "And X more errors" message

    // Should show "more errors" message
    expect(screen.getByText(/And 2 more error/)).toBeInTheDocument()
  })
})

