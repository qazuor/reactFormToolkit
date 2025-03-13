import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FormProvider } from "../src"
import { InfoTooltip } from "../src/components/InfoTooltip"
import React from "react"

// Create a mock form object
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

describe("InfoTooltip", () => {
  it("renders the info icon", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <InfoTooltip content="Test tooltip" data-testid="info-tooltip" />
      </FormProvider>,
    )

    const tooltipIcon = screen.getByTestId("info-tooltip")
    expect(tooltipIcon).toBeInTheDocument()
  })

  it("shows tooltip content on hover", async () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <InfoTooltip content="Test tooltip content" data-testid="info-tooltip" />
      </FormProvider>,
    )

    // Find the icon button
    const iconButton = screen.getByRole("button", { name: "More information" })

    // Hover over the icon
    fireEvent.mouseEnter(iconButton)

    // Check if tooltip content is visible
    const tooltipContent = screen.getByRole("tooltip")
    expect(tooltipContent).toBeInTheDocument()
    expect(tooltipContent).toHaveTextContent("Test tooltip content")
  })

  it("hides tooltip content on mouse leave", async () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <InfoTooltip content="Test tooltip content" data-testid="info-tooltip" />
      </FormProvider>,
    )

    // Find the icon button
    const iconButton = screen.getByRole("button", { name: "More information" })

    // Hover over the icon
    fireEvent.mouseEnter(iconButton)

    // Check if tooltip content is visible
    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    // Mouse leave
    fireEvent.mouseLeave(iconButton)

    // Check if tooltip content is hidden
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("shows tooltip content on focus", async () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <InfoTooltip content="Test tooltip content" data-testid="info-tooltip" />
      </FormProvider>,
    )

    // Find the icon button
    const iconButton = screen.getByRole("button", { name: "More information" })

    // Focus the icon
    fireEvent.focus(iconButton)

    // Check if tooltip content is visible
    const tooltipContent = screen.getByRole("tooltip")
    expect(tooltipContent).toBeInTheDocument()
    expect(tooltipContent).toHaveTextContent("Test tooltip content")
  })

  it("hides tooltip content on blur", async () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <InfoTooltip content="Test tooltip content" data-testid="info-tooltip" />
      </FormProvider>,
    )

    // Find the icon button
    const iconButton = screen.getByRole("button", { name: "More information" })

    // Focus the icon
    fireEvent.focus(iconButton)

    // Check if tooltip content is visible
    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    // Blur the icon
    fireEvent.blur(iconButton)

    // Check if tooltip content is hidden
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("applies custom classes", () => {
    render(
      <FormProvider onSubmit={() => {}} form={createMockForm()}>
        <InfoTooltip
          content="Test tooltip"
          className="custom-container"
          iconClassName="custom-icon"
          contentClassName="custom-content"
          data-testid="info-tooltip"
        />
      </FormProvider>,
    )

    // Find the tooltip container
    const container = screen.getByTestId("info-tooltip")
    expect(container).toHaveClass("custom-container")

    // Find the icon
    const iconButton = screen.getByRole("button", { name: "More information" })
    expect(iconButton).toHaveClass("custom-icon")

    // Show the tooltip
    fireEvent.mouseEnter(iconButton)

    // Find the tooltip content
    const content = screen.getByRole("tooltip")
    expect(content).toHaveClass("custom-content")
  })
})

