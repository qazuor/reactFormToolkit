import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormProvider, FormError } from "../src"
import React from "react"

// Crear un mock completo del objeto form
const createMockForm = () => ({
  reset: vi.fn(),
  handleSubmit: vi.fn().mockImplementation((cb) => cb),
  formState: {
    errors: {},
    isSubmitting: false,
    isSubmitSuccessful: false,
    isDirty: false,
  },
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  control: { register: vi.fn() },
})

describe("FormError", () => {
  it("renders nothing when there is no error", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <FormError data-testid="form-error" />
      </FormProvider>,
    )

    expect(screen.queryByTestId("form-error")).not.toBeInTheDocument()
  })

  it("renders global error when present", async () => {
    const errorMessage = "Server error occurred"

    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <FormError data-testid="form-error" error={errorMessage} />
      </FormProvider>,
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("renders with custom className", () => {
    const errorMessage = "Custom error"
    const customClass = "my-custom-error-class"

    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <FormError error={errorMessage} className={customClass} data-testid="form-error" />
      </FormProvider>,
    )

    const errorElement = screen.getByTestId("form-error")
    expect(errorElement).toHaveClass(customClass)
    expect(errorElement).toHaveTextContent(errorMessage)
  })

  it("renders without icon when showIcon is false", () => {
    const errorMessage = "Error without icon"

    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <FormError error={errorMessage} showIcon={false} />
      </FormProvider>,
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(document.querySelector("svg")).toBeNull()
  })
})

