# Utilidades

React Form Toolkit proporciona funciones de utilidad para operaciones comunes de formularios.

## Utilidades de Formulario

### formUtils

```tsx
import { formUtils } from '@qazuor/react-form-toolkit';

// Verificar si un campo es requerido
const isRequired = formUtils.isFieldRequired('email', schema);

// Obtener reglas de validación del campo
const validation = formUtils.getFieldValidation('email', schema);
```

#### Métodos

| Nombre | Parámetros | Retorna | Descripción |
|--------|------------|---------|-------------|
| `isFieldRequired` | `fieldName: string, schema?: ZodType` | `boolean` | Verifica si el campo es requerido |
| `getFieldValidation` | `fieldName: string, schema?: ZodType` | `object` | Obtiene reglas de validación del campo |

## Utilidades i18n

### i18nUtils

```tsx
import { i18nUtils } from '@qazuor/react-form-toolkit';

// Inicializar instancia i18n
const i18n = i18nUtils.initializeI18n(options);

// Obtener idioma actual
const lang = i18nUtils.getCurrentLanguage(i18n);

// Obtener traducción
const text = i18nUtils.getTranslation(i18n, 'path.to.key');
```

#### Métodos

| Nombre | Parámetros | Retorna | Descripción |
|--------|------------|---------|-------------|
| `initializeI18n` | `options?: I18nOptions` | `i18n` | Inicializar instancia i18n |
| `getTranslation` | `i18n: i18n, path: string, params?: object` | `string` | Obtener traducción |
| `getCurrentLanguage` | `i18n: i18n` | `string` | Obtener idioma actual |

## Utilidades de Estilo

### Fusión de Estilos

```tsx
import { mergeStyles } from '@qazuor/react-form-toolkit';

const estilosFinales = mergeStyles(
  estilosPredeterminados,
  estilosProveedor,
  estilosComponente
);
```

### Nombres de Clase

```tsx
import { cn } from '@qazuor/react-form-toolkit';

const className = cn(
  'clase-base',
  isActive && 'activo',
  variant === 'primary' && 'primario'
);
```

## Utilidades de Tipo

### Esquema de Formulario

```tsx
import type { FormSchema } from '@qazuor/react-form-toolkit';

type Schema = FormSchema<typeof zodSchema>;
```

### Tipos de Estilo

```tsx
import type {
  FormProviderStyleOptions,
  ComponentStyleOptions
} from '@qazuor/react-form-toolkit';

const styles: FormProviderStyleOptions = {
  field: {
    input: 'input-personalizado',
    label: 'label-personalizado'
  }
};
```

### Tipos de Validación

```tsx
import type {
  AsyncValidationProps,
  ValidationState
} from '@qazuor/react-form-toolkit';

const asyncValidation: AsyncValidationProps = {
  asyncValidationFn: checkEmail,
  asyncValidationDebounce: 500
};
```

## Utilidades Avanzadas

### Utilidades de Campo Condicional

```tsx
import { findFieldNames, evaluateCondition } from '@qazuor/react-form-toolkit';

// Encontrar todos los nombres de campo en un árbol de nodos React
const fieldNames = findFieldNames(myComponent);

// Evaluar una condición contra un valor
const isConditionMet = evaluateCondition(fieldValue, condition);
```

### Utilidades de Biblioteca UI

```tsx
import { shouldApplyInputStyles, getUiLibraryCompatibleStyles } from '@qazuor/react-form-toolkit';

// Verificar si se deben aplicar estilos de entrada predeterminados
const shouldApply = shouldApplyInputStyles(uiLibrary);

// Obtener estilos compatibles con bibliotecas UI
const compatibleStyles = getUiLibraryCompatibleStyles(styles);
```

## Mejores Prácticas

### Usando Utilidades de Estilo

```tsx
// Combinar múltiples nombres de clase condicionalmente
const inputClassName = cn(
  'input-base',
  isValid && 'input-valido',
  isInvalid && 'input-invalido',
  isDisabled && 'input-deshabilitado'
);

// Fusionar objetos de estilo
const estilosFusionados = mergeStyles(
  estilosPredeterminados,
  {
    field: {
      input: 'input-personalizado'
    }
  }
);
```

### Usando Utilidades de Formulario

```tsx
// Determinar dinámicamente si un campo es requerido
function MiCampo({ name }) {
  const isRequired = formUtils.isFieldRequired(name, schema);

  return (
    <div>
      <label>{name} {isRequired && '*'}</label>
      <input />
    </div>
  );
}

// Obtener reglas de validación para lógica de validación personalizada
function ValidacionPersonalizada({ name }) {
  const rules = formUtils.getFieldValidation(name, schema);

  // Usar reglas para validación personalizada
  console.log('Reglas de validación:', rules);

  return null;
}
```

### Usando Utilidades i18n

```tsx
// Inicializar i18n con recursos personalizados
const i18n = i18nUtils.initializeI18n({
  resources: {
    es: {
      validation: {
        custom: 'Mensaje de validación personalizado'
      }
    }
  },
  lng: 'es'
});

// Obtener traducciones con parámetros
const message = i18nUtils.getTranslation(i18n, 'validation.minLength', { min: 8 });
```

## Ejemplos

### Componente de Formulario Personalizado con Utilidades

```tsx
import { cn, formUtils, useQRFTTranslation } from '@qazuor/react-form-toolkit';

function FormularioPersonalizado({ schema, children }) {
  const { t } = useQRFTTranslation();

  // Procesar children para añadir indicadores de requerido
  const processedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === FormField) {
      const fieldName = child.props.name;
      const isRequired = formUtils.isFieldRequired(fieldName, schema);

      return React.cloneElement(child, {
        required: isRequired,
        label: `${child.props.label} ${isRequired ? '*' : ''}`,
        className: cn(
          child.props.className,
          'campo-personalizado'
        )
      });
    }
    return child;
  });

  return (
    <FormProvider schema={schema}>
      <div className="formulario-personalizado">
        <h2>{t('form.title')}</h2>
        {processedChildren}
      </div>
    </FormProvider>
  );
}
```

### Generación Dinámica de Formulario

```tsx
import { formUtils, cn } from '@qazuor/react-form-toolkit';

function FormularioDinamico({ schema, onSubmit }) {
  // Generar campos de formulario desde el esquema
  const fields = Object.entries(schema.shape).map(([name, fieldSchema]) => {
    const isRequired = formUtils.isFieldRequired(name, schema);
    const fieldType = getTipoCampo(fieldSchema); // Función personalizada para determinar tipo de campo

    return (
      <FormField
        key={name}
        name={name}
        label={formatearNombreCampo(name)} // Función personalizada para formatear nombre de campo
        required={isRequired}
        className={cn(
          'campo-dinamico',
          `tipo-campo-${fieldType}`
        )}
      >
        {renderizarCampoPorTipo(fieldType, name)} {/* Función personalizada para renderizar campo por tipo */}
      </FormField>
    );
  });

  return (
    <FormProvider schema={schema} onSubmit={onSubmit}>
      {fields}
      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Documentación Relacionada

- [Form Provider](./form-provider.md) - El componente padre para todos los campos del formulario
- [Form Field](./form-field.md) - Para renderizar campos individuales del formulario
- [Styling](./styling.md) - Para más información sobre opciones de estilizado
- [Internationalization](./i18n.md) - Para más información sobre opciones i18n
