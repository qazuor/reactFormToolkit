# Array de Campos

El componente `FieldArray` permite arrays de formularios dinámicos con soporte de validación. Esto es útil para formularios donde los usuarios necesitan añadir múltiples elementos, como contactos, direcciones o cualquier otro dato repetible.

## Uso Básico

```tsx
import { FieldArray, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
  contactos: z.array(z.object({
    nombre: z.string(),
    email: z.string().email()
  })).min(1)
});

function MiFormulario() {
  return (
    <FormProvider schema={schema}>
      <FieldArray
        name="contactos"
        minItems={1}
        maxItems={5}
      >
        <FormField name="nombre">
          <input type="text" />
        </FormField>
        <FormField name="email">
          <input type="email" />
        </FormField>
      </FieldArray>
    </FormProvider>
  );
}
```

## Props

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `name` | `string` | Nombre del campo array |
| `children` | `ReactNode` | Campos de formulario a repetir |
| `minItems` | `number` | Mínimo de elementos requeridos |
| `maxItems` | `number` | Máximo de elementos permitidos |
| `addButtonText` | `string` | Texto personalizado del botón añadir |
| `removeButtonText` | `string` | Texto personalizado del botón eliminar |
| `className` | `string` | Clases CSS del contenedor |
| `buttonClassName` | `string` | Clases CSS de los botones |

## Características

### Arrays Anidados

```tsx
<FieldArray name="departamentos">
  <FormField name="nombre">
    <input type="text" />
  </FormField>

  <FieldArray name="empleados">
    <FormField name="nombre">
      <input type="text" />
    </FormField>
    <FormField name="rol">
      <input type="text" />
    </FormField>
  </FieldArray>
</FieldArray>
```

### Botones Personalizados

```tsx
<FieldArray
  name="elementos"
  addButtonText="Añadir Otro Elemento"
  removeButtonText="Eliminar Este Elemento"
  buttonClassName="boton-personalizado"
>
  {/* Campos */}
</FieldArray>
```

### Mínimo/Máximo de Elementos

```tsx
<FieldArray
  name="telefonos"
  minItems={1}
  maxItems={3}
>
  {/* Campos */}
</FieldArray>
```

### Validación

```tsx
const schema = z.object({
  telefonos: z.array(
    z.object({
      tipo: z.string(),
      numero: z.string().regex(/^\+?[1-9]\d{1,14}$/)
    })
  ).min(1).max(3)
});
```

### Estilizado Personalizado

```tsx
<FieldArray
  name="elementos"
  className="space-y-4 p-4 bg-gray-50 rounded-lg"
  buttonClassName="bg-blue-500 text-white px-4 py-2 rounded"
>
  {/* Campos */}
</FieldArray>
```

## Uso Avanzado

### Arrays Anidados Complejos

```tsx
const schema = z.object({
  empresa: z.object({
    nombre: z.string(),
    departamentos: z.array(
      z.object({
        nombre: z.string(),
        empleados: z.array(
          z.object({
            nombre: z.string(),
            habilidades: z.array(
              z.object({
                nombre: z.string(),
                nivel: z.number().min(1).max(5)
              })
            )
          })
        )
      })
    )
  })
});

function FormularioEmpresa() {
  return (
    <FormProvider schema={schema}>
      <FormField name="empresa.nombre" label="Nombre de la Empresa">
        <input type="text" />
      </FormField>

      <FieldArray name="empresa.departamentos">
        <FormField name="nombre" label="Nombre del Departamento">
          <input type="text" />
        </FormField>

        <FieldArray name="empleados">
          <FormField name="nombre" label="Nombre del Empleado">
            <input type="text" />
          </FormField>

          <FieldArray name="habilidades">
            <FormField name="nombre" label="Nombre de la Habilidad">
              <input type="text" />
            </FormField>
            <FormField name="nivel" label="Nivel de Habilidad">
              <input type="number" min="1" max="5" />
            </FormField>
          </FieldArray>
        </FieldArray>
      </FieldArray>
    </FormProvider>
  );
}
```

### Renderizado de Elementos Personalizado

```tsx
<FieldArray name="contactos">
  {(index) => (
    <div className="p-4 border rounded-lg">
      <h3>Contacto {index + 1}</h3>
      <FormField name="nombre" label="Nombre">
        <input type="text" />
      </FormField>
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>
    </div>
  )}
</FieldArray>
```

### Valores Predeterminados Dinámicos

```tsx
function FormularioPedido() {
  const [elementosPredeterminados, setElementosPredeterminados] = useState([
    { nombre: 'Elemento 1', cantidad: 1, precio: 10 },
    { nombre: 'Elemento 2', cantidad: 2, precio: 20 }
  ]);

  return (
    <FormProvider
      schema={schema}
      defaultValues={{ elementos: elementosPredeterminados }}
    >
      <FieldArray name="elementos">
        <FormField name="nombre" label="Nombre del Elemento">
          <input type="text" />
        </FormField>
        <FormField name="cantidad" label="Cantidad">
          <input type="number" min="1" />
        </FormField>
        <FormField name="precio" label="Precio">
          <input type="number" step="0.01" />
        </FormField>
      </FieldArray>
    </FormProvider>
  );
}
```

## Mejores Prácticas

1. **Definición del Esquema**
   - Define reglas de validación de array en tu esquema
   - Usa `min` y `max` para imponer restricciones de longitud del array
   - Define validación para cada campo en los elementos del array

```tsx
const schema = z.object({
  elementos: z.array(
    z.object({
      nombre: z.string().min(1, "El nombre es requerido"),
      cantidad: z.number().min(1, "La cantidad debe ser al menos 1")
    })
  ).min(1, "Se requiere al menos un elemento").max(10, "Máximo 10 elementos permitidos")
});
```

2. **Rendimiento**
   - Ten cuidado con arrays profundamente anidados
   - Considera paginación o virtualización para arrays grandes
   - Usa `React.memo` para componentes de elementos complejos

3. **Experiencia de Usuario**
   - Proporciona botones claros de añadir/eliminar
   - Muestra errores de validación tanto a nivel de elemento como de array
   - Considera usar arrastrar y soltar para reordenar

4. **Accesibilidad**
   - Asegúrate de que los botones añadir/eliminar tengan etiquetas adecuadas
   - Usa atributos ARIA apropiados
   - Prueba la navegación por teclado

5. **Valores Predeterminados**
   - Siempre proporciona valores predeterminados para campos array
   - Para arrays vacíos, proporciona al menos un elemento vacío si `minItems` > 0

```tsx
const defaultValues = {
  contactos: [{ nombre: '', email: '' }]
};
```

## Componentes Relacionados

- [FormProvider](./form-provider.md) - El componente padre para todos los campos del formulario
- [FormField](./form-field.md) - Para renderizar campos individuales del formulario
- [ConditionalField](./conditional-field.md) - Para renderizar campos condicionalmente

## Ejemplos

Consulta la [sección de ejemplos](/examples/field-array) para ver FieldArray en acción.
