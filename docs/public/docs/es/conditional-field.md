# Campos Condicionales

La característica de Campos Condicionales te permite mostrar u ocultar dinámicamente campos de formulario basados en el valor de otro campo. Esto es útil para crear formularios dinámicos donde ciertos campos solo deberían aparecer bajo condiciones específicas.

## Uso Básico

### Campo Condicional Individual

Usa `ConditionalField` cuando necesites mostrar/ocultar un solo campo o grupo de campos basado en una condición:

```tsx
import { ConditionalField, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
    tipoEnvio: z.enum(['recoger', 'entrega']),
    ubicacionTienda: z.string().optional(),
    direccion: z.string().optional()
});

function FormularioEnvio() {
    return (
        <FormProvider schema={schema}>
            <FormField name="tipoEnvio">
                <select>
                    <option value="recoger">Recoger en Tienda</option>
                    <option value="entrega">Entrega a Domicilio</option>
                </select>
            </FormField>

            <ConditionalField
                watchField="tipoEnvio"
                condition="recoger"
            >
                <FormField name="ubicacionTienda">
                    <select>
                        <option value="">Selecciona una tienda</option>
                        <option value="centro">Tienda Centro</option>
                        <option value="norte">Tienda Norte</option>
                    </select>
                </FormField>
            </ConditionalField>

            <ConditionalField
                watchField="tipoEnvio"
                condition="entrega"
            >
                <FormField name="direccion">
                    <textarea />
                </FormField>
            </ConditionalField>
        </FormProvider>
    );
}
```

### Múltiples Campos Condicionales

Usa `ConditionalFieldGroup` cuando necesites alternar entre diferentes conjuntos de campos:

```tsx
import { ConditionalFieldGroup, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
    tipoCuenta: z.enum(['personal', 'empresa']),
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    nombreEmpresa: z.string().optional(),
    identificacionFiscal: z.string().optional()
});

function FormularioCuenta() {
    return (
        <FormProvider schema={schema}>
            <FormField name="tipoCuenta">
                <select>
                    <option value="personal">Cuenta Personal</option>
                    <option value="empresa">Cuenta Empresarial</option>
                </select>
            </FormField>

            <ConditionalFieldGroup
                watchField="tipoCuenta"
                conditions={{
                    personal: (
                        <>
                            <FormField name="nombre">
                                <input type="text" />
                            </FormField>
                            <FormField name="apellido">
                                <input type="text" />
                            </FormField>
                        </>
                    ),
                    empresa: (
                        <>
                            <FormField name="nombreEmpresa">
                                <input type="text" />
                            </FormField>
                            <FormField name="identificacionFiscal">
                                <input type="text" />
                            </FormField>
                        </>
                    )
                }}
            />
        </FormProvider>
    );
}
```

## Props

### Props de ConditionalField

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `watchField` | `string` | Nombre del campo a observar para cambios |
| `condition` | `string \| ((value: unknown) => boolean)` | Valor a coincidir o función que devuelve booleano |
| `children` | `ReactNode` | Contenido a mostrar cuando se cumple la condición |
| `fallback` | `ReactNode` | Contenido opcional a mostrar cuando no se cumple la condición |
| `keepRegistered` | `boolean` | Mantener campos registrados cuando están ocultos |

### Props de ConditionalFieldGroup

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `watchField` | `string` | Nombre del campo a observar para cambios |
| `conditions` | `Record<string, ReactNode>` | Mapa de valores de campo a contenido |
| `fallback` | `ReactNode` | Contenido a mostrar cuando ninguna condición coincide |
| `className` | `string` | Clase CSS opcional para el contenedor |
| `keepRegistered` | `boolean` | Mantener campos registrados cuando están ocultos |

## Características

### Condiciones de Función

Puedes usar una función para condiciones más complejas:

```tsx
<ConditionalField
    watchField="edad"
    condition={(value) => Number(value) >= 18}
>
    <FormField name="licenciaConducir">
        <input type="text" />
    </FormField>
</ConditionalField>
```

### Contenido de Respaldo

Muestra contenido alternativo cuando las condiciones no se cumplen:

```tsx
<ConditionalField
    watchField="tieneCuenta"
    condition="si"
    fallback={<p>Por favor crea una cuenta primero</p>}
>
    <FormField name="detallesCuenta">
        <input type="text" />
    </FormField>
</ConditionalField>
```

