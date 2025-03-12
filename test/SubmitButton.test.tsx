import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormProvider, SubmitButton } from "../src"
import React from "react"

describe("SubmitButton", () => {
  it("renders with default text", () => {
    render(
      <FormProvider onSubmit={() => {}}>
        <SubmitButton />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
  })

  it("renders with custom text", () => {
    render(
      <FormProvider onSubmit={() => {}}>
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
    const handleSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    render(
      <FormProvider onSubmit={handleSubmit}>
        <SubmitButton text="Submit" successText="Success!" successDuration={500} />
        <button type="submit" data-testid="form-submit">
          Hidden Submit
        </button>
      </FormProvider>,
    )

    // Use the hidden submit button to trigger form submission
    fireEvent.click(screen.getByTestId("form-submit"))

    // Wait for submission to complete
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })

    // Check if success text appears
    await waitFor(() => {
      expect(screen.getByText("Success!")).toBeInTheDocument()
    })

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

