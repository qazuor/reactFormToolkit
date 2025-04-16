# Integración con Bibliotecas UI

**Qazuor React Form Toolkit** está diseñado para funcionar perfectamente con bibliotecas UI populares. Esta guía explica cómo integrarse con Material UI, Chakra UI y Shadcn UI.

## Visión General

Al integrarse con bibliotecas UI, necesitas:

1. Configurar FormProvider para usar la biblioteca UI
2. Usar funciones de renderizado para conectar campos de formulario con componentes UI
3. Aplicar estilizado y comportamiento apropiados

## Configuración Básica

Para habilitar la integración con bibliotecas UI, usa la prop `uiLibrary` en FormProvider:

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  uiLibrary={{
    enabled: true,
    name: 'material-ui' // o 'chakra-ui', 'shadcn'
  }}
>
  {/* Campos del formulario */}
</FormProvider>
```

Cuando `uiLibrary.enabled` está establecido en `true`, **Qazuor React Form Toolkit**:
- No aplicará sus estilos de entrada predeterminados
- Permitirá que se usen los estilos nativos de la biblioteca UI
- Seguirá manejando el estado del formulario, validación y mensajes de error

## Integración con Material UI

### Configuración

```tsx
import { TextField, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

function FormularioMaterialUI() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      uiLibrary={{ enabled: true, name: 'material-ui' }}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

### Entrada de Texto

```tsx
<FormField name="name" label="Nombre">
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Ingresa tu nombre"
  />
</FormField>
```

### Select

```tsx
<FormField name="country" label="País">
  <Select fullWidth>
    <MenuItem value="">Selecciona un país</MenuItem>
    <MenuItem value="us">Estados Unidos</MenuItem>
    <MenuItem value="ca">Canadá</MenuItem>
  </Select>
</FormField>
```

### Checkbox

```tsx
<FormField name="agree" label="Términos">
  <FormControlLabel
    control={<Checkbox />}
    label="Acepto los términos y condiciones"
  />
</FormField>
```

### Componentes Avanzados

Para componentes más complejos, usa el patrón de función de renderizado:

```tsx
<FormField name="date" label="Fecha">
  {({ field }) => (
    <DatePicker
      value={field.value}
      onChange={(date) => field.onChange(date)}
      renderInput={(params) => <TextField {...params} />}
    />
  )}
</FormField>
```

## Integración con Chakra UI

### Configuración

```tsx
import { Input, Select, Checkbox, FormLabel } from '@chakra-ui/react';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

function FormularioChakraUI() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      uiLibrary={{ enabled: true, name: 'chakra-ui' }}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

### Entrada de Texto

```tsx
<FormField name="name" label="Nombre">
  <Input placeholder="Ingresa tu nombre" />
</FormField>
```

### Select

```tsx
<FormField name="country" label="País">
  <Select placeholder="Selecciona un país">
    <option value="us">Estados Unidos</option>
    <option value="ca">Canadá</option>
  </Select>
</FormField>
```

### Checkbox

```tsx
<FormField name="agree">
  {({ field }) => (
    <Checkbox
      isChecked={field.value}
      onChange={(e) => field.onChange(e.target.checked)}
    >
      Acepto los términos
    </Checkbox>
  )}
</FormField>
```

## Integración con Shadcn UI

### Configuración

```tsx
import { Input, Select, Checkbox } from '@/components/ui';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';

function FormularioShadcnUI() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      uiLibrary={{ enabled: true, name: 'shadcn' }}
    >
      {/* Campos del formulario */}
    </FormProvider>
  );
}
```

### Entrada de Texto

```tsx
<FormField name="name" label="Nombre">
  <Input placeholder="Ingresa tu nombre" />
</FormField>
```

### Select

```tsx
<FormField name="country" label="País">
  {({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un país" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">Estados Unidos</SelectItem>
        <SelectItem value="ca">Canadá</SelectItem>
      </SelectContent>
    </Select>
  )}
</FormField>
```

### Checkbox

```tsx
<FormField name="agree">
  {({ field }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="agree"
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      <label htmlFor="agree">Acepto los términos</label>
    </div>
  )}
</FormField>
```

## Patrones Comunes

### Manejo de Cambios de Valor

Diferentes bibliotecas UI tienen diferentes formas de manejar cambios de valor:

```tsx
// Material UI
<FormField name="country" label="País">
  {({ field }) => (
    <Select
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
    >
      {/* Opciones */}
    </Select>
  )}
</FormField>

// Chakra UI
<FormField name="country" label="País">
  {({ field }) => (
    <Select
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
    >
      {/* Opciones */}
    </Select>
  )}
</FormField>

// Shadcn UI
<FormField name="country" label="País">
  {({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
    >
      {/* Opciones */}
    </Select>
  )}
</FormField>
```

### Estados de Error

Puedes acceder a estados de error para aplicar estilizado de error específico de la biblioteca UI:

```tsx
<FormField name="email" label="Email">
  {({ field }, _, _, fieldState) => (
    <>
      <TextField
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        error={fieldState.isInvalid}
        helperText={fieldState.isInvalid ? "Email inválido" : ""}
      />
    </>
  )}
</FormField>
```

## Mejores Prácticas

1. **Usar Funciones de Renderizado**
   - Para componentes UI complejos, siempre usa el patrón de función de renderizado
   - Esto te da control total sobre cómo se renderiza el componente

2. **Manejo de Errores Consistente**
   - Usa los estados de error nativos de la biblioteca UI cuando sea posible
   - Para visualizaciones de error personalizadas, usa la prop `errorDisplayOptions`

3. **Diseño de Formulario**
   - Usa los componentes de diseño de la biblioteca UI para espaciado consistente
   - Considera usar sistemas de grid para formularios responsivos

4. **Accesibilidad**
   - Asegúrate de que los componentes de la biblioteca UI mantengan la accesibilidad adecuada
   - Prueba con lectores de pantalla y navegación por teclado

5. **Rendimiento**
   - Ten cuidado con los re-renderizados con componentes UI complejos
   - Usa técnicas de memoización cuando sea necesario

## Solución de Problemas

### Problemas Comunes

1. **Manejo de Valores**
   - Diferentes bibliotecas UI manejan los valores de manera diferente
   - Usa console.log para depurar cambios de valor

2. **Conflictos de Estilo**
   - Asegúrate de que `uiLibrary.enabled` esté establecido en `true` para prevenir conflictos de estilo
   - Usa el sistema de temas de la biblioteca UI para estilos consistentes

3. **Tiempo de Validación**
   - Algunas bibliotecas UI tienen su propio tiempo de validación
   - Ajusta la prop `mode` en FormProvider si es necesario

## Ejemplos

Consulta el [ejemplo de Librerías UI](/examples/ui-library) para ver estas integraciones en acción.
