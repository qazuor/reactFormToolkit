# Integración con TypeScript

**Qazuor React Form Toolkit** está construido con TypeScript desde cero, proporcionando excelente seguridad de tipos y experiencia de desarrollo.

## Formularios con Seguridad de Tipos

La biblioteca aprovecha la inferencia de tipos de Zod para proporcionar formularios con seguridad de tipos:

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

// Define tu esquema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Infiere el tipo del esquema
type LoginFormValues = z.infer<typeof loginSchema>;

function FormularioLogin() {
  // Envío de formulario con seguridad de tipos
  const handleSubmit = (data: LoginFormValues) => {
    // TypeScript sabe que data tiene propiedades email y password
    console.log(data.email, data.password);
  };

  return (
    <FormProvider
      schema={loginSchema}
      onSubmit={handleSubmit}
    >
      <FormField name="email" label="Email">
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

## Tipos Genéricos

La biblioteca usa genéricos para proporcionar seguridad de tipos en todos los componentes:

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  nombre: z.string(),
  edad: z.number()
});

// Especificar explícitamente el tipo
function MiFormulario() {
  return (
    <FormProvider<z.infer<typeof schema>>
      schema={schema}
      onSubmit={(data) => {
        // data tiene tipo { nombre: string; edad: number }
        console.log(data.nombre, data.edad);
      }}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

## Definiciones de Tipo

### Esquema de Formulario

```tsx
import type { FormSchema } from '@qazuor/react-form-toolkit';

// Usa FormSchema para tipar tu esquema
const schema: FormSchema<{ email: string; password: string }> = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

### Props de Form Provider

```tsx
import type { FormProviderProps } from '@qazuor/react-form-toolkit';

// Define tipo de props para un proveedor de formulario personalizado
type MisFormProviderProps<T> = FormProviderProps<T> & {
  propPersonalizada: string;
};
```

### Opciones de Estilo

```tsx
import type { FormProviderStyleOptions } from '@qazuor/react-form-toolkit';

// Define estilos personalizados con tipado adecuado
const estilos: FormProviderStyleOptions = {
  field: {
    input: 'input-personalizado',
    label: 'label-personalizado'
  },
  buttons: {
    submit: 'submit-personalizado'
  }
};
```

### Opciones de Visualización de Errores

```tsx
import type { ErrorDisplayOptions } from '@qazuor/react-form-toolkit';

// Define opciones de visualización de errores con tipado adecuado
const opcionesError: ErrorDisplayOptions = {
  position: 'below',
  animation: 'fadeIn',
  showIcon: true
};
```

## Uso Avanzado de TypeScript

### Tipos Condicionales

```tsx
import type { ConditionalFieldProps } from '@qazuor/react-form-toolkit';

// Crea un tipo que cambia basado en una condición
type MisFieldProps<T extends boolean> = T extends true
  ? ConditionalFieldProps & { required: true }
  : ConditionalFieldProps;

// Uso
const props: MisFieldProps<true> = {
  watchField: 'tipo',
  condition: 'avanzado',
  required: true,
  children: <div />
};
```

### Tipos Mapeados

```tsx
import type { FormSchema } from '@qazuor/react-form-toolkit';

// Crea un tipo que mapea todas las propiedades para ser opcionales
type PartialFormSchema<T> = {
  [K in keyof T]?: T[K];
};

// Uso
type UserSchema = FormSchema<{
  nombre: string;
  email: string;
}>;

type PartialUserSchema = PartialFormSchema<UserSchema>;
```

### Tipos de Utilidad

```tsx
import type { Form, FieldValues } from '@qazuor/react-form-toolkit';

// Extrae el tipo de un campo de formulario
type FieldType<
  TFieldValues extends FieldValues,
  TFieldName extends keyof TFieldValues
> = TFieldValues[TFieldName];

// Uso
type UserForm = {
  nombre: string;
  email: string;
  edad: number;
};

type EdadField = FieldType<UserForm, 'edad'>; // number
```

## Hooks con Seguridad de Tipos

### useFieldState

```tsx
import { useFieldState } from '@qazuor/react-form-toolkit';

function CampoEmail() {
  // TypeScript conoce la estructura del objeto retornado
  const { error, isTouched, isDirty, hasError } = useFieldState('email');

  return (
    <div>
      {hasError && <span>{error.message}</span>}
    </div>
  );
}
```

### useFormWatch

```tsx
import { useFormWatch } from '@qazuor/react-form-toolkit';

function CalculadoraPrecio() {
  // Observa el campo cantidad con seguridad de tipos
  const cantidad = useFormWatch<number>({
    name: 'cantidad',
    onChange: (value) => {
      // value tiene tipo number
      console.log(value * 2);
    }
  });

  return <div>Cantidad: {cantidad}</div>;
}
```

## Mejores Prácticas

1. **Usa Zod para Definición de Esquema**
   - Define tu esquema con Zod para obtener inferencia de tipos automática
   - Usa `z.infer<typeof schema>` para extraer el tipo

2. **Genéricos Explícitos**
   - Usa genéricos explícitos cuando TypeScript no puede inferir tipos
   - Esto es especialmente importante para formularios anidados complejos

3. **Guardas de Tipo**
   - Usa guardas de tipo cuando trabajes con datos desconocidos
   - Ejemplo: `if (typeof value === 'string') { /* value es string */ }`

4. **Evita Aserciones de Tipo**
   - Minimiza el uso de aserciones de tipo (palabra clave `as`)
   - Usa guardas de tipo e inferencia adecuadas en su lugar

5. **Documenta Tipos**
   - Añade comentarios JSDoc a tus tipos para mejor soporte de IDE
   - Esto ayuda a otros desarrolladores a entender tu código

## Errores Comunes de TypeScript

### La propiedad 'x' no existe en el tipo 'y'

Esto ocurre frecuentemente cuando intentas acceder a una propiedad que no existe en el tipo de tus valores de formulario:

```tsx
// Error: La propiedad 'direccion' no existe en el tipo '{ nombre: string; email: string; }'
const handleSubmit = (data: { nombre: string; email: string }) => {
  console.log(data.direccion); // ¡Error!
};
```

Solución: Asegúrate de que tu esquema y tipos coincidan:

```tsx
const schema = z.object({
  nombre: z.string(),
  email: z.string(),
  direccion: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

const handleSubmit = (data: FormValues) => {
  console.log(data.direccion); // OK, TypeScript sabe que direccion podría ser undefined
};
```

### El tipo 'string | undefined' no es asignable al tipo 'string'

Esto ocurre cuando intentas asignar un valor opcional a un campo requerido:

```tsx
// Error: El tipo 'string | undefined' no es asignable al tipo 'string'
const email: string = form.getValues('email');
```

Solución: Usa guardas de tipo o encadenamiento opcional:

```tsx
const email = form.getValues('email') || '';
// o
const email = form.getValues('email');
if (email) {
  // email es string aquí
}
```

## Documentación Relacionada

- [Form Provider](/docs/form-provider) - Para seguridad de tipos a nivel de formulario
- [Form Field](/docs/form-field) - Para seguridad de tipos a nivel de campo
- [Documentación de Zod](https://zod.dev/) - Para más información sobre esquemas Zod
