"use client"

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, beforeEach } from "vitest"
import { z } from "zod"
import { FormField, FormProvider } from "../src"
import i18n from "../src/i18n"
import React from "react"

// Reset i18n before each test
beforeEach(() => {
  i18n.changeLanguage("en")
})

describe("Internationalization (i18n)", () => {
  it("uses default English translations", async () => {
    const schema = z.object({
      name: z.string().min(2, "Name too short"),
    })

    render(
      <FormProvider onSubmit={() => {}} schema={schema} defaultValues={{ name: "" }}>
        <FormField name="name" label="Name" required={true}>
          <input type="text" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    // Check if required mark is rendered with default English translation
    expect(screen.getByText("Name")).toBeInTheDocument()

    // Buscar el span dentro del label
    const label = screen.getByText("Name").closest("label")
    const requiredMark = label?.querySelector("span")
    expect(requiredMark).toBeInTheDocument()
    expect(requiredMark?.textContent).toBe("*")

    // Submit the form to trigger validation
    fireEvent.click(screen.getByText("Submit"))

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText("Name too short")).toBeInTheDocument()
    })
  })

  it("uses Spanish translations when specified", async () => {
    const schema = z.object({
      name: z.string().min(2, "Nombre demasiado corto"),
    })

    // Definir traducciones personalizadas directamente en la prueba
    const customResources = {
      es: {
        translation: {
          field: {
            requiredMark: "(obligatorio)",
          },
        },
      },
    }

    render(
      <FormProvider
        onSubmit={() => {}}
        schema={schema}
        defaultValues={{ name: "" }}
        i18n={{
          lng: "es",
          resources: customResources,
        }}
      >
        <FormField name="name" label="Nombre" required={true}>
          <input type="text" />
        </FormField>
        <button type="submit">Enviar</button>
      </FormProvider>,
    )

    // Verificar el texto real que aparece en el DOM
    const label = screen.getByText("Nombre").closest("label")
    const requiredMark = label?.querySelector("span")
    expect(requiredMark).toBeInTheDocument()
    expect(requiredMark?.textContent).toBe("(obligatorio)")

    // Submit the form to trigger validation
    fireEvent.click(screen.getByText("Enviar"))

    // Wait for validation error - using the error message from the schema
    await waitFor(() => {
      expect(screen.getByText("Nombre demasiado corto")).toBeInTheDocument()
    })
  })

  it("allows custom translations", async () => {
    // Create a simple mock schema with custom error message
    const schema = z.object({
      name: z.string().min(2, "Custom error message"),
    })

    render(
      <FormProvider
        onSubmit={() => {}}
        schema={schema}
        defaultValues={{ name: "" }}
        i18n={{
          lng: "en",
          resources: {
            en: {
              translation: {
                field: {
                  requiredMark: "(required)",
                },
              },
            },
          },
        }}
      >
        <FormField name="name" label="Name" required={true}>
          <input type="text" />
        </FormField>
        <button type="submit">Submit</button>
      </FormProvider>,
    )

    // Verificar el texto real que aparece en el DOM
    const label = screen.getByText("Name").closest("label")
    const requiredMark = label?.querySelector("span")
    expect(requiredMark).toBeInTheDocument()
    expect(requiredMark?.textContent).toBe("(required)")

    // Submit the form to trigger validation
    fireEvent.click(screen.getByText("Submit"))

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText("Custom error message")).toBeInTheDocument()
    })
  })
})

