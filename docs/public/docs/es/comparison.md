# Comparación con Otras Bibliotecas

Esta guía compara React Form Toolkit con otras bibliotecas populares de formularios para ayudarte a entender sus ventajas y casos de uso.

## React Form Toolkit vs React Hook Form

[React Hook Form](https://react-hook-form.com/) es la base de React Form Toolkit, que la extiende con características adicionales.

### Similitudes

- Ambos usan componentes no controlados para mejor rendimiento
- Ambos soportan validación de formularios
- Ambos tienen re-renderizados mínimos

### Diferencias

| Característica | React Form Toolkit | React Hook Form |
|----------------|-------------------|-----------------|
| Componentes UI | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Validación de Esquema | ✅ Integración Zod incorporada | ❌ Requiere configuración de resolver |
| Campos Condicionales | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Campos Dependientes | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Internacionalización | ✅ Soporte i18n incorporado | ❌ Requiere implementación personalizada |
| Sistema de Estilos | ✅ Sistema de estilos incorporado | ❌ Sin estilizado |
| Integración con Bibliotecas UI | ✅ Soporte incorporado | ❌ Requiere implementación personalizada |

### Comparación de Código

**React Hook Form:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function FormularioLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Contraseña</label>
        <input type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}
```

**React Form Toolkit:**

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function FormularioLogin() {
  const handleSubmit = (data) => console.log(data);

  return (
    <FormProvider schema={schema} onSubmit={handleSubmit}>
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Contraseña">
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## React Form Toolkit vs Formik

[Formik](https://formik.org/) es otra biblioteca popular de formularios para React.

### Similitudes

- Ambos proporcionan validación de formularios
- Ambos tienen componentes a nivel de formulario y campo
- Ambos soportan validación personalizada

### Diferencias

| Característica | React Form Toolkit | Formik |
|----------------|-------------------|--------|
| Rendimiento | ✅ Componentes no controlados | ❌ Componentes controlados (más re-renderizados) |
| Validación de Esquema | ✅ Integración Zod incorporada | ❌ Requiere Yup o validación personalizada |
| Campos Condicionales | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Campos Dependientes | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Internacionalización | ✅ Soporte i18n incorporado | ❌ Requiere implementación personalizada |
| Sistema de Estilos | ✅ Sistema de estilos incorporado | ❌ Sin estilizado |
| Integración con Bibliotecas UI | ✅ Soporte incorporado | ❌ Requiere implementación personalizada |

### Comparación de Código

**Formik:**

```tsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(8, 'Debe tener al menos 8 caracteres').required('Requerido')
});

function FormularioLogin() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" component="div" className="error" />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="div" className="error" />
        </div>

        <button type="submit">Enviar</button>
      </Form>
    </Formik>
  );
}
```

**React Form Toolkit:**

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Debe tener al menos 8 caracteres')
});

function FormularioLogin() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={(data) => console.log(data)}
      defaultValues={{ email: '', password: '' }}
    >
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Contraseña">
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## React Form Toolkit vs React Final Form

[React Final Form](https://final-form.org/react) es una biblioteca de formularios basada en suscripciones.

### Similitudes

- Ambos se enfocan en rendimiento
- Ambos soportan validación de formularios
- Ambos tienen componentes a nivel de campo

### Diferencias

| Característica | React Form Toolkit | React Final Form |
|----------------|-------------------|------------------|
| Validación de Esquema | ✅ Integración Zod incorporada | ❌ Requiere validación personalizada |
| Campos Condicionales | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Campos Dependientes | ✅ Componentes incorporados | ❌ Requiere implementación personalizada |
| Internacionalización | ✅ Soporte i18n incorporado | ❌ Requiere implementación personalizada |
| Sistema de Estilos | ✅ Sistema de estilos incorporado | ❌ Sin estilizado |
| Integración con Bibliotecas UI | ✅ Soporte incorporado | ❌ Requiere implementación personalizada |
| Tamaño del Bundle | ✅ Más pequeño | ❌ Más grande |

### Comparación de Código

**React Final Form:**

```tsx
import { Form, Field } from 'react-final-form';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Requerido';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Dirección de email inválida';
  }
  if (!values.password) {
    errors.password = 'Requerido';
  } else if (values.password.length < 8) {
    errors.password = 'Debe tener al menos 8 caracteres';
  }
  return errors;
};

function FormularioLogin() {
  return (
    <Form
      onSubmit={(values) => console.log(values)}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <Field name="email">
              {({ input, meta }) => (
                <div>
                  <input {...input} type="email" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          <div>
            <label>Contraseña</label>
            <Field name="password">
              {({ input, meta }) => (
                <div>
                  <input {...input} type="password" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          <button type="submit">Enviar</button>
        </form>
      )}
    />
  );
}
```

**React Form Toolkit:**

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Dirección de email inválida'),
  password: z.string().min(8, 'Debe tener al menos 8 caracteres')
});

function FormularioLogin() {
  return (
    <FormProvider
      schema={schema}
      onSubmit={(data) => console.log(data)}
    >
      <FormField name="email" label="Email">
        <input type="email" />
      </FormField>

      <FormField name="password" label="Contraseña">
        <input type="password" />
      </FormField>

      <FormButtonsBar />
    </FormProvider>
  );
}
```

## Cuándo Usar React Form Toolkit

React Form Toolkit es ideal para:

1. **Formularios Complejos**: Cuando necesitas campos condicionales, campos dependientes o arrays de campos
2. **Aplicaciones con Seguridad de Tipos**: Cuando quieres soporte completo de TypeScript
3. **Aplicaciones Internacionalizadas**: Cuando necesitas soporte multi-idioma
4. **Integración con Sistemas de Diseño**: Cuando quieres integrar con bibliotecas UI
5. **Desarrollo Rápido**: Cuando quieres reducir código boilerplate

## Cuándo Usar Otras Bibliotecas

Podrías preferir otras bibliotecas cuando:

1. **Tamaño de Bundle Mínimo**: Si necesitas el tamaño de bundle absolutamente más pequeño
2. **Formularios Simples**: Para formularios muy simples con validación mínima
3. **Lógica de Validación Personalizada**: Si necesitas validación altamente personalizada que no encaja con Zod
4. **Aplicaciones Legacy**: Si estás trabajando con versiones antiguas de React

## Conclusión

React Form Toolkit se basa en las fortalezas de React Hook Form mientras añade características potentes que simplifican el desarrollo de formularios complejos. Es particularmente adecuado para proyectos TypeScript y aplicaciones que requieren comportamiento sofisticado de formularios con mínimo código boilerplate.

Al proporcionar componentes incorporados para patrones comunes de formularios, React Form Toolkit te ayuda a construir formularios robustos más rápido mientras mantiene excelente rendimiento y seguridad de tipos.
