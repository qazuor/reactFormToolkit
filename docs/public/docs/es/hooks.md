# Hooks

**Qazuor React Form Toolkit** proporciona varios hooks para acceder al estado del formulario y su funcionalidad.

## useFieldState

Hook para acceder al estado de validación del campo.

```tsx
import { useFieldState } from '@qazuor/react-form-toolkit';

function CampoPersonalizado() {
  const { error, isTouched, isDirty, hasError } = useFieldState('email');

  return (
    <div>
      {hasError && <span>{error.message}</span>}
      {isDirty && <span>Campo modificado</span>}
    </div>
  );
}
```

### Retorna

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `error` | `FieldError` | Error de validación actual |
| `isTouched` | `boolean` | Si el campo ha recibido foco |
| `isDirty` | `boolean` | Si el valor ha cambiado |
| `hasError` | `boolean` | Si el campo tiene error |

## useFormWatch

Hook para observar eficientemente cambios en campos del formulario.

```tsx
import { useFormWatch } from '@qazuor/react-form-toolkit';

function FormularioPaisEstado() {
  // Observa el campo país y obtiene estados cuando cambia
  useFormWatch({
    name: 'pais',
    onChange: (value) => {
      obtenerEstados(value as string);
    }
  });

  return (
    <div>
      <FormField name="pais">
        <select>
          <option value="us">Estados Unidos</option>
          <option value="ca">Canadá</option>
        </select>
      </FormField>
    </div>
  );
}
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `name` | `string` | Nombre del campo a observar |
| `onChange` | `(value: unknown) => void` | Callback cuando el campo cambia |
| `executeOnMount` | `boolean` | Si ejecutar callback al montar |
| `skipIfSameValue` | `boolean` | Omitir callback si el valor no ha cambiado |

### Retorna

El valor actual del campo observado.

## useQRFTTranslation

Hook para acceder a traducciones.

```tsx
import { useQRFTTranslation } from '@qazuor/react-form-toolkit';

function CampoPersonalizado() {
  const { t, i18n } = useQRFTTranslation();

  return (
    <div>
      <label>{t('field.label')}</label>
      <span>{t('validation.required')}</span>
    </div>
  );
}
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `options` | `UseTranslationOptions` | Opciones de i18next |

### Retorna

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `t` | `TFunction` | Función de traducción |
| `i18n` | `i18n` | Instancia de i18next |

## useConditionalField

Hook para manejar lógica de campo condicional basada en una sola condición.

```tsx
import { useConditionalField } from '@qazuor/react-form-toolkit';

function CampoCondicionalPersonalizado() {
  const { isConditionMet } = useConditionalField({
    form,
    watchField: 'tipo',
    condition: 'empresa',
    content: <CamposEmpresa />
  });

  return isConditionMet ? <CamposEmpresa /> : null;
}
```

### Parámetros

```typescript
interface UseConditionalFieldOptions<TFieldValues extends FieldValues> {
  form: Form<TFieldValues>;
  watchField: string;
  condition: unknown | ((value: unknown) => boolean);
  content: ReactNode;
  keepRegistered?: boolean;
}
```

### Retorna

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `isConditionMet` | `boolean` | Si la condición se cumple actualmente |

## useConditionalFieldGroup

Hook para manejar lógica de grupo de campos condicionales basada en múltiples condiciones.

```tsx
import { useConditionalFieldGroup } from '@qazuor/react-form-toolkit';

function GrupoCamposCondicionalesPersonalizado() {
  const { currentValue, conditions } = useConditionalFieldGroup({
    form,
    watchField: 'tipo',
    conditions: {
      personal: <CamposPersonales />,
      empresa: <CamposEmpresa />
    }
  });

  return conditions[currentValue] || null;
}
```

### Parámetros

```typescript
interface UseConditionalFieldGroupOptions<TFieldValues extends FieldValues> {
  form: Form<TFieldValues>;
  watchField: string;
  conditions: Record<string, ReactNode>;
  keepRegistered?: boolean;
}
```

### Retorna

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `currentValue` | `string` | Valor actual del campo observado |
| `conditions` | `Record<string, ReactNode>` | Mapa de condiciones a contenido |

## useFieldValidation

Hook para manejar estado de validación de campo y estilizado.

