# Referencia de API

La siguiente es una referencia completa de la API de **Qazuor React Form Toolkit**.

## FormProvider

Componente raíz que gestiona el estado del formulario y la validación.

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormField name="email">
    <input type="email" />
  </FormField>
</FormProvider>
```

Proporciona contexto de formulario y maneja la gestión del estado del formulario, validación y envío.

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `schema` | `z.ZodType` | - | Esquema Zod para validación del formulario |
| `onSubmit` | `(data: T) => void \| Promise<void>` | - | Manejador de envío del formulario |
| `defaultValues` | `DefaultValues<T>` | `{}` | Valores iniciales del formulario |
| `mode` | `'onBlur' \| 'onChange' \| 'onSubmit' \| 'onTouched' \| 'all'` | `'onBlur'` | Modo de activación de validación |
| `i18n` | `I18nOptions` | - | Opciones de internacionalización |
| `styleOptions` | `FormProviderStyleOptions` | - | Personalización de estilos |
| `errorDisplayOptions` | `ErrorDisplayOptions` | - | Configuración de visualización de errores |
| `form` | `UseFormReturn<T>` | - | Instancia de formulario externa |

## ConditionalField

Componente para renderizar campos de formulario condicionalmente basados en el valor de otro campo.

```tsx
<ConditionalField
  watchField="accountType"
  condition="business"
  keepRegistered={false}
>
  <FormField name="companyName">
    <input type="text" />
  </FormField>
</ConditionalField>
```

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `watchField` | `string` | - | Nombre del campo a observar para cambios |
| `condition` | `string \| ((value: unknown) => boolean)` | - | Valor a coincidir o función que devuelve booleano |
| `children` | `ReactNode` | - | Contenido a mostrar cuando se cumple la condición |
| `fallback` | `ReactNode` | `null` | Contenido opcional a mostrar cuando no se cumple la condición |
| `keepRegistered` | `boolean` | `false` | Mantener campos registrados cuando están ocultos |

## ConditionalFieldGroup

Componente para alternar entre diferentes conjuntos de campos de formulario basados en el valor de un campo.

```tsx
<ConditionalFieldGroup
  watchField="accountType"
  conditions={{
    personal: <PersonalFields />,
    business: <BusinessFields />
  }}
  className="space-y-4"
/>
```

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `watchField` | `string` | - | Nombre del campo a observar para cambios |
| `conditions` | `Record<string, ReactNode>` | - | Mapa de valores de campo a contenido |
| `fallback` | `ReactNode` | `null` | Contenido a mostrar cuando ninguna condición coincide |
| `className` | `string` | `''` | Clase CSS opcional para el contenedor |
| `keepRegistered` | `boolean` | `false` | Mantener campos registrados cuando están ocultos |

## FormField

Componente para renderizar entradas de formulario con validación.

```tsx
<FormField
  name="email"
  label="Email"
  required
  tooltip="Ingresa tu email"
>
  <input type="email" />
</FormField>
```

Maneja renderizado de campo, validación y visualización de errores.

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `name` | `string` | - | Nombre del campo que coincide con el esquema |
| `label` | `string` | - | Texto de la etiqueta del campo |
| `required` | `boolean` | `false` | Si el campo es requerido |
| `description` | `string \| ReactNode` | - | Descripción del campo |
| `tooltip` | `string` | - | Contenido del tooltip |
| `children` | `ReactNode` | - | Elemento de entrada |
| `descriptionOptions` | `DescriptionOptions` | - | Configuración de la descripción |
| `tooltipOptions` | `TooltipOptions` | - | Configuración del tooltip |
| `styleOptions` | `ComponentStyleOptions` | - | Anulaciones de estilo |
| `errorDisplayOptions` | `ErrorDisplayOptions` | - | Configuración de visualización de errores |
| `asyncValidation` | `AsyncValidationProps` | - | Configuración de validación asíncrona |

## FormButtonsBar

Componente para renderizar botones de acción del formulario.

```tsx
<FormButtonsBar
  direction="horizontal"
  fullWidth={false}
  onCancel={() => console.log('cancelled')}
