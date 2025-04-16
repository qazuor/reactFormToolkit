# Descripción de Formulario

El componente `FormDescription` se utiliza para añadir texto descriptivo a los formularios. Puede posicionarse por encima o por debajo de los campos del formulario.

## Uso Básico

```tsx
import { FormDescription, FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function FormularioLogin() {
  return (
    <FormProvider schema={schema} onSubmit={handleSubmit}>
      <FormDescription position="above">
        Por favor ingresa tus credenciales de acceso.
      </FormDescription>

      <FormField name="email" label="Correo Electrónico">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Contraseña">
        <input type="password" />
      </FormField>

      <button type="submit">Iniciar Sesión</button>
    </FormProvider>
  );
}
```

## Props

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `children` | `ReactNode` | Contenido de la descripción |
| `position` | `'above' \| 'below'` | Posición relativa al formulario |
| `className` | `string` | Clases CSS personalizadas |
| `id` | `string` | ID de elemento personalizado |

## Características

### Posicionamiento

Puedes posicionar la descripción por encima o por debajo del formulario:

```tsx
// Por encima del formulario (predeterminado)
<FormDescription position="above">
  Por favor completa todos los campos requeridos.
</FormDescription>

// Por debajo del formulario
<FormDescription position="below">
  Al enviar este formulario, aceptas nuestros términos y condiciones.
</FormDescription>
```

### Estilo Personalizado

Puedes aplicar estilos personalizados a la descripción:

```tsx
<FormDescription
  className="bg-blue-50 p-4 rounded-lg text-blue-800 border border-blue-200"
  position="above"
>
  <strong>Nota:</strong> Todos los campos marcados con un asterisco (*) son obligatorios.
</FormDescription>
```

### Contenido Enriquecido

La descripción puede contener contenido enriquecido, no solo texto:

```tsx
<FormDescription position="above">
  <div className="flex items-center space-x-2">
    <InfoIcon className="text-blue-500" />
    <span>Por favor completa el formulario a continuación para registrarte.</span>
  </div>
  <ul className="list-disc pl-5 mt-2">
    <li>Todos los campos son obligatorios</li>
    <li>La contraseña debe tener al menos 8 caracteres</li>
    <li>El correo electrónico debe ser válido</li>
  </ul>
</FormDescription>
```

### Accesibilidad

El componente incluye atributos de accesibilidad adecuados:

```tsx
<FormDescription
  id="login-form-description"
  role="region"
  aria-label="Instrucciones del formulario"
>
  Por favor ingresa tus credenciales de acceso.
</FormDescription>
```

## Mejores Prácticas

1. **Mantén las descripciones concisas**
   - Usa un lenguaje claro y simple
   - Concéntrate en la información más importante

2. **Usa un posicionamiento apropiado**
   - Coloca instrucciones generales por encima del formulario
   - Coloca términos y condiciones o notas de envío por debajo del formulario

3. **Mejora con elementos visuales**
   - Usa iconos para llamar la atención sobre información importante
   - Usa color y formato para mejorar la legibilidad

4. **Asegura la accesibilidad**
   - Proporciona suficiente contraste de color
   - No confíes únicamente en el color para transmitir información

## Componentes Relacionados

- [FormProvider](./form-provider.md) - El componente padre para todos los elementos del formulario
- [FormField](./form-field.md) - Para renderizar campos individuales del formulario con sus propias descripciones

## Ejemplos

### Formulario con Instrucciones

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormDescription position="above">
    <h3 className="text-lg font-semibold mb-2">Instrucciones de Registro</h3>
    <p className="mb-2">Por favor completa el formulario a continuación para crear tu cuenta.</p>
    <ul className="list-disc pl-5">
      <li>Usa una contraseña fuerte con al menos 8 caracteres</li>
      <li>Proporciona una dirección de correo electrónico válida para verificación</li>
      <li>Tu nombre de usuario debe ser único</li>
    </ul>
  </FormDescription>

  {/* Campos del formulario */}

  <FormDescription position="below">
    Al hacer clic en "Registrarse", aceptas nuestros <a href="/terms">Términos de Servicio</a> y <a href="/privacy">Política de Privacidad</a>.
  </FormDescription>

  <button type="submit">Registrarse</button>
</FormProvider>
```

### Descripción Estilo Alerta

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormDescription
    position="above"
    className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800"
  >
    <div className="flex">
      <WarningIcon className="h-5 w-5 mr-2" />
      <div>
        <p className="font-medium">Importante</p>
        <p>Esta acción no se puede deshacer. Por favor revisa tu información cuidadosamente antes de enviar.</p>
      </div>
    </div>
  </FormDescription>

  {/* Campos del formulario */}
</FormProvider>
```
