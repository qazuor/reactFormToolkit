import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { FormProvider, FormField } from "../src/components"
import { z } from "zod"
import { expect, describe, it } from "vitest"
import React from "react"

describe("Error Positioning", () => {
  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
  })

  const renderForm = (position: "top" | "bottom" | "right" | "tooltip") => {
    return render(
      <FormProvider onSubmit={() => {}} schema={schema} defaultValues={{ name: "" }} mode="onChange">
        <FormField name="name" label="Name" errorDisplay={{ position }}>
          <input type="text" data-testid="name-input" />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </FormProvider>,
    )
  }

  it("displays error at the top position", async () => {
    renderForm("top")
    const input = screen.getByTestId("name-input")

    // Type invalid value and blur
    fireEvent.change(input, { target: { value: "ab" } })
    fireEvent.blur(input)

    // Wait for error to appear
    await waitFor(() => {
      const errorElement = screen.getByTestId("name-error")
      expect(errorElement).toBeInTheDocument()
      // Check if error has the correct class
      expect(errorElement.className).toContain("mb-1")
    })
  })

  it("displays error at the bottom position", async () => {
    renderForm("bottom")
    const input = screen.getByTestId("name-input")

    // Type invalid value and blur
    fireEvent.change(input, { target: { value: "ab" } })
    fireEvent.blur(input)

    // Wait for error to appear
    await waitFor(() => {
      const errorElement = screen.getByTestId("name-error")
      expect(errorElement).toBeInTheDocument()
      // Check if error has the correct class
      expect(errorElement.className).toContain("mt-1")
    })
  })

  it("displays error at the right position", async () => {
    renderForm("right")
    const input = screen.getByTestId("name-input")

    // Type invalid value and blur
    fireEvent.change(input, { target: { value: "ab" } })
    fireEvent.blur(input)

    // Wait for error to appear
    await waitFor(() => {
      const errorElement = screen.getByTestId("name-error")
      expect(errorElement).toBeInTheDocument()
      // Check if error has the correct class
      expect(errorElement.className).toContain("ml-2")
      expect(errorElement.className).toContain("inline-block")
    })
  })

  it("displays error as tooltip", async () => {
    renderForm("tooltip")
    const input = screen.getByTestId("name-input")

    // Type invalid value and blur
    fireEvent.change(input, { target: { value: "ab" } })
    fireEvent.blur(input)

    // Wait for error to appear
    await waitFor(() => {
      const errorElement = screen.getByTestId("name-error")
      expect(errorElement).toBeInTheDocument()
      // Check if error has the correct class
      expect(errorElement.className).toContain("absolute")
      expect(errorElement.className).toContain("z-10")
    })
  })
})

