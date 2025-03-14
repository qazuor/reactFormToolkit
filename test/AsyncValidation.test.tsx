import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormField, FormProvider } from "../src"
import type { AsyncValidateFunction } from "../src/types/validation"
import React from "react"

describe("Async Validation", () => {
  it("handles async validation correctly", async () => {
    // Mock async validation function
    const asyncValidate: AsyncValidateFunction = vi.fn().mockImplementation(async (value) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return value !== "taken" ? true : "This value is already taken"
    })

    render(
      <FormProvider onSubmit={() => {}} mode="onChange">
        <FormField
          name="username"
          label="Username"
          asyncValidate={asyncValidate}
          debounceTime={0} // Set to 0 for testing
        >
          <input type="text" data-testid="username-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    const input = screen.getByTestId("username-input")

    // Enter a value that will fail validation
    fireEvent.change(input, { target: { value: "taken" } })
    fireEvent.blur(input)

    // Wait for validation error to appear
    await waitFor(() => {
      const errorElement = screen.getByRole("alert")
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent("This value is already taken")
    })

    // Change to a valid value
    fireEvent.change(input, { target: { value: "available" } })
    fireEvent.blur(input)

    // Wait for validation to pass
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })
  })

  it("shows validating state during async validation", async () => {
    // Mock async validation function with delay
    const asyncValidate: AsyncValidateFunction = vi.fn().mockImplementation(async (value) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return true
    })

    render(
      <FormProvider onSubmit={() => {}} mode="onChange">
        <FormField
          name="username"
          label="Username"
          asyncValidate={asyncValidate}
          debounceTime={0} // Set to 0 for testing
        >
          <input type="text" data-testid="username-input" />
        </FormField>
      </FormProvider>,
    )

    const input = screen.getByTestId("username-input")

    // Enter input to trigger async validation
    fireEvent.change(input, { target: { value: "testuser" } })

    // Check for validating text
    expect(screen.getByText("Validating...")).toBeInTheDocument()

    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.queryByText("Validating...")).not.toBeInTheDocument()
    })
  })
})

