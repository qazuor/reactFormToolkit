import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormProvider, CancelButton } from "../src"
import React from "react"

// Crear un mock completo del objeto form
const createMockForm = (isDirty = false) => ({
  reset: vi.fn(),
  handleSubmit: vi.fn().mockImplementation((cb) => cb),
  formState: {
    errors: {},
    isSubmitting: false,
    isSubmitSuccessful: false,
    isDirty: isDirty,
  },
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  control: { register: vi.fn() },
})

describe("CancelButton", () => {
  it("renders with default text", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <CancelButton onCancel={() => {}} />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("renders with custom text", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <CancelButton text="Go Back" onCancel={() => {}} />
      </FormProvider>,
    )

    expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument()
  })

  it("calls onCancel when clicked", async () => {
    const onCancelMock = vi.fn()

    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <CancelButton onCancel={onCancelMock} />
      </FormProvider>,
    )

    fireEvent.click(screen.getByText("Cancel"))

    expect(onCancelMock).toHaveBeenCalled()
  })

  it("shows confirmation when confirmCancel is true and form is dirty", async () => {
    const onCancelMock = vi.fn()
    const mockForm = createMockForm(true) // form is dirty

    render(
      <FormProvider onSubmit={() => {}} form={mockForm}>
        <CancelButton confirmCancel={true} confirmText="Are you sure?" onCancel={onCancelMock} />
      </FormProvider>,
    )

    // First click should show confirmation
    fireEvent.click(screen.getByText("Cancel"))

    // Button text should change to confirmation text
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    // onCancel should not have been called yet
    expect(onCancelMock).not.toHaveBeenCalled()

    // Second click should trigger onCancel
    fireEvent.click(screen.getByText("Are you sure?"))

    expect(onCancelMock).toHaveBeenCalled()
  })

  it("does not show confirmation when form is not dirty", async () => {
    const onCancelMock = vi.fn()
    const mockForm = createMockForm(false) // form is not dirty

    render(
      <FormProvider onSubmit={() => {}} form={mockForm}>
        <CancelButton confirmCancel={true} onCancel={onCancelMock} />
      </FormProvider>,
    )

    // Click should immediately trigger onCancel without confirmation
    fireEvent.click(screen.getByText("Cancel"))

    expect(onCancelMock).toHaveBeenCalled()
  })
})

