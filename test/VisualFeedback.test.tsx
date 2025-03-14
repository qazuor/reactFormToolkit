import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { FormField, FormProvider } from "../src"
import type { AsyncValidateFunction } from "../src/types/validation"
import React from "react"

describe("Visual Feedback", () => {
  it("shows validation indicators for valid input", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} mode="onChange">
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
      </FormProvider>,
    )

    const input = screen.getByTestId("name-input")

    // Enter valid input
    fireEvent.change(input, { target: { value: "John Doe" } })
    // Importante: disparar el evento blur para marcar el campo como "touched"
    fireEvent.blur(input)

    // Esperar a que se complete la validación y verificar que no hay errores
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })

    // En lugar de buscar por data-testid, buscar cualquier elemento con la clase de estilo válido
    await waitFor(
      () => {
        const validIndicator = screen.queryByTestId("valid-indicator")
        expect(validIndicator).toBeInTheDocument()
      },
      { timeout: 1000 },
    )
  })

  it("shows validation indicators for invalid input", async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} mode="onChange">
        <FormField name="name" label="Name">
          <input type="text" data-testid="name-input" />
        </FormField>
      </FormProvider>,
    )

    const input = screen.getByTestId("name-input")

    // Enter invalid input
    fireEvent.change(input, { target: { value: "Jo" } })
    fireEvent.blur(input)

    // Check for invalid indicator (SVG X mark)
    await waitFor(() => {
      const svg = document.querySelector('svg line[x1="18"][y1="6"][x2="6"][y2="18"]')
      expect(svg).toBeInTheDocument()
    })

    // Check for error message
    await waitFor(() => {
      const errorElement = screen.getByRole("alert")
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent("Name must be at least 3 characters")
    })
  })

  it("shows loading indicator during async validation", async () => {
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

    // Check for loading indicator
    await waitFor(() => {
      const svg = document.querySelector('svg path[d="M21 12a9 9 0 1 1-6.219-8.56"]')
      expect(svg).toBeInTheDocument()
    })

    // Wait for validation to complete
    await waitFor(() => {
      expect(asyncValidate).toHaveBeenCalledWith("testuser")
    })
  })

  it("applies animation classes to error messages", async () => {
    const schema = z.object({
      email: z.string().email("Please enter a valid email"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema}>
        <FormField name="email" label="Email">
          <input type="email" data-testid="email-input" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    const input = screen.getByTestId("email-input")

    // Enter invalid email
    fireEvent.change(input, { target: { value: "invalid-email" } })

    // Submit form to trigger validation
    fireEvent.click(screen.getByText("Submit"))

    // Check for error message with animation class
    await waitFor(() => {
      const errorElement = screen.getByRole("alert")
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent("Please enter a valid email")
      expect(errorElement).toHaveClass("animate-fadeIn")
    })
  })
})

