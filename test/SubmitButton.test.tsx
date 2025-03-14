import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormProvider, SubmitButton } from "../src"
import React from "react"

// Crear un mock completo del objeto form
const createMockForm = (isSubmitting = false, isSubmitSuccessful = false) => ({
  reset: vi.fn(),
  handleSubmit: vi.fn().mockImplementation((cb) => cb),
  formState: {
    errors: {},
    isSubmitting: isSubmitting,
    isSubmitSuccessful: isSubmitSuccessful,
    isDirty: false,
  },
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  control: { register: vi.fn() },
})

describe("SubmitButton", () => {
  it("renders with default text", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <SubmitButton />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
  })

  it("renders with custom text", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <SubmitButton text="Save Changes" />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument()
  })

  it("shows loading state during form submission", async () => {
    const handleSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    render(
      <FormProvider onSubmit={handleSubmit}>
        <SubmitButton text="Submit" loadingText="Submitting..." />
        <button type="submit" data-testid="form-submit">
          Hidden Submit
        </button>
      </FormProvider>,
    )

    // Use the hidden submit button to trigger form submission
    fireEvent.click(screen.getByTestId("form-submit"))

    // Check if loading text appears
    await waitFor(() => {
      expect(screen.getByText("Submitting...")).toBeInTheDocument()
    })

    // Wait for submission to complete
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

   it("shows success state after successful submission", async () => {
    // Create a mock form with isSubmitSuccessful set to true
    const mockForm = createMockForm(false, true)

    render(
      <FormProvider onSubmit={() => {}} form={mockForm}>
        <SubmitButton text="Submit" successText="Success!" successDuration={500} showSuccess={true} />
      </FormProvider>,
    )

    // Success state should be shown immediately since isSubmitSuccessful is true
    expect(screen.getByText("Success!")).toBeInTheDocument()

    // Check if button returns to normal state after success duration
    await waitFor(
      () => {
        expect(screen.getByText("Submit")).toBeInTheDocument()
      },
      { timeout: 1000 },
    )
  })

  it("is disabled during form submission", async () => {
    const handleSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 500)))

    render(
      <FormProvider onSubmit={handleSubmit}>
        <SubmitButton data-testid="submit-button" text="Submit" />
        <button type="submit" data-testid="form-submit">
          Hidden Submit
        </button>
      </FormProvider>,
    )

    // Use the hidden submit button to trigger form submission
    fireEvent.click(screen.getByTestId("form-submit"))

    // Check if button is disabled - use getByTestId instead of getByRole
    await waitFor(
      () => {
        expect(screen.getByTestId("submit-button")).toBeDisabled()
      },
      { timeout: 300 },
    ) // Reduced timeout to catch it in the loading state

    // Wait for submission to complete
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

