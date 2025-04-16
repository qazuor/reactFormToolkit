# Estilizado

**Qazuor React Form Toolkit** proporciona un sistema de estilizado flexible que funciona con Tailwind CSS.

## Sistema de Estilos

Los estilos pueden aplicarse en múltiples niveles:

1. Estilos predeterminados (incorporados)
2. Estilos a nivel de proveedor (todos los componentes)
3. Estilos a nivel de componente (componentes específicos)

## Uso Básico

```tsx
// Estilos a nivel de proveedor
<FormProvider
  styleOptions={{
    field: {
      input: 'clase-input-personalizada',
      label: 'clase-label-personalizada'
    }
  }}
>
  {/* Campos del formulario */}
</FormProvider>

// Estilos a nivel de componente
<FormField
  styleOptions={{
    input: 'clase-input-especifica'
  }}
>
  <input type="text" />
</FormField>
```

## Opciones de Estilo

### Estilos de Campo

```tsx
interface FieldStyleOptions {
  wrapper?: string;
  label?: string;
  description?: string;
  error?: string;
  requiredMark?: string;
  input?: string;
  select?: string;
  textarea?: string;
  checkbox?: string;
  isValid?: string;
  isInvalid?: string;
  isValidating?: string;
  isLoading?: string;
}
```

### Estilos de Botón

```tsx
interface ButtonStyleOptions {
  submit?: string;
  reset?: string;
  cancel?: string;
}
```

### Estilos de Formulario

```tsx
interface FormStyleOptions {
  wrapper?: string;
}
```

### Estilos de Tooltip

```tsx
interface TooltipStyleOptions {
  icon?: string;
  content?: string;
}
```

## Ejemplos

### Estilos de Campo Personalizados

```tsx
<FormField
  styleOptions={{
    wrapper: 'space-y-2',
    label: 'font-bold text-gray-700',
    input: 'border-2 rounded-lg p-2 focus:ring-2',
    description: 'text-sm text-gray-500',
    error: 'text-red-500 text-sm',
    isValid: 'border-green-500',
    isInvalid: 'border-red-500'
  }}
>
  <input type="text" />
</FormField>
```

### Estilos de Botón Personalizados

```tsx
<FormButtonsBar
  buttonStyles={{
    submit: 'bg-green-600 hover:bg-green-700 text-white',
    reset: 'bg-gray-200 hover:bg-gray-300',
    cancel: 'bg-red-100 hover:bg-red-200'
  }}
/>
```

### Estados de Validación

```tsx
const estilos = {
  field: {
    isValid: 'border-green-500 bg-green-50',
    isInvalid: 'border-red-500 bg-red-50',
    isValidating: 'border-yellow-500 bg-yellow-50',
    isLoading: 'opacity-50 cursor-wait'
  }
};
```

### Estilos Responsivos

```tsx
const estilos = {
  field: {
    wrapper: 'space-y-2 md:space-y-4',
    input: 'w-full md:w-auto p-2 md:p-4'
  }
};
```

### Modo Oscuro

```tsx
const estilos = {
  field: {
    input: 'dark:bg-gray-800 dark:text-white',
    label: 'dark:text-gray-200'
  }
};
```

## Integración con Tailwind CSS

**Qazuor React Form Toolkit** funciona perfectamente con Tailwind CSS. Así es como configurarlo:

### Configuración

```css
/* En tu archivo CSS */
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/@qazuor/react-form-toolkit/dist/index.js";
```

### Animaciones

Importa el archivo CSS de animaciones:

```tsx
// En tu archivo de entrada principal
import '@qazuor/react-form-toolkit/animations.css';
```

## Temas Personalizados

Puedes crear temas personalizados definiendo un conjunto de estilos:

```tsx
// themes.ts
export const temaClaro = {
  field: {
    wrapper: 'space-y-2',
    label: 'font-medium text-gray-700',
    input: 'border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500',
    error: 'text-red-500 text-sm',
    isValid: 'border-green-500',
    isInvalid: 'border-red-500'
  },
  buttons: {
    submit: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700',
    reset: 'bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300',
    cancel: 'bg-red-100 px-4 py-2 rounded-md hover:bg-red-200'
  }
};

export const temaOscuro = {
  field: {
    wrapper: 'space-y-2',
    label: 'font-medium text-gray-200',
    input: 'border border-gray-600 bg-gray-800 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-400',
    error: 'text-red-400 text-sm',
    isValid: 'border-green-400',
    isInvalid: 'border-red-400'
  },
  buttons: {
    submit: 'bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600',
    reset: 'bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600',
    cancel: 'bg-red-900 text-red-100 px-4 py-2 rounded-md hover:bg-red-800'
  }
};
```

Luego usa el tema en tu formulario:

```tsx
import { useTheme } from './hooks/useTheme';
import { temaClaro, temaOscuro } from './themes';

function MiFormulario() {
  const { theme } = useTheme();
  const temaActual = theme === 'dark' ? temaOscuro : temaClaro;

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      styleOptions={temaActual}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

## Integración con Bibliotecas UI

Cuando uses bibliotecas UI como Material UI o Chakra UI, puedes deshabilitar los estilos predeterminados de **Qazuor React Form Toolkit**:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  uiLibrary={{ enabled: true, name: 'material-ui' }}
>
  {/* Campos de formulario con componentes Material UI */}
</FormProvider>
```

Esto evitará conflictos de estilo entre React Form Toolkit y la biblioteca UI.

## Mejores Prácticas

1. **Estilizado Consistente**
   - Usa un sistema de estilos consistente en toda tu aplicación
   - Define estilos comunes a nivel de proveedor
   - Anula solo cuando sea necesario a nivel de componente

2. **Diseño Responsivo**
   - Usa las utilidades responsivas de Tailwind para diferentes tamaños de pantalla
   - Prueba tus formularios en varios dispositivos

3. **Accesibilidad**
   - Asegura suficiente contraste de color para todos los estados
   - No confíes únicamente en el color para transmitir información
   - Prueba con lectores de pantalla

4. **Rendimiento**
   - Evita CSS complejo que pueda causar thrashing de layout
   - Usa transiciones CSS en lugar de animaciones JavaScript cuando sea posible

5. **Cambio de Tema**
   - Para soporte de modo oscuro, usa variables CSS u objetos de tema
   - Considera las preferencias del usuario con `prefers-color-scheme`

## Componentes Relacionados

- [FormProvider](./form-provider.md) - Para establecer estilos a nivel de proveedor
- [FormField](./form-field.md) - Para anulaciones de estilo a nivel de componente

## Ejemplos

Consulta el [ejemplo de formulario estilizado](/examples/styled) para ver el estilizado personalizado en acción.