### Registro de Campos

Por defecto, los campos ocultos se desregistran del formulario para evitar validación innecesaria. Usa `keepRegistered` para mantener los valores de los campos:

```tsx
<ConditionalField
    watchField="tipo"
    condition="avanzado"
    keepRegistered={true}
>
    <FormField name="configuracionAvanzada">
        <input type="text" />
    </FormField>
</ConditionalField>
```

### Estilizado

Aplica estilos personalizados al contenedor del grupo de campos condicionales:

```tsx
<ConditionalFieldGroup
    watchField="seccion"
    conditions={conditions}
    className="space-y-4 bg-gray-50 p-4 rounded-lg"
/>
```

## Mejores Prácticas

1. **Validación de Esquema**
   - Haz que los campos condicionales sean opcionales en el esquema
   - Usa refinamientos de esquema para reglas de validación complejas

```tsx
const schema = z.object({
    tipo: z.enum(['A', 'B']),
    campoA: z.string().optional(),
    campoB: z.string().optional()
}).refine((data) => {
    if (data.tipo === 'A' && !data.campoA) {
        return false;
    }
    return true;
}, {
    message: "El campo A es requerido cuando el tipo es A",
    path: ["campoA"]
});
```

2. **Rendimiento**
   - Usa `keepRegistered` solo cuando sea necesario
   - Agrupa campos condicionales relacionados
   - Evita el anidamiento profundo de campos condicionales

3. **Accesibilidad**
   - Proporciona etiquetas y descripciones claras
   - Asegúrate de que la navegación por teclado funcione correctamente
   - Usa atributos ARIA apropiadamente

4. **Manejo de Errores**
   - Maneja los errores de validación apropiadamente para campos condicionales
   - Muestra mensajes de error claros
   - Considera la experiencia de usuario cuando los campos aparecen/desaparecen

## Ejemplos

### Formulario Multi-paso

```tsx
<ConditionalFieldGroup
    watchField="paso"
    conditions={{
        personal: <CamposInfoPersonal />,
        direccion: <CamposDireccion />,
        pago: <CamposPago />
    }}
    className="space-y-6"
/>
```

### Condiciones Anidadas

```tsx
<ConditionalField watchField="tieneSuscripcion" condition={true}>
    <FormField name="plan">
        <select>
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
        </select>
    </FormField>

    <ConditionalField watchField="plan" condition="premium">
        <FormField name="caracteristicasAdicionales">
            <input type="text" />
        </FormField>
    </ConditionalField>
</ConditionalField>
```

### Validación Dinámica

```tsx
const schema = z.object({
    metodoContacto: z.enum(['email', 'telefono']),
    email: z.string().email().optional(),
    telefono: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional()
}).refine((data) => {
    if (data.metodoContacto === 'email' && !data.email) {
        return false;
    }
    if (data.metodoContacto === 'telefono' && !data.telefono) {
        return false;
    }
    return true;
});

function FormularioContacto() {
    return (
        <FormProvider schema={schema}>
            <FormField name="metodoContacto">
                <select>
                    <option value="email">Email</option>
                    <option value="telefono">Teléfono</option>
                </select>
            </FormField>

            <ConditionalFieldGroup
                watchField="metodoContacto"
                conditions={{
                    email: (
                        <FormField name="email">
                            <input type="email" />
                        </FormField>
                    ),
                    telefono: (
                        <FormField name="telefono">
                            <input type="tel" />
                        </FormField>
                    )
                }}
            />
        </FormProvider>
    );
}
```

## Componentes Relacionados

- [FormProvider](./form-provider.md) - El componente padre para todos los campos del formulario
- [FormField](./form-field.md) - Para renderizar campos individuales del formulario
- [DependantField](./dependent-field.md) - Para campos que dependen de otros campos

## Hooks

Si necesitas más control, puedes usar los hooks subyacentes:

```tsx
import { useConditionalField, useConditionalFieldGroup } from '@qazuor/react-form-toolkit';

// Para condición única
const { isConditionMet } = useConditionalField({
    watchField: 'tipo',
    condition: 'avanzado',
    keepRegistered: true
});

// Para múltiples condiciones
const { currentValue, conditions } = useConditionalFieldGroup({
    watchField: 'seccion',
    conditions: {
        personal: <CamposInfoPersonal />,
        direccion: <CamposDireccion />
    }
});
```
