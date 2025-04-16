# Validación

**Qazuor React Form Toolkit** proporciona capacidades de validación completas a través de la integración con Zod y características adicionales para validación asíncrona, visualización de errores y más.

## Validación de Esquema con Zod

La forma principal de validar formularios es a través de esquemas Zod:

```tsx
import { z } from 'zod';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede exceder 20 caracteres'),
  email: z.string()
    .email('Por favor ingresa una dirección de correo válida'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
});

function FormularioRegistro() {
  return (
    <FormProvider schema={schema} onSubmit={handleSubmit}>
      <FormField name="username" label="Nombre de Usuario">
        <input type="text" />
      </FormField>

      <FormField name="email" label="Correo Electrónico">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Contraseña">
        <input type="password" />
      </FormField>

      <button type="submit">Registrarse</button>
    </FormProvider>
  );
}
```

## Modos de Validación

Puedes controlar cuándo ocurre la validación usando la prop `mode`:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  mode="onChange" // Validar en cada cambio
>
  {/* Campos del formulario */}
</FormProvider>
```

Modos disponibles:
- `onBlur`: Validar cuando los campos pierden el foco (predeterminado)
- `onChange`: Validar en cada cambio
- `onSubmit`: Validar solo en el envío del formulario
- `onTouched`: Validar cuando los campos pierden el foco o cambian
- `all`: Validar en todos los eventos

## Validación Asíncrona

Para validaciones que requieren interacción con el servidor (como verificar si un nombre de usuario está disponible), usa validación asíncrona:

```tsx
<FormField
  name="username"
  label="Nombre de Usuario"
  asyncValidation={{
    asyncValidationFn: async (value) => {
      // Verificar si el nombre de usuario está disponible
      const response = await fetch(`/api/check-username?username=${value}`);
      const data = await response.json();
      return data.available ? true : 'El nombre de usuario ya está en uso';
    },
    asyncValidationDebounce: 500, // Esperar 500ms antes de validar
    showValidationIcons: true,
    showLoadingSpinner: true,
    textWhenValidating: 'Verificando disponibilidad del nombre de usuario...'
  }}
>
  <input type="text" />
</FormField>
```

## Configuración de Visualización de Errores

Puedes personalizar cómo se muestran los errores:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  errorDisplayOptions={{
    position: 'below', // 'below', 'above', 'right', o 'tooltip'
    animation: 'fadeIn', // 'none', 'fadeIn', 'slideIn', 'pulse', o 'shake'
    showIcon: true,
    delay: 0, // Retraso en ms antes de mostrar errores
    autoDismiss: false,
    dismissAfter: 5000, // Auto ocultar después de 5 segundos si autoDismiss es true
    groupErrors: false // Agrupar todos los errores a nivel de formulario
  }}
>
  {/* Campos del formulario */}
</FormProvider>
```

También puedes anular esta configuración para campos individuales:

```tsx
<FormField
  name="email"
  label="Correo Electrónico"
  errorDisplayOptions={{
    position: 'tooltip',
    animation: 'shake'
  }}
>
  <input type="email" />
</FormField>
```

## Errores Agrupados

Para formularios complejos, puedes mostrar todos los errores en un solo lugar:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  errorDisplayOptions={{
    groupErrors: true,
    maxErrors: 3 // Mostrar solo los primeros 3 errores
  }}
>
  {/* Campos del formulario */}
</FormProvider>
```

## Errores Globales del Formulario

Para errores que aplican a todo el formulario (como errores de API), usa errores globales:

```tsx
<FormProvider
  schema={schema}
  onSubmit={async (data) => {
    try {
      await enviarAAPI(data);
    } catch (error) {
      // Devolver el error para mostrarlo como un error global
      return error;
    }
  }}
  globalErrorOptions={{
    position: 'top', // 'top' o 'bottom'
    animation: 'fadeIn',
    autoDismiss: true,
    dismissAfter: 5000
  }}
>
  {/* Campos del formulario */}
</FormProvider>
```

## Validación Compleja con Refinamientos Zod

Para validación que depende de múltiples campos, usa refinamientos Zod:

```tsx
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"] // Path determina qué campo muestra el error
});
```

## Validación Condicional

Para campos que son condicionalmente requeridos:

```tsx
const schema = z.object({
  metodoEnvio: z.enum(['estandar', 'express']),
  direccionExpress: z.string().optional()
}).refine(data => {
  if (data.metodoEnvio === 'express' && !data.direccionExpress) {
    return false;
  }
  return true;
}, {
  message: "La dirección express es requerida para envío express",
  path: ["direccionExpress"]
});
```

## Validación de Array de Campos

Para validar arrays de campos:

```tsx
const schema = z.object({
  contactos: z.array(
    z.object({
      nombre: z.string().min(1, "El nombre es requerido"),
      email: z.string().email("Email inválido")
    })
  ).min(1, "Se requiere al menos un contacto")
});
```

## Hooks de Validación

Para lógica de validación personalizada, puedes usar el hook `useFieldState`:

```tsx
import { useFieldState } from '@qazuor/react-form-toolkit';

function CampoPersonalizado() {
  const { error, isTouched, isDirty, hasError } = useFieldState('email');

  return (
    <div>
      <input
        type="email"
        className={hasError ? 'border-red-500' : 'border-gray-300'}
      />
      {hasError && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

## Mejores Prácticas

1. **Definición del Esquema**
   - Define tu esquema fuera del componente para evitar re-renderizados innecesarios
   - Usa mensajes de error descriptivos en tu esquema
   - Agrupa campos relacionados en objetos anidados

2. **Tiempo de Validación**
   - Usa `mode="onBlur"` para mejor experiencia de usuario (predeterminado)
   - Usa `mode="onChange"` para retroalimentación inmediata en campos críticos
   - Considera las implicaciones de rendimiento de validación frecuente

3. **Validación Asíncrona**
   - Siempre usa debouncing para validación asíncrona para prevenir llamadas API excesivas
   - Proporciona estados de carga claros y mensajes de error
   - Maneja errores de red con elegancia

4. **Visualización de Errores**
   - Elige posiciones de error que no interrumpan el diseño del formulario
   - Usa animaciones con moderación para evitar distraer a los usuarios
   - Asegúrate de que los mensajes de error sean claros y accionables

5. **Accesibilidad**
   - Asegúrate de que los mensajes de error sean anunciados a los lectores de pantalla
   - Usa atributos ARIA apropiados
   - Proporciona suficiente contraste de color para estados de error

## Componentes Relacionados

- [FormProvider](/docs/form-provider) - Para configuración de validación a nivel de formulario
- [FormField](/docs/form-field) - Para validación a nivel de campo
- [ConditionalField](/docs/conditional-field) - Para validación condicional
- [DependantField](/docs/dependant-field) - Para validación de campos dependientes

## Ejemplos

Consulta los [ejemplos de validación](/examples/validation) para ver estas características en acción.
