# Botones de Formulario

El componente `FormButtonsBar` de **Qazuor React Form Toolkit** proporciona una forma consistente de renderizar botones de acción del formulario.

## Uso Básico

```tsx
import { FormButtonsBar } from '@qazuor/react-form-toolkit';

function MiFormulario() {
  return (
    <FormProvider schema={schema}>
      {/* Campos del formulario */}
      <FormButtonsBar
        direction="horizontal"
        fullWidth={false}
        onCancel={() => console.log('cancelado')}
      />
    </FormProvider>
  );
}
```

## Props

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | Dirección del layout de botones |
| `fullWidth` | `boolean` | Hacer que los botones ocupen todo el ancho |
| `className` | `string` | Clase CSS del contenedor |
| `buttonStyles` | `ButtonStyleOptions` | Estilos personalizados de botones |
| `showSubmit` | `boolean` | Mostrar botón de envío |
| `showReset` | `boolean` | Mostrar botón de reinicio |
| `showCancel` | `boolean` | Mostrar botón de cancelar |
| `submitText` | `string` | Texto personalizado del botón de envío |
| `resetText` | `string` | Texto personalizado del botón de reinicio |
| `cancelText` | `string` | Texto personalizado del botón de cancelar |
| `onCancel` | `() => void` | Manejador de cancelación |
| `children` | `ReactNode` | Botones adicionales |

## Características

### Layout de Botones

```tsx
// Layout horizontal
<FormButtonsBar direction="horizontal" />

// Layout vertical
<FormButtonsBar direction="vertical" />
```

### Estilos Personalizados

```tsx
<FormButtonsBar
  buttonStyles={{
    submit: 'bg-blue-600 hover:bg-blue-700',
    reset: 'bg-gray-200 hover:bg-gray-300',
    cancel: 'bg-red-100 hover:bg-red-200'
  }}
/>
```

### Selección de Botones

```tsx
<FormButtonsBar
  showSubmit={true}
  showReset={true}
  showCancel={false}
/>
```

### Texto Personalizado

```tsx
<FormButtonsBar
  submitText="Guardar Cambios"
  resetText="Comenzar de Nuevo"
  cancelText="Volver"
/>
```

### Botones Adicionales

```tsx
<FormButtonsBar>
  <button
    type="button"
    onClick={handlePreview}
  >
    Vista Previa
  </button>
</FormButtonsBar>
```

### Ancho Completo

```tsx
<FormButtonsBar fullWidth={true} />
```

## Componentes de Botones Individuales

Además de `FormButtonsBar`, puedes usar componentes de botones individuales:

### SubmitButton

```tsx
import { SubmitButton } from '@qazuor/react-form-toolkit';

<SubmitButton>Enviar</SubmitButton>
```

### ResetButton

```tsx
import { ResetButton } from '@qazuor/react-form-toolkit';

<ResetButton>Reiniciar</ResetButton>
```

### CancelButton

```tsx
import { CancelButton } from '@qazuor/react-form-toolkit';

<CancelButton onCancel={() => console.log('cancelado')}>
  Cancelar
</CancelButton>
```

## Estados de los Botones

### Botón de Envío

- Deshabilitado cuando:
  - El formulario tiene errores de validación
  - Las validaciones asíncronas están pendientes
  - El formulario se está enviando
- Muestra tooltips para:
  - Errores de validación
  - Validaciones pendientes
  - Estado de envío

### Botón de Reinicio

- Habilitado solo cuando el formulario está modificado
- Muestra tooltip cuando está deshabilitado
- Reinicia el formulario a los valores iniciales

### Botón de Cancelar

- Siempre habilitado
- Activa el callback `onCancel`
- Puede ocultarse con `showCancel={false}`

## Personalización

### Estilizado con Tailwind CSS

```tsx
<FormButtonsBar
  className="mt-8 space-x-4"
  buttonStyles={{
    submit: "bg-indigo-600 hover:bg-indigo-700 text-white",
    reset: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    cancel: "bg-red-100 hover:bg-red-200 text-red-800"
  }}
/>
```

### Layout de Botones Personalizado

```tsx
<div className="flex justify-between">
  <div>
    <CancelButton>Atrás</CancelButton>
  </div>
  <div className="space-x-4">
    <ResetButton>Limpiar</ResetButton>
    <SubmitButton>Continuar</SubmitButton>
  </div>
</div>
```

## Mejores Prácticas

1. **Orden Consistente de Botones**
   - Sigue las convenciones de la plataforma para el orden de botones
   - En Windows/Web: [Cancelar] [Reiniciar] [Enviar]
   - En macOS/iOS: [Enviar] [Reiniciar] [Cancelar]

2. **Etiquetas Claras de Botones**
   - Usa verbos de acción para las etiquetas de botones
   - Sé específico sobre la acción (ej., "Guardar Cambios" en lugar de "Enviar")

3. **Jerarquía Visual**
   - Haz que la acción principal (generalmente enviar) sea visualmente distinta
   - Usa color y tamaño para indicar importancia

4. **Diseño Responsivo**
   - Usa `direction="vertical"` y `fullWidth={true}` en pantallas pequeñas
   - Considera usar media queries para ajustar el layout de botones

## Componentes Relacionados

- [FormProvider](/docs/form-provider) - El componente padre para todos los campos del formulario
- [FormField](/docs/form-field) - Para renderizar campos individuales del formulario

## Ejemplos

Consulta la [sección de ejemplos](/examples/basic) para ver FormButtonsBar en acción.
