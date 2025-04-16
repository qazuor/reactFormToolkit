# Primeros Pasos

Esta guía te ayudará a configurar React Form Toolkit en tu proyecto y crear tu primer formulario.

## Instalación

Puedes instalar React Form Toolkit usando npm, yarn o pnpm:

```bash
# npm
npm install @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# yarn
yarn add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# pnpm
pnpm add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod
```

## Configuración Básica

### Configuración de CSS

Para asegurar un estilo adecuado, necesitas importar el archivo CSS en tu punto de entrada principal:

```tsx
// En tu archivo de entrada principal (ej., main.tsx, App.tsx)
import '@qazuor/react-form-toolkit/animations.css';
```

Si estás usando Tailwind CSS, asegúrate de incluir lo siguiente en tu archivo CSS:

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/@qazuor/react-form-toolkit/dist/index.js";
```

### Creando Tu Primer Formulario

Vamos a crear un formulario de login simple con campos para email y contraseña:

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

// Define el esquema del formulario usando Zod
const schema = z.object({
  email: z.string().email('Por favor ingresa un correo electrónico válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

// Infiere el tipo del esquema
type LoginFormValues = z.infer<typeof schema>;

function LoginForm() {
  // Maneja el envío del formulario
  const handleSubmit = async (data: LoginFormValues) => {
    console.log('Formulario enviado:', data);
    // Puedes hacer llamadas a API aquí
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{ email: '', password: '' }}
    >
      <FormField
        name="email"
        label="Correo Electrónico"
        required
        tooltip="Ingresa tu dirección de correo electrónico"
      >
        <input type="email" placeholder="Ingresa tu correo" />
      </FormField>

      <FormField
        name="password"
        label="Contraseña"
        required
        tooltip="La contraseña debe tener al menos 8 caracteres"
      >
        <input type="password" placeholder="Ingresa tu contraseña" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Componentes Clave

### FormProvider

El componente `FormProvider` es la base de React Form Toolkit. Gestiona el estado del formulario, la validación y proporciona contexto a los componentes hijos.

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  defaultValues={defaultValues}
  mode="onBlur"
>
  {/* Campos del formulario */}
</FormProvider>
```

Aprende más sobre [FormProvider](./form-provider.md).

### FormField

El componente `FormField` maneja campos individuales del formulario con validación, etiquetas, descripciones y mensajes de error.

```tsx
<FormField
  name="email"
  label="Correo Electrónico"
  required
  description="Nunca compartiremos tu correo"
  tooltip="Ingresa tu correo electrónico principal"
>
  <input type="email" />
</FormField>
```

Aprende más sobre [FormField](./form-field.md).

### FormButtonsBar

El componente `FormButtonsBar` proporciona una forma consistente de renderizar botones de acción del formulario.

```tsx
<FormButtonsBar
  direction="horizontal"
  fullWidth={false}
  onCancel={() => console.log('cancelado')}
/>
```

Aprende más sobre [Form Buttons](./form-buttons.md).

## Características Avanzadas

React Form Toolkit ofrece muchas características avanzadas:

- **Campos Condicionales**: Muestra/oculta campos basados en valores de otros campos
- **Campos Dependientes**: Carga opciones para un campo basado en el valor de otro campo
- **Arrays de Campos**: Arrays de formularios dinámicos con validación
- **Validación Asíncrona**: Valida campos de forma asíncrona con estados de carga
- **Internacionalización**: Soporte para múltiples idiomas
- **Estilos Personalizados**: Personaliza la apariencia de los componentes del formulario

Explora estas características en las respectivas secciones de la documentación.

## Próximos Pasos

Ahora que has configurado tu primer formulario, puedes explorar características más avanzadas:

- [Form Provider](./form-provider.md) - Aprende más sobre la configuración del formulario
- [Form Field](./form-field.md) - Explora opciones de campo y validación
- [Campos Condicionales](./conditional-field.md) - Crea formularios dinámicos
- [Arrays de Campos](./field-array.md) - Trabaja con arrays dinámicos de campos
- [Validación](./validation.md) - Aprende sobre opciones de validación

## Solución de Problemas

### Problemas Comunes

- **Problemas de estilo**: Asegúrate de haber importado el archivo CSS correctamente
- **Errores de tipo**: Asegúrate de estar utilizando los tipos correctos para los valores de tu formulario
- **La validación no funciona**: Verifica que tu esquema Zod esté correctamente definido

Si encuentras algún problema, consulta el [repositorio de GitHub](https://github.com/qazuor/reactFormToolkit) para problemas conocidos o para reportar uno nuevo.