/>
```

Proporciona botones de envío, reinicio y cancelación con estilizado y comportamiento consistentes.

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección del layout de botones |
| `fullWidth` | `boolean` | `false` | Hacer que los botones ocupen todo el ancho |
| `className` | `string` | - | Clase CSS del contenedor |
| `buttonStyles` | `ButtonStyleOptions` | - | Estilos personalizados de botones |
| `showSubmit` | `boolean` | `true` | Mostrar botón de envío |
| `showReset` | `boolean` | `true` | Mostrar botón de reinicio |
| `showCancel` | `boolean` | `true` | Mostrar botón de cancelar |
| `submitText` | `string` | `'Submit'` | Texto personalizado del botón de envío |
| `resetText` | `string` | `'Reset'` | Texto personalizado del botón de reinicio |
| `cancelText` | `string` | `'Cancel'` | Texto personalizado del botón de cancelar |
| `onCancel` | `() => void` | - | Manejador de cancelación |
| `children` | `ReactNode` | - | Botones adicionales |

## FieldArray

Componente para gestionar arrays de formulario dinámicos.

```tsx
<FieldArray name="contacts" minItems={1} maxItems={5}>
  <FormField name="name">
    <input type="text" />
  </FormField>
</FieldArray>
```

Habilita arrays de formulario dinámicos con soporte de validación.

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `name` | `string` | - | Nombre del campo array |
| `children` | `ReactNode` | - | Campos de formulario a repetir |
| `minItems` | `number` | `0` | Mínimo de elementos requeridos |
| `maxItems` | `number` | - | Máximo de elementos permitidos |
| `addButtonText` | `string` | `'Add'` | Texto personalizado del botón añadir |
| `removeButtonText` | `string` | `'Remove'` | Texto personalizado del botón eliminar |
| `className` | `string` | - | Clases CSS del contenedor |
| `buttonClassName` | `string` | - | Clases CSS de los botones |

## DependantField

Componente para gestionar campos que dependen del valor de otro campo.

```tsx
<DependantField
  dependsOnField="country"
  dependentValuesCallback={getStatesByCountry}
