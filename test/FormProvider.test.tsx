import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { FormField, FormProvider } from "../src"
import React from "react"

describe("FormProvider", () => {
  it("renders form and handles submission", async () => {
    const handleSubmit = vi.fn()
    const schema = z.object({
      name: z.string().min(3, "Name too short"),
      email: z.string().email("Invalid email"),
    })

    render(
      <FormProvider onSubmit={handleSubmit} schema={schema} defaultValues={{ name: "John", email: "john@example.com" }}>
        <FormField name="name" label="Name">
          <input type="text" />
        </FormField>
        <FormField name="email" label="Email">
          <input type="email" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    // Form should be rendered
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()

    // Submit the form
    fireEvent.click(screen.getByText("Submit"))

    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ name: "John", email: "john@example.com" }, expect.anything())
    })
  })

  it("shows validation errors", async () => {
    const handleSubmit = vi.fn()
    const schema = z.object({
      name: z.string().min(3, "Name too short"),
      email: z.string().email("Invalid email"),
    })

    render(
      <FormProvider onSubmit={handleSubmit} schema={schema} defaultValues={{ name: "", email: "" }}>
        <FormField name="name" label="Name">
          <input type="text" />
        </FormField>
        <FormField name="email" label="Email">
          <input type="email" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    // Submit the form with empty fields
    fireEvent.click(screen.getByText("Submit"))

    // Check for validation errors
    await waitFor(() => {
      const errorElements = screen.getAllByRole("alert")
      expect(errorElements.length).toBeGreaterThan(0)

      // Check error content
      const errorTexts = errorElements.map((el) => el.textContent)
      expect(errorTexts.some((text) => text?.includes("Name too short"))).toBe(true)
      expect(errorTexts.some((text) => text?.includes("Invalid email"))).toBe(true)
    })

    // onSubmit should not be called when validation fails
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it("resets form when resetOnSubmit is true", async () => {
    const handleSubmit = vi.fn()
    const schema = z.object({
      name: z.string().min(3, "Name too short"),
    })

    render(
      <FormProvider onSubmit={handleSubmit} schema={schema} defaultValues={{ name: "John" }} resetOnSubmit={true}>
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    const input = screen.getByTestId("name-input")

    // Change input value
    fireEvent.change(input, { target: { value: "Jane" } })
    expect(input).toHaveValue("Jane")

    // Submit the form
    fireEvent.click(screen.getByText("Submit"))

    // Check if form was reset to default values
    await waitFor(() => {
      expect(input).toHaveValue("John")
    })
  })

  it("handles submission errors and displays global error", async () => {
    const errorMessage = "Server error occurred"
    const handleSubmit = vi.fn().mockRejectedValue(new Error(errorMessage))
    const schema = z.object({
      name: z.string().min(3, "Name too short"),
    })

    render(
      <FormProvider onSubmit={handleSubmit} schema={schema} defaultValues={{ name: "John" }}>
        <FormField name="name" label="Name">
          <input type="text" />
        </FormField>
        <button type="submit">Submit</button>
        <div data-testid="global-error" role="alert">
          {/* This will be populated by the FormError component */}
        </div>
      </FormProvider>,
    )

    // Submit the form
    fireEvent.click(screen.getByText("Submit"))

    // Check if global error is displayed
    await waitFor(() => {
      expect(screen.getByTestId("global-error")).toBeInTheDocument()
    })
  })
})