```tsx
import { useFieldValidation } from '@qazuor/react-form-toolkit';

function CampoPersonalizado() {
  const {
    className,
    ariaInvalid,
    asyncError,
    asyncValidating,
    hasAsyncError
  } = useFieldValidation({
    fieldPath: 'email',
    asyncValidation: {
      asyncValidationFn: checkEmail
    }
  });

  return (
    <div>
      <input
        className={className}
        aria-invalid={ariaInvalid}
      />
      {asyncValidating && <span>Verificando...</span>}
      {hasAsyncError && <span>{asyncError}</span>}
    </div>
  );
}
```

### Parámetros

```typescript
interface UseFieldValidationProps {
  fieldPath: string;
  isCheckbox?: boolean;
  mergedStyles: FormProviderStyleOptions;
  asyncValidation?: AsyncValidationProps;
  schema?: ZodType;
  hasError?: boolean;
}
```

### Retorna

```typescript
interface UseValidationReturn {
  className: string;
  ariaInvalid: boolean;
  ariaDescribedBy?: string;
  hasAsyncError: boolean;
  asyncValidating: boolean;
  asyncValidatingStarted: boolean;
  asyncError?: string;
  showValidationIcons: boolean;
  showLoadingSpinner: boolean;
  textWhenValidating?: string;
  textWhenBeforeStartValidating?: string;
}
```

## useDependantField

Hook para manejar valores de campo dependiente basados en el valor de otro campo.

```tsx
import { useDependantField } from '@qazuor/react-form-toolkit';

function CampoDependientePersonalizado() {
  const { dependentValues, isLoading, fieldState } = useDependantField({
    dependsOnField: 'pais',
    dependentField: 'estado',
    dependentValuesCallback: getEstadosPorPais,
    loadingDelay: 300,
    cacheResults: true
  });

  return (
    <div>
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
    </div>
  );
}
```

### Parámetros

```typescript
interface UseDependantFieldOptions {
  dependsOnField: string;
  dependentField?: string;
  dependentValuesCallback: (value: unknown) => Promise<DependentOption[]> | DependentOption[];
  loadingDelay?: number;
  cacheResults?: boolean;
}
```

### Retorna

```typescript
interface UseDependantFieldReturn {
  dependentValues: DependentOption[];
  isLoading: boolean;
  fieldState: DependentFieldState;
}
```

## Mejores Prácticas

1. **Rendimiento**
   - Usa `useFormWatch` en lugar de acceder directamente a los valores del formulario para mejor rendimiento
   - Establece valores de debounce apropiados para operaciones asíncronas

2. **Organización de Componentes**
   - Usa hooks para extraer lógica compleja de tus componentes
   - Crea hooks personalizados para patrones de formulario reutilizables

3. **Seguridad de Tipos**
   - Aprovecha los genéricos de TypeScript para valores de formulario con seguridad de tipos
   - Usa tipado adecuado para parámetros y valores de retorno de hooks

4. **Manejo de Errores**
   - Maneja errores con elegancia en operaciones asíncronas
   - Proporciona UI de respaldo para estados de error

## Ejemplos

### Campo de Formulario Personalizado con Hooks

```tsx
function CampoEmailPersonalizado() {
  const { error, hasError } = useFieldState('email');
  const { t } = useQRFTTranslation();

  const {
    className,
    ariaInvalid,
    asyncValidating
  } = useFieldValidation({
    fieldPath: 'email',
    asyncValidation: {
      asyncValidationFn: async (value) => {
        // Verificar si el email está disponible
        const response = await fetch(`/api/check-email?email=${value}`);
        const data = await response.json();
        return data.available ? true : t('validation.emailTaken');
      },
      asyncValidationDebounce: 500
    }
  });

  return (
    <div className="space-y-2">
      <label htmlFor="email">{t('field.email')}</label>
      <input
        id="email"
        type="email"
        className={className}
        aria-invalid={ariaInvalid}
      />
      {asyncValidating && <span>{t('validation.checking')}</span>}
      {hasError && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}
```

### Observando Múltiples Campos

```tsx
function CalculadoraPrecios() {
  const [total, setTotal] = useState(0);

  const cantidad = useFormWatch({ name: 'cantidad' });
  const precio = useFormWatch({ name: 'precio' });

  useEffect(() => {
    if (cantidad && precio) {
      setTotal(Number(cantidad) * Number(precio));
    }
  }, [cantidad, precio]);

  return (
    <div>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

## Documentación Relacionada

- [Form Provider](./form-provider.md) - El componente padre para todos los campos del formulario
- [Form Field](./form-field.md) - Para renderizar campos individuales del formulario
- [Conditional Field](./conditional-field.md) - Para renderizar campos condicionalmente
- [Dependent Field](./dependent-field.md) - Para campos que dependen de otros campos
