# Introducción

**Qazuor React Form Toolkit** es una biblioteca completa de gestión de formularios construida sobre [React Hook Form](https://react-hook-form.com/) y [Zod](https://zod.dev/). Proporciona una forma simple, flexible y con seguridad de tipos para construir y validar formularios en aplicaciones React.

## Características Principales

- 🎯 **Validación con seguridad de tipos** con esquemas Zod
- 🌍 **Soporte de internacionalización** incorporado
- 💅 **Estilos personalizables** con Tailwind CSS
- ⚡ **Validación asíncrona** con estados de carga
- 📦 **Arrays de campos** para campos de formulario dinámicos
- 🔄 **Gestión del estado del formulario** con React Hook Form
- 🎨 **Componentes compuestos** para diseños flexibles
- 🚀 **Agnóstico de framework** - funciona con Next.js, Remix, etc.
- 🧩 **Campos condicionales** para formularios dinámicos
- 🔄 **Campos dependientes** para selecciones en cascada
- 🎭 **Integración con bibliotecas UI** como Material UI, Chakra UI y más

## ¿Por qué React Form Toolkit?

Construir formularios en React puede ser desafiante. Necesitas manejar el estado del formulario, la validación, los mensajes de error y más. **Qazuor React Form Toolkit** simplifica este proceso proporcionando un conjunto de componentes y hooks que manejan toda la complejidad por ti.

### Problemas que Resolvemos

- **Validación de formularios complejos**: La integración con Zod proporciona una potente validación basada en esquemas
- **Seguridad de tipos**: Construido con TypeScript desde cero
- **Gestión del estado del formulario**: Manejo eficiente del estado con React Hook Form
- **Internacionalización**: Soporte i18n incorporado para múltiples idiomas
- **Flexibilidad de UI**: Funciona con cualquier biblioteca o framework de UI
- **Experiencia de desarrollo**: API intuitiva y excelente DX

## Ejemplo Rápido

```tsx
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function LoginForm() {
  const handleSubmit = async (data) => {
    console.log(data);
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

      <button type="submit">
        Iniciar Sesión
      </button>
    </FormProvider>
  );
}
```

## Conceptos Fundamentales

**Qazuor React Form Toolkit** está construido alrededor de algunos conceptos fundamentales:

1. **Form Provider**: El componente raíz que gestiona el estado y la validación del formulario
2. **Form Fields**: Componentes para renderizar y validar campos individuales
3. **Field Arrays**: Soporte para arrays de formularios dinámicos con validación
4. **Async Validation**: Soporte incorporado para validación asíncrona de campos
5. **Form Buttons**: Componentes predefinidos para acciones de formulario
6. **Internationalization**: Soporte multilingüe con i18next
7. **Style System**: Estilos flexibles con Tailwind CSS

Estos conceptos trabajan juntos para proporcionar una solución completa de gestión de formularios.

## Documentación Relacionada

- [Primeros Pasos](/docs/getting-started) - Instalación y configuración básica
- [Form Provider](/docs/form-provider) - Aprende sobre el componente FormProvider
- [Form Field](/docs/form-field) - Explora el componente FormField
- [Validación](/docs/validation) - Aprende sobre la validación de formularios

## Próximos Pasos

¿Listo para comenzar? Dirígete a la guía de [Primeros Pasos](/docs/getting-started) para aprender cómo instalar y configurar React Form Toolkit en tu proyecto.
