# Qazuor React Form Toolkit

[![npm version](https://img.shields.io/npm/v/@qazuor/react-form-toolkit.svg)](https://www.npmjs.com/package/@qazuor/react-form-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)
[![Zod](https://img.shields.io/badge/Zod-3.22-blue)](https://github.com/colinhacks/zod)

Una biblioteca completa de gestión de formularios React construida con React Hook Form y Zod.

> [!PRECAUCIÓN]
> **Versión Beta**: Este paquete está actualmente en beta. Aunque es estable para la mayoría de los casos de uso, podría haber cambios importantes en futuras versiones.

## Características

- 🎯 **Validación con seguridad de tipos** con esquemas Zod
- 🌍 **Soporte de internacionalización** (Inglés, Español, Ruso, Italiano, Portugués, Francés, Alemán)
- 🎨 **Estilos con Tailwind CSS** con opciones de personalización
- 💅 **Sistema de estilos completo** con anulaciones a nivel de componente
- ⚡ **Agnóstico de framework** (funciona con Next.js, Remix, etc.)
- 📦 **Tree-shakeable** y ligero
- 🧩 **Campos condicionales** para formularios dinámicos
- 🔄 **Campos dependientes** para selecciones en cascada
- 🎭 **Integración con bibliotecas UI** como Material UI, Chakra UI y más

## Instalación

```bash
# npm
npm install @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# yarn
yarn add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod

# pnpm
pnpm add @qazuor/react-form-toolkit react-hook-form @hookform/resolvers zod
```

### Configuración Básica

#### En tu archivo CSS principal

> [!IMPORTANTE]
> Sin esto, tu CSS de Tailwind eliminará las clases necesarias y no estilizará el formulario.

```scss
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@source "../node_modules/@qazuor/react-form-toolkit/dist/index.js";

/* Opcional: Importar estilos predeterminados */
@import "@qazuor/react-form-toolkit/dist/styles.css";
```

#### En tu punto de entrada de la aplicación

```tsx
import '@qazuor/react-form-toolkit/animations.css';
```

## Inicio Rápido

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

function LoginForm() {
  const handleSubmit = async (data) => {
    console.log(data);
    // Enviar a tu API
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
    >
      <FormField
        name="email"
        label="Email"
        required
      >
        <input type="email" />
      </FormField>

      <FormField
        name="password"
        label="Contraseña"
        required
      >
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Documentación

Para documentación detallada y ejemplos, visita nuestro [sitio de documentación](https://qazuor-react-form-toolkit.vercel.app/).

### Componentes Clave

- **FormProvider**: El componente raíz que gestiona el estado del formulario y la validación
- **FormField**: Componente para renderizar entradas de formulario con validación
- **FormButtonsBar**: Componente para renderizar botones de acción del formulario
- **ConditionalField**: Componente para renderizar campos de formulario condicionalmente
- **DependantField**: Componente para campos que dependen de otros campos
- **FieldArray**: Componente para gestionar arrays de formulario dinámicos

## ¿Por qué React Form Toolkit?

**Qazuor React Form Toolkit** combina el poder de React Hook Form y Zod con una API amigable para desarrolladores. Proporciona:

- **Construcción de Formularios Simplificada**: Crea formularios complejos con mínimo código repetitivo
- **Seguridad de Tipos**: Soporte completo de TypeScript con tipos inferidos de esquemas Zod
- **Estilos Flexibles**: Funciona con cualquier biblioteca UI o estilos personalizados
- **Características Avanzadas**: Campos condicionales, campos dependientes y más
- **Gran DX**: API intuitiva y documentación completa

## Comparación con Otras Bibliotecas

| Característica | Qazuor React Form Toolkit | React Hook Form | Formik |
|----------------|-------------------|-----------------|--------|
| Validación de Esquema | ✅ (Zod) | ❌ (requiere resolver) | ❌ (requiere Yup) |
| Soporte TypeScript | ✅ | ✅ | ✅ |
| Componentes UI | ✅ | ❌ | ❌ |
| Campos Condicionales | ✅ | ❌ | ❌ |
| Campos Dependientes | ✅ | ❌ | ❌ |
| Arrays de Campos | ✅ | ✅ | ✅ |
| Internacionalización | ✅ | ❌ | ❌ |
| Sistema de Estilos | ✅ | ❌ | ❌ |

## Hoja de Ruta

- [ ] Componente de Asistente de Formulario
- [ ] Carga de archivos con vista previa
- [ ] Persistencia de formulario (localStorage, sessionStorage)
- [ ] Analíticas de formulario
- [ ] Más integraciones con bibliotecas UI
- [ ] Integración de validación del lado del servidor

## Contribuyendo

¡Damos la bienvenida a contribuciones! Por favor, consulta nuestras [pautas de contribución](https://github.com/qazuor/reactFormToolkit/blob/main/CONTRIBUTING.md) para más detalles.

## Licencia

MIT © [Qazuor](https://github.com/qazuor)
