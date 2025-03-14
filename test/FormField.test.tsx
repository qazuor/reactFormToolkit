import { fireEvent, render, screen, waitFor } from "@testing-library/react"
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react"
import { describe, expect, it } from "vitest"
import { FormField, FormProvider } from "../src"
import { useFormContext } from "../src/context/FormContext"

const FieldValue = ({ name }: { name: string }) => {
  const { form } = useFormContext()
  const value = form.watch(name)
  return <span data-testid={`${name}-value`}>{typeof value === "boolean" ? (value ? "true" : "false") : value}</span>
}

describe("FormField", () => {
  it("renders input with label and handles changes", async () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="name" label="Name">
          <input type="text" />
        </FormField>
        <FieldValue name="name" />
      </FormProvider>,
    )

    const input = screen.getByLabelText("Name")
    fireEvent.change(input, { target: { value: "John Doe" } })

    await waitFor(() => {
      expect(screen.getByTestId("name-value")).toHaveTextContent("John Doe")
    })
  })

  it("renders select field correctly", async () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="color" label="Favorite Color">
          <select>
            <option value="">Choose a color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
          </select>
        </FormField>
        <FieldValue name="color" />
      </FormProvider>,
    )

    const select = screen.getByLabelText("Favorite Color")
    fireEvent.change(select, { target: { value: "blue" } })

    await waitFor(() => {
      expect(screen.getByTestId("color-value")).toHaveTextContent("blue")
    })
  })

  it("renders checkbox field correctly", async () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="agree" label="I agree to terms">
          <input type="checkbox" />
        </FormField>
        <FieldValue name="agree" />
      </FormProvider>,
    )

    const checkbox = screen.getByLabelText("I agree to terms")
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(screen.getByTestId("agree-value")).toHaveTextContent("true")
    })
  })

  it("displays field description", () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="email" label="Email" description="Enter your best email address">
          <input type="email" />
        </FormField>
      </FormProvider>,
    )

    // Use queryAllByText to get all elements with the description text
    const descriptionElements = screen.queryAllByText("Enter your best email address")
    // Ensure there's exactly one description element
    expect(descriptionElements.length).toBe(1)
    // Ensure the description is in the document
    expect(descriptionElements[0]).toBeInTheDocument()
  })

  it("marks required fields", () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="username" label="Username" required={true}>
          <input type="text" />
        </FormField>
      </FormProvider>,
    )

    const label = screen.getByText("Username")
    expect(label.textContent).toContain("*")
  })

  it("renders tooltip when tooltip prop is provided", () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="password" label="Password" tooltip="Password must be at least 8 characters long">
          <input type="password" />
        </FormField>
      </FormProvider>,
    )

    // Find the info icon button
    const infoButton = screen.getByRole("button", { name: "More information" })
    expect(infoButton).toBeInTheDocument()

    // Hover over the info icon to show the tooltip
    fireEvent.mouseEnter(infoButton)

    // Check if tooltip content is visible
    const tooltipContent = screen.getByRole("tooltip")
    expect(tooltipContent).toBeInTheDocument()
    expect(tooltipContent).toHaveTextContent("Password must be at least 8 characters long")
  })

  it("positions tooltip according to tooltipPosition prop", () => {
    render(
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      <FormProvider onSubmit={() => {}}>
        <FormField name="email" label="Email" tooltip="We'll use this email for verification" tooltipPosition="right">
          <input type="email" />
        </FormField>
      </FormProvider>,
    )

    // Find the info icon button
    const infoButton = screen.getByRole("button", { name: "More information" })

    // Hover over the info icon to show the tooltip
    fireEvent.mouseEnter(infoButton)

    // Check if tooltip content is visible with the right position
    const tooltipContent = screen.getByRole("tooltip")
    expect(tooltipContent).toBeInTheDocument()

    // Check if the tooltip has the right position class
    // This is a simplified check - in a real test you might want to check the actual positioning
    expect(tooltipContent.className).toContain("left-full")
  })
})

