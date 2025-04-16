# Proveedor de Formulario

El componente `FormProvider` es la base de React Form Toolkit. Gestiona el estado del formulario, la validación y proporciona contexto a los componentes hijos.

## Uso Básico

```tsx
import { FormProvider } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function MiFormulario() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{ email: '', password: '' }}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

## Props

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `schema` | `z.ZodType` | Esquema Zod para validación del formulario |
| `onSubmit` | `(data: T) => void \| Promise<void>` | Manejador de envío del formulario |
| `defaultValues` | `DefaultValues<T>` | Valores iniciales del formulario |
| `mode` | `'onBlur' \| 'onChange' \| 'onSubmit' \| 'onTouched' \| 'all'` | Modo de activación de validación |
| `i18n` | `I18nOptions` | Opciones de internacionalización |
| `styleOptions` | `FormProviderStyleOptions` | Personalización de estilos |
| `errorDisplayOptions` | `ErrorDisplayOptions` | Configuración de visualización de errores |
| `globalErrorOptions` | `GlobalErrorOptions` | Configuración de errores globales |
| `uiLibrary` | `UILibraryOptions` | Opciones de integración con bibliotecas UI |
| `form` | `UseFormReturn<T>` | Instancia de formulario externa |

## Características

### Validación con Esquema

La prop `schema` acepta un esquema Zod que define la estructura y reglas de validación del formulario:

```tsx
const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18)
});
```

### Envío del Formulario

El manejador `onSubmit` recibe los datos validados del formulario:

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await enviarAAPI(data);
  } catch (error) {
    console.error(error);
  }
};
```

### Valores Predeterminados

Establece valores iniciales del formulario con `defaultValues`:

```tsx
<FormProvider
  defaultValues={{
    username: 'juanperez',
    email: 'juan@ejemplo.com'
  }}
>
  {/* ... */}
</FormProvider>
```

### Modos de Validación

Controla cuándo ocurre la validación:

```tsx
<FormProvider mode="onChange">
  {/* Valida en cada cambio */}
</FormProvider>

<FormProvider mode="onBlur">
  {/* Valida cuando los campos pierden el foco */}
</FormProvider>
```

### Personalización de Estilos

Personaliza los estilos del formulario:

```tsx
<FormProvider
  styleOptions={{
    field: {
      input: 'clase-input-personalizada',
      label: 'clase-label-personalizada'
    },
    buttons: {
      submit: 'clase-submit-personalizada'
    }
  }}
>
  {/* ... */}
</FormProvider>
```

### Visualización de Errores

Configura la visualización de mensajes de error:

```tsx
<FormProvider
  errorDisplayOptions={{
    position: 'below',
    animation: 'fadeIn',
    showIcon: true,
    groupErrors: false
  }}
>
  {/* ... */}
</FormProvider>
```

### Internacionalización

Añade soporte i18n:

```tsx
<FormProvider
  i18n={{
    resources: {
      es: {
        validation: {
          required: 'Este campo es requerido'
        }
      }
    },
    lng: 'es'
  }}
>
  {/* ... */}
</FormProvider>
```

### Integración con Bibliotecas UI

Configura el formulario para trabajar con bibliotecas UI:

```tsx
<FormProvider
  uiLibrary={{
    enabled: true,
    name: 'material-ui'
  }}
>
  {/* Campos del formulario */}
</FormProvider>
```

Cuando `uiLibrary.enabled` está establecido en `true`, el formulario no aplicará estilos de entrada predeterminados, permitiendo que se utilicen los estilos nativos de la biblioteca UI.

### Manejo de Errores Globales

Maneja errores a nivel de formulario:

```tsx
<FormProvider
  globalErrorOptions={{
    position: 'top',
    animation: 'fadeIn',
    autoDismiss: true,
    dismissAfter: 5000
  }}
  onSubmit={async (data) => {
    try {
      await enviarDatos(data);
    } catch (error) {
      // Devuelve el error para mostrarlo como error global
      return error;
    }
  }}
>
  {/* ... */}
</FormProvider>
```

## Uso Avanzado

### Usando Control de Formulario Externo

Puedes usar una instancia de formulario externa:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function MiFormulario() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  return (
    <FormProvider
      form={form}
      onSubmit={handleSubmit}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

### Reinicio del Formulario

El formulario puede reiniciarse a sus valores iniciales:

```tsx
function MiFormulario() {
  const handleReset = () => {
    // El formulario se reiniciará a defaultValues
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
    >
      {/* Campos del formulario */}
      <button type="reset">Reiniciar Formulario</button>
    </FormProvider>
  );
}
```

## Mejores Prácticas

1. **Definición del Esquema**
   - Define tu esquema fuera del componente para evitar re-renderizados innecesarios
   - Usa mensajes de error descriptivos en tu esquema

2. **Envío del Formulario**
   - Maneja operaciones asíncronas adecuadamente con try/catch
   - Devuelve errores desde el manejador de envío para mostrarlos como errores globales

3. **Valores Predeterminados**
   - Siempre proporciona valores predeterminados para todos los campos en tu esquema
   - Para formularios complejos, considera usar una función de fábrica para generar valores predeterminados

4. **Rendimiento**
   - Usa `mode="onBlur"` para mejor rendimiento con formularios grandes
   - Considera usar `shouldUnregister: false` para campos que pueden ser renderizados condicionalmente

## Componentes Relacionados

- [FormField](./form-field.md) - Para renderizar campos individuales del formulario
- [FormButtonsBar](./form-buttons.md) - Para renderizar botones de acción del formulario
- [FormDescription](./form-description.md) - Para añadir descripciones a nivel de formulario

## Ejemplos

Consulta la [sección de ejemplos](/examples/basic) para ver FormProvider en acción.
