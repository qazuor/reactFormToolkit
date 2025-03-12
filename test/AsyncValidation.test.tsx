"use client"

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { FormField, FormProvider } from "../src"
import type { AsyncValidateFunction } from "../src/types"

describe("Async Validation", () => {
  it("handles async validation correctly", async () => {
    // Mock async validation function
    const asyncValidate: AsyncValidateFunction = vi.fn().mockImplementation(async (value) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100))
      return value === "taken" ? "This value is already taken" : true
    })

    const schema = z.object({
      username: z.string().min(2, "Username too short"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} defaultValues={{ username: "" }} mode="onChange">
        <FormField name="username" label="Username" asyncValidate={asyncValidate} debounceTime={100}>
          <input type="text" data-testid="username-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    // Use getByTestId instead of getByLabelText
    const usernameInput = screen.getByTestId("username-input")

    // Enter a value that will pass validation
    fireEvent.change(usernameInput, { target: { value: "available" } })

    // Wait for validation to complete
    await waitFor(() => {
      expect(asyncValidate).toHaveBeenCalledWith("available")
    })

    // Enter a value that will fail validation
    fireEvent.change(usernameInput, { target: { value: "taken" } })

    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText("This value is already taken")).toBeInTheDocument()
    })
  })

  it("shows validating state during async validation", async () => {
    // Mock async validation function with longer delay
    const asyncValidate: AsyncValidateFunction = vi.fn().mockImplementation(async (value) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return true
    })

    render(
      <FormProvider onSubmit={() => {}} defaultValues={{ username: "" }} mode="onChange">
        <FormField
          name="username"
          label="Username"
          asyncValidate={asyncValidate}
          debounceTime={0} // Set debounce to 0 for testing
        >
          <input type="text" data-testid="username-input" />
        </FormField>
      </FormProvider>,
    )

    // Use getByTestId instead of getByLabelText
    const usernameInput = screen.getByTestId("username-input")

    // Enter a value to trigger validation
    fireEvent.change(usernameInput, { target: { value: "testuser" } })

    // Use findByText instead of getByText to wait for the element to appear
    const validatingMessage = await screen.findByText("Validating...", {}, { timeout: 1000 })
    expect(validatingMessage).toBeInTheDocument()

    // Wait for validation to complete
    await waitFor(
      () => {
        expect(asyncValidate).toHaveBeenCalledWith("testuser")
      },
      { timeout: 1000 },
    )

    // Wait for the validating message to disappear
    await waitFor(
      () => {
        expect(screen.queryByText("Validating...")).not.toBeInTheDocument()
      },
      { timeout: 1000 },
    )
  })
})

