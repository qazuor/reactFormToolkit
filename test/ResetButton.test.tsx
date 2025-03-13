import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormProvider, ResetButton } from "../src"
import React from "react"

// Crear un mock completo del objeto form
const createMockForm = (resetFn = vi.fn()) => ({
  reset: resetFn,
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

describe("ResetButton", () => {
  it("renders with default text", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <ResetButton />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument()
  })

  it("renders with custom text", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <ResetButton text="Clear Form" />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Clear Form" })).toBeInTheDocument()
  })

  it("calls form.reset when clicked", async () => {
    const mockReset = vi.fn()
    const mockForm = createMockForm(mockReset)

    render(
      <FormProvider onSubmit={() => {}} form={mockForm}>
        <ResetButton data-testid="reset-button" />
      </FormProvider>,
    )

    fireEvent.click(screen.getByTestId("reset-button"))

    expect(mockReset).toHaveBeenCalled()
  })

  it("shows confirmation when confirmReset is true", async () => {
    const mockReset = vi.fn()
    const mockForm = createMockForm(mockReset)

    render(
      <FormProvider onSubmit={() => {}} form={mockForm}>
        <ResetButton confirmReset={true} confirmText="Are you sure?" />
      </FormProvider>,
    )

    // First click should show confirmation
    fireEvent.click(screen.getByText("Reset"))

    // Button text should change to confirmation text
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    // Reset should not have been called yet
    expect(mockReset).not.toHaveBeenCalled()

    // Second click should trigger reset
    fireEvent.click(screen.getByText("Are you sure?"))

    expect(mockReset).toHaveBeenCalled()
  })

  it("calls onReset callback when provided", async () => {
    const mockReset = vi.fn()
    const onResetCallback = vi.fn()
    const mockForm = createMockForm(mockReset)

    render(
      <FormProvider onSubmit={() => {}} form={mockForm}>
        <ResetButton onReset={onResetCallback} />
      </FormProvider>,
    )

    fireEvent.click(screen.getByText("Reset"))

    expect(mockReset).toHaveBeenCalled()
    expect(onResetCallback).toHaveBeenCalled()
  })
})

