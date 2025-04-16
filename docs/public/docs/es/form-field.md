# Campo de Formulario

El componente `FormField` de **Qazuor React Form Toolkit** maneja campos individuales del formulario con validación, etiquetas, descripciones y mensajes de error.

## Uso Básico

```tsx
import { FormField } from '@qazuor/react-form-toolkit';

function MiFormulario() {
  return (
    <FormField
      name="email"
      label="Correo Electrónico"
      required
      description="Nunca compartiremos tu correo"
      tooltip="Ingresa tu dirección de correo electrónico principal"
    >
      <input type="email" />
    </FormField>
  );
}
```

## Props

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `name` | `string` | Nombre del campo que coincide con el esquema |
| `label` | `string` | Texto de la etiqueta del campo |
| `required` | `boolean` | Si el campo es requerido |
| `description` | `string \| ReactNode` | Descripción del campo |
| `tooltip` | `string` | Contenido del tooltip |
| `children` | `ReactNode` | Elemento de entrada |
| `descriptionOptions` | `DescriptionOptions` | Configuración de la descripción |
| `tooltipOptions` | `TooltipOptions` | Configuración del tooltip |
| `styleOptions` | `ComponentStyleOptions` | Anulaciones de estilo |
| `errorDisplayOptions` | `ErrorDisplayOptions` | Configuración de visualización de errores |
| `asyncValidation` | `AsyncValidationProps` | Configuración de validación asíncrona |

## Características

### Función de Renderizado como Children

Puedes usar una función de renderizado como children para tener más control sobre la renderización del campo:

```tsx
<FormField name="state" label="Estado">
  {({ field }, dependentValues, styleOptions, fieldState) => (
    <select
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
      className={cn(
        styleProps.styles.select,
        fieldState?.isValid && styleProps.styles.isValid,
        fieldState?.isInvalid && styleProps.styles.isInvalid
      )}
    >
      {/* Opciones */}
    </select>
  )}
</FormField>
```

La función de renderizado recibe:
- `field`: Las props del campo (value, onChange, onBlur)
- `dependentValues`: Array de opciones (cuando se usa con DependantField)
- `styleOptions`: Información de estilo con todas las propiedades de formulario y campo
- `fieldState`: Información del estado del campo

### Etiquetas y Descripciones

```tsx
<FormField
  name="email"
  label="Correo Electrónico"
  description={
    <span className="flex items-center">
      <InfoIcon className="mr-2" />
      Ingresa tu correo electrónico principal
    </span>
  }
  descriptionOptions={{
    position: 'below',
    className: 'text-gray-600'
  }}
>
  <input type="email" />
</FormField>
```

### Tooltips

```tsx
<FormField
  name="password"
  label="Contraseña"
  tooltip="Debe tener al menos 8 caracteres"
  tooltipOptions={{
    position: 'right',
    align: 'start',
    sideOffset: 8
  }}
>
  <input type="password" />
</FormField>
```

### Validación Asíncrona

```tsx
<FormField
  name="username"
  label="Nombre de Usuario"
  asyncValidation={{
    asyncValidationFn: async (value) => {
      const isAvailable = await checkUsername(value);
      return isAvailable ? true : 'El nombre de usuario ya está en uso';
    },
    asyncValidationDebounce: 500,
    showValidationIcons: true,
    textWhenValidating: 'Verificando nombre de usuario...'
  }}
>
  <input type="text" />
</FormField>
```

### Estilos Personalizados

```tsx
<FormField
  name="email"
  styleOptions={{
    input: 'input-personalizado',
    label: 'label-personalizado',
    description: 'descripcion-personalizada'
  }}
>
  <input type="email" />
</FormField>
```

### Visualización de Errores

```tsx
<FormField
  name="email"
  errorDisplayOptions={{
    position: 'below',
    animation: 'fadeIn',
    showIcon: true
  }}
>
  <input type="email" />
</FormField>
```

### Campos Requeridos

```tsx
<FormField
  name="email"
  required
  label="Correo Electrónico"
>
  <input type="email" />
</FormField>
```

La prop `required` puede ser:
- Establecida explícitamente con la prop `required`
- Inferida del esquema
- Anulada con `required={false}`

## Tipos de Entrada

FormField funciona con todos los tipos de entrada HTML:

### Entrada de Texto

```tsx
<FormField name="name" label="Nombre">
  <input type="text" />
</FormField>
```

### Select

```tsx
<FormField name="country" label="País">
  <select>
    <option value="">Selecciona un país</option>
    <option value="us">Estados Unidos</option>
    <option value="ca">Canadá</option>
  </select>
</FormField>
```

### Checkbox

```tsx
<FormField name="agree" label="Acepto los términos">
  <input type="checkbox" />
</FormField>
```

### Botones de Radio

```tsx
<FormField name="gender" label="Género">
  {({ field }) => (
    <div className="space-y-2">
      <label className="flex items-center">
        <input
          type="radio"
          value="male"
          checked={field.value === 'male'}
          onChange={() => field.onChange('male')}
        />
        <span className="ml-2">Masculino</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          value="female"
          checked={field.value === 'female'}
          onChange={() => field.onChange('female')}
        />
        <span className="ml-2">Femenino</span>
      </label>
    </div>
  )}
</FormField>
```

### Textarea

```tsx
<FormField name="message" label="Mensaje">
  <textarea rows={4} />
</FormField>
```

## Mejores Prácticas

1. **Nomenclatura de Campos**
   - Usa convenciones de nomenclatura consistentes para los nombres de campos
   - Haz coincidir los nombres de los campos con las propiedades de tu esquema

2. **Validación**
   - Usa el esquema Zod para las reglas de validación
   - Añade mensajes de error descriptivos a tu esquema

3. **Accesibilidad**
   - Siempre incluye etiquetas para los campos del formulario
   - Usa descripciones y tooltips para proporcionar contexto adicional
   - Asegúrate de que los mensajes de error sean claros y útiles

4. **Rendimiento**
   - Usa funciones de renderizado como children para campos complejos
   - Considera usar `asyncValidationDebounce` para validación asíncrona

## Componentes Relacionados

- [FormProvider](/docs/form-provider) - El componente padre para todos los campos del formulario
- [FormDescription](/docs/form-description) - Para añadir descripciones a nivel de formulario
- [DependantField](/docs/dependant-field) - Para campos que dependen de otros campos
- [ConditionalField](/docs/conditional-field) - Para campos renderizados condicionalmente

## Ejemplos

Consulta la [sección de ejemplos](/examples/basic) para ver FormField en acción.