>
  <FormField name="state">
    {({ field }, dependentValues, isLoading) => (
      <select>
        {isLoading ? (
          <option>Cargando...</option>
        ) : (
          dependentValues.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    )}
  </FormField>
</DependantField>
```

Habilita la carga dinámica de opciones basada en el valor de otro campo.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `dependsOnField` | `string` | Nombre del campo del que depende este campo |
| `dependentField` | `string` | Nombre opcional del campo dependiente (para estado de validación) |
| `dependentValuesCallback` | `(value: unknown) => Promise<DependentOption[]> \| DependentOption[]` | Función para obtener valores dependientes |
| `children` | `ReactNode` | Campos de formulario para renderizar con valores dependientes |
| `loadingDelay` | `number` | Retraso antes de mostrar el estado de carga (ms) |
| `cacheResults` | `boolean` | Si se deben almacenar en caché los resultados para evitar llamadas API repetidas |

## FormDescription

Componente para descripciones a nivel de formulario.

```tsx
<FormDescription position="above">
  Por favor completa todos los campos requeridos
</FormDescription>
```

Renderiza texto de descripción a nivel de formulario con soporte de posicionamiento.

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `children` | `ReactNode` | - | Contenido de la descripción |
| `position` | `'above' \| 'below'` | `'above'` | Posición relativa al formulario |
| `className` | `string` | - | Clases CSS personalizadas |
| `id` | `string` | - | ID de elemento personalizado |

## ErrorDisplayOptions

Opciones de configuración para visualización de mensajes de error.

```tsx
const options: ErrorDisplayOptions = {
  position: 'below',
  animation: 'fadeIn',
  showIcon: true
};
```

Controla cómo se muestran los errores de validación.

| Opción | Tipo | Predeterminado | Descripción |
|--------|------|----------------|-------------|
| `position` | `'below' \| 'above' \| 'right' \| 'tooltip'` | `'below'` | Posición del mensaje de error |
| `animation` | `'none' \| 'fadeIn' \| 'slideIn' \| 'pulse' \| 'shake'` | `'none'` | Tipo de animación de error |
| `showIcon` | `boolean` | `true` | Mostrar icono de error |
| `groupErrors` | `boolean` | `false` | Agrupar todos los errores juntos |
| `maxErrors` | `number` | - | Máximo de errores a mostrar cuando están agrupados |
| `delay` | `number` | `0` | Retraso antes de mostrar error |
| `autoDismiss` | `boolean` | `false` | Auto ocultar errores |
| `dismissAfter` | `number` | `5000` | Tiempo antes de auto ocultamiento |

## AsyncValidationProps

Configuración para validación asíncrona de campo.

```tsx
const asyncValidation: AsyncValidationProps = {
  asyncValidationFn: checkEmail,
  asyncValidationDebounce: 500
};
```

Controla el comportamiento de validación asíncrona.

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `asyncValidationFn` | `(value: unknown) => Promise<boolean \| string>` | - | Función de validación |
| `asyncValidationDebounce` | `number` | `500` | Retraso de debounce en ms |
| `showValidationIcons` | `boolean` | `true` | Mostrar iconos de estado de validación |
| `showLoadingSpinner` | `boolean` | `true` | Mostrar spinner de carga |
| `textWhenValidating` | `string` | - | Texto durante validación |
| `textWhenBeforeStartValidating` | `string` | - | Texto antes de validación |

## Hooks

### useFieldState

```tsx
const { error, isTouched, isDirty, hasError } = useFieldState('email');
```

Devuelve estado de validación para un campo.

### useFormWatch

```tsx
const value = useFormWatch({
  name: 'email',
  onChange: (value) => console.log(value)
});
```

Observa un campo para cambios.

### useQRFTTranslation

```tsx
const { t, i18n } = useQRFTTranslation();
```

Proporciona funciones de traducción.

### useConditionalField

```tsx
const { isConditionMet } = useConditionalField({
  form,
  watchField: 'type',
  condition: 'business'
});
```

Gestiona visibilidad de campo condicional.

### useConditionalFieldGroup

```tsx
const { currentValue, conditions } = useConditionalFieldGroup({
  form,
  watchField: 'type',
  conditions: {
    personal: <CamposPersonales />,
    business: <CamposEmpresa />
  }
});
```

Gestiona visibilidad de grupo de campos condicionales.

### useFieldValidation

```tsx
const {
  className,
  ariaInvalid,
  asyncError,
  asyncValidating
} = useFieldValidation({
  fieldPath: 'email',
  asyncValidation: {
    asyncValidationFn: checkEmail
  }
});
```

Gestiona estado de validación de campo y estilizado.

### useDependantField

```tsx
const { dependentValues, isLoading, fieldState } = useDependantField({
  dependsOnField: 'country',
  dependentValuesCallback: getStatesByCountry
});
```

Gestiona valores de campo dependiente.

## Funciones de Utilidad

### formUtils

```tsx
const isRequired = formUtils.isFieldRequired('email', schema);
const validation = formUtils.getFieldValidation('email', schema);
```

Funciones de utilidad para operaciones de formulario.

### i18nUtils

```tsx
const i18n = i18nUtils.initializeI18n(options);
const lang = i18nUtils.getCurrentLanguage(i18n);
const text = i18nUtils.getTranslation(i18n, 'path.to.key');
```

Funciones de utilidad para internacionalización.

### Utilidades de Estilo

```tsx
const finalStyles = mergeStyles(defaultStyles, providerStyles, componentStyles);
const className = cn('base-class', isActive && 'active');
```

Funciones de utilidad para estilizado.
