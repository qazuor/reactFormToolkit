# Campos Dependientes

La característica de Campos Dependientes te permite cargar dinámicamente opciones para un campo basado en el valor de otro campo. Esto es útil para crear campos de selección en cascada, como relaciones país/estado o categoría/subcategoría.

## Características

- **Carga Dinámica**: Carga automáticamente opciones basadas en el valor del campo padre
- **Estados de Carga**: Muestra indicadores de carga durante la obtención de datos
- **Caché**: Opcionalmente almacena en caché los resultados para evitar llamadas API repetidas
- **Estado del Campo**: Proporciona información de validación y estado para estilizado
- **Auto Reinicio**: Reinicia automáticamente el campo dependiente cuando cambia el campo padre

## Uso Básico

```tsx
import { DependantField, FormField } from '@qazuor/react-form-toolkit';

const schema = z.object({
    pais: z.string(),
    estado: z.string().optional()
});

// Función para obtener estados basados en el país
const getEstadosPorPais = async (pais) => {
    // En una app real, esto sería una llamada a API
    const estados = {
        us: [
            { value: 'ny', label: 'Nueva York' },
            { value: 'ca', label: 'California' }
        ],
        ca: [
            { value: 'on', label: 'Ontario' },
            { value: 'bc', label: 'Columbia Británica' }
        ]
    };

    // Simular retraso de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return estados[pais] || [];
};

function FormularioUbicacion() {
    return (
        <FormProvider schema={schema}>
            <FormField name="pais" label="País">
                <select>
                    <option value="">Selecciona un país</option>
                    <option value="us">Estados Unidos</option>
                    <option value="ca">Canadá</option>
                </select>
            </FormField>

            <DependantField
                dependsOnField="pais"
                dependentValuesCallback={getEstadosPorPais}
                dependentField="estado"
            >
                <FormField name="estado" label="Estado">
                    {({ field }, dependentValues, isLoading) => (
                        <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                        >
                            {isLoading ? (
                                <option>Cargando...</option>
                            ) : (
                                <>
                                    <option value="">Selecciona un estado</option>
                                    {dependentValues.map((estado) => (
                                        <option key={estado.value} value={estado.value}>
                                            {estado.label}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    )}
                </FormField>
            </DependantField>
        </FormProvider>
    );
}
```

## Props

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `dependsOnField` | `string` | Nombre del campo del que depende este campo |
| `dependentField` | `string` | Nombre opcional del campo dependiente (para estado de validación) |
| `dependentValuesCallback` | `(value: unknown) => Promise<DependentOption[]> \| DependentOption[]` | Función para obtener valores dependientes |
| `children` | `ReactNode` | Campos de formulario para renderizar con valores dependientes |
| `loadingDelay` | `number` | Retraso antes de mostrar el estado de carga (ms) |
| `cacheResults` | `boolean` | Si se deben almacenar en caché los resultados para evitar llamadas API repetidas |

## Características

### Función de Renderizado

El componente hijo `FormField` debe usar una función de renderizado para acceder a los valores dependientes, estado de carga y estado del campo:

```tsx
<FormField name="estado" label="Estado">
    {({ field }, dependentValues, isLoading, styleProps, fieldState) => (
        <select
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            className={cn(
                styleProps.styles.select,
                fieldState.isValid && styleProps.styles.isValid,
                fieldState.isInvalid && styleProps.styles.isInvalid,
                fieldState.isValidating && styleProps.styles.isValidating,
                fieldState.isEmpty && 'text-gray-400'
            )}
        >
            {isLoading ? (
                <option>Cargando...</option>
            ) : (
                // Renderizar opciones
            )}
        </select>
    )}
</FormField>
```

### Estado del Campo

El componente proporciona un objeto `fieldState` con las siguientes propiedades:

```tsx
interface DependentFieldState {
    isValid: boolean;      // Si el campo está en un estado válido
    isInvalid: boolean;    // Si el campo está en un estado inválido
    isValidating: boolean; // Si el campo está actualmente validando
    isEmpty: boolean;      // Si el campo no tiene valores dependientes cargados
}
```

Puedes usar estas propiedades para aplicar estilizado condicional:

```tsx
{({ field }, dependentValues, isLoading, styleProps, fieldState) => (
    <div>
        <select
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className={cn(
                fieldState.isValid && 'border-green-500',
                fieldState.isInvalid && 'border-red-500',
                fieldState.isEmpty && 'text-gray-400'
            )}
        >
            {/* Opciones */}
        </select>
        {fieldState.isValidating && <span>Validando...</span>}
    </div>
)}
```

### Auto Reinicio

El componente reinicia automáticamente el valor del campo dependiente cuando cambia el campo padre:

```tsx
<DependantField
    dependsOnField="pais"
    dependentField="estado"
    dependentValuesCallback={getEstadosPorPais}
>
    {/* Cuando el país cambia, el estado se reiniciará */}
</DependantField>
```

Esto evita que selecciones inválidas persistan cuando cambia el campo padre.

### Estado de Carga

El componente proporciona una bandera `isLoading` para indicar cuándo se están obteniendo los valores dependientes:

```tsx
{isLoading ? (
    <option>Cargando...</option>
) : (
    // Renderizar opciones
)}
```

### Caché de Resultados

Por defecto, los resultados se almacenan en caché para evitar llamadas API innecesarias. Puedes deshabilitar este comportamiento:

```tsx
<DependantField
    dependsOnField="pais"
    dependentValuesCallback={getEstadosPorPais}
    cacheResults={false}
>
    {/* ... */}
</DependantField>
```

### Retraso de Carga

Para evitar parpadeos para respuestas rápidas, puedes establecer un retraso antes de mostrar el estado de carga:

```tsx
<DependantField
    dependsOnField="pais"
    dependentValuesCallback={getEstadosPorPais}
    loadingDelay={500}
>
    {/* ... */}
</DependantField>
```

## Uso Avanzado

### Múltiples Campos Dependientes

Puedes anidar componentes `DependantField` para crear múltiples niveles de dependencias, con cada nivel reiniciándose cuando cambia su padre:

```tsx
<FormField name="pais" label="País">
    <select>{/* opciones de país */}</select>
</FormField>

<DependantField
    dependsOnField="pais"
    dependentField="estado"
    dependentValuesCallback={getEstadosPorPais}
>
    <FormField name="estado" label="Estado">
        {({ field }, estados, isLoadingEstados) => (
            <select>{/* opciones de estado */}</select>
        )}
    </FormField>

    <DependantField
        dependsOnField="estado"
        dependentField="ciudad"
        dependentValuesCallback={getCiudadesPorEstado}
    >
        <FormField name="ciudad" label="Ciudad">
            {({ field }, ciudades, isLoadingCiudades) => (
                <select>{/* opciones de ciudad */}</select>
            )}
        </FormField>
    </DependantField>
</DependantField>
```

### Renderizado de Opciones Personalizado

Puedes personalizar cómo se renderizan las opciones y usar el estado del campo para estilizado:

```tsx
<DependantField
    dependsOnField="categoria"
    dependentField="producto"
    dependentValuesCallback={getProductosPorCategoria}
>
    <FormField name="producto" label="Producto">
        {({ field }, productos, isLoading, styleProps, fieldState) => (
            <div className="select-personalizado">
                {isLoading ? (
                    <div className="spinner-carga">Cargando productos...</div>
                ) : (
                    <ul className={fieldState.isEmpty ? 'text-gray-400' : ''}>
                        {productos.map(producto => (
                            <li
                                key={producto.value}
                                className={field.value === producto.value ? 'seleccionado' : ''}
                                onClick={() => field.onChange(producto.value)}
                            >
                                <img src={producto.imageUrl} alt={producto.label} />
                                <span>{producto.label}</span>
                                <span className="precio">${producto.price}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
    </FormField>
</DependantField>
```

### Manejo de Errores

Puedes manejar errores en el callback de valores dependientes:

```tsx
const getCategoriasConManejodeErrores = async () => {
    try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
            throw new Error('Error al obtener categorías');
        }
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        // Devolver array vacío u opciones por defecto
        return [];
    }
};
```

## Mejores Prácticas

1. **Nomenclatura de Campos**
   - Usa la prop `dependentField` para especificar el nombre del campo dependiente
   - Esto habilita el seguimiento adecuado del estado de validación y la funcionalidad de auto-reinicio

2. **Carga Inicial**
   - Siempre maneja el estado de carga inicial
   - Proporciona un mensaje de carga significativo o un spinner

3. **Manejo de Errores**
   - Implementa manejo de errores en tu función de callback
   - Devuelve un array vacío o por defecto en caso de error

4. **Rendimiento**
   - Usa `cacheResults` para evitar llamadas API innecesarias
   - Establece un `loadingDelay` apropiado para evitar parpadeos

5. **Validación**
   - Añade reglas de validación condicionales basadas en valores de campo dependientes
   - Limpia el valor del campo dependiente cuando cambia el campo padre

6. **Accesibilidad**
   - Asegúrate de que los estados de carga se comuniquen adecuadamente a los lectores de pantalla
   - Mantén la gestión del foco durante la carga y actualizaciones

7. **Reinicio de Campo**
   - El componente reinicia automáticamente el campo dependiente cuando cambia el padre
   - Esto evita que selecciones inválidas persistan

## Componentes Relacionados

- [FormProvider](./form-provider.md) - El componente padre para todos los campos del formulario
- [FormField](./form-field.md) - Para renderizar campos individuales del formulario
- [ConditionalField](./conditional-field.md) - Para renderizar campos condicionalmente

## Ejemplos

Consulta la [sección de ejemplos](/examples/dependent-field) para ver DependantField en acción.
