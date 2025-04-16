# React Hook Form vs **Qazuor React Form Toolkit**

Esta comparación ilustra cómo se verían los formularios usando **React Hook Form puro** versus usando **Qazuor React Form Toolkit**, destacando las diferencias en estructura, código repetitivo y mantenibilidad.

## Motivación

La motivación principal detrás de **Qazuor React Form Toolkit** es **reducir el código repetitivo** al trabajar con formularios. Si bien React Hook Form es una excelente biblioteca, a menudo requiere patrones de código repetitivos para escenarios comunes de formularios. **Qazuor React Form Toolkit** se construye sobre React Hook Form para proporcionar una API más declarativa, componentes incorporados para patrones comunes y características adicionales que simplifican el desarrollo diario de aplicaciones web.

## Ejemplo de Formulario Básico

Comparemos un formulario de inicio de sesión simple con campos para email y contraseña.

### Usando React Hook Form (Vanilla)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

type FormValues = z.infer<typeof schema>;

function FormularioLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Enviar datos a API
      console.log('Formulario enviado:', data);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={`w-full rounded-md border p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
}
```

### Usando Qazuor React Form Toolkit

```tsx
import { FormProvider, FormField, FormButtonsBar } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

type FormValues = z.infer<typeof schema>;

function FormularioLogin() {
  const handleSubmit = async (data: FormValues) => {
    try {
      // Enviar datos a API
      console.log('Formulario enviado:', data);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      return error; // Devolver error para mostrar como error global
    }
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{ email: '', password: '' }}
    >
      <FormField name="email" label="Email" required>
        <input type="email" />
      </FormField>

      <FormField name="password" label="Contraseña" required>
        <input type="password" />
      </FormField>

      <FormButtonsBar submitText="Iniciar Sesión" />
    </FormProvider>
  );
}
```

## Ejemplo de Formulario Complejo

Ahora comparemos un formulario más complejo con campos condicionales, validación y arrays de campos.

### Usando React Hook Form (Vanilla)

```tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un email válido'),
  tipoCuenta: z.enum(['personal', 'empresa']),
  // Campos condicionales
  nombreEmpresa: z.string().optional(),
  identificacionFiscal: z.string().optional(),
  // Array de campos
  contactos: z.array(
    z.object({
      nombre: z.string().min(2, 'El nombre del contacto es requerido'),
      email: z.string().email('Por favor ingresa un email válido')
    })
  ).min(1, 'Se requiere al menos un contacto')
});

type FormValues = z.infer<typeof schema>;

function FormularioComplejo() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      email: '',
      tipoCuenta: 'personal',
      nombreEmpresa: '',
      identificacionFiscal: '',
      contactos: [{ nombre: '', email: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactos'
  });

  // Observar tipo de cuenta para campos condicionales
  const tipoCuenta = watch('tipoCuenta');

  // Reiniciar campos condicionales cuando cambia el tipo de cuenta
  useEffect(() => {
    if (tipoCuenta === 'personal') {
      setValue('nombreEmpresa', '');
      setValue('identificacionFiscal', '');
    }
  }, [tipoCuenta, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Enviar datos a API
      console.log('Formulario enviado:', data);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="nombre" className="block text-sm font-medium">
            Nombre
          </label>
          <input
            id="nombre"
            {...register('nombre')}
            className={`w-full rounded-md border p-2 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="tipoCuenta" className="block text-sm font-medium">
            Tipo de Cuenta
          </label>
          <select
            id="tipoCuenta"
            {...register('tipoCuenta')}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="personal">Personal</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>

        {/* Campos condicionales */}
        {tipoCuenta === 'empresa' && (
          <>
            <div className="space-y-2">
              <label htmlFor="nombreEmpresa" className="block text-sm font-medium">
                Nombre de la Empresa
              </label>
              <input
                id="nombreEmpresa"
                {...register('nombreEmpresa')}
                className={`w-full rounded-md border p-2 ${errors.nombreEmpresa ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombreEmpresa && (
                <p className="text-sm text-red-500">{errors.nombreEmpresa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="identificacionFiscal" className="block text-sm font-medium">
                Identificación Fiscal
              </label>
              <input
                id="identificacionFiscal"
                {...register('identificacionFiscal')}
                className={`w-full rounded-md border p-2 ${errors.identificacionFiscal ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.identificacionFiscal && (
                <p className="text-sm text-red-500">{errors.identificacionFiscal.message}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Array de campos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contactos</h3>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">Contacto {index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-md bg-red-100 px-2 py-1 text-sm text-red-600 hover:bg-red-200"
                >
                  Eliminar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={`contactos.${index}.nombre`} className="block text-sm font-medium">
                  Nombre del Contacto
                </label>
                <input
                  id={`contactos.${index}.nombre`}
                  {...register(`contactos.${index}.nombre`)}
                  className={`w-full rounded-md border p-2 ${
                    errors.contactos?.[index]?.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactos?.[index]?.nombre && (
                  <p className="text-sm text-red-500">{errors.contactos?.[index]?.nombre?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor={`contactos.${index}.email`} className="block text-sm font-medium">
                  Email del Contacto
                </label>
                <input
                  id={`contactos.${index}.email`}
                  type="email"
                  {...register(`contactos.${index}.email`)}
                  className={`w-full rounded-md border p-2 ${
                    errors.contactos?.[index]?.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactos?.[index]?.email && (
                  <p className="text-sm text-red-500">{errors.contactos?.[index]?.email?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ nombre: '', email: '' })}
          className="rounded-md bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200"
        >
          Añadir Contacto
        </button>

        {errors.contactos && errors.contactos.message && (
          <p className="text-sm text-red-500">{errors.contactos.message}</p>
        )}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Reiniciar
        </button>
      </div>
    </form>
  );
}
```

### Usando Qazuor React Form Toolkit

```tsx
import { FormProvider, FormField, FormButtonsBar, ConditionalField, FieldArray } from '@qazuor/react-form-toolkit';
import { z } from 'zod';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un email válido'),
  tipoCuenta: z.enum(['personal', 'empresa']),
  // Campos condicionales
  nombreEmpresa: z.string().optional(),
  identificacionFiscal: z.string().optional(),
  // Array de campos
  contactos: z.array(
    z.object({
      nombre: z.string().min(2, 'El nombre del contacto es requerido'),
      email: z.string().email('Por favor ingresa un email válido')
    })
  ).min(1, 'Se requiere al menos un contacto')
});

type FormValues = z.infer<typeof schema>;

function FormularioComplejo() {
  const handleSubmit = async (data: FormValues) => {
    try {
      // Enviar datos a API
      console.log('Formulario enviado:', data);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      return error; // Devolver error para mostrar como error global
    }
  };

  return (
    <FormProvider
      schema={schema}
      onSubmit={handleSubmit}
      defaultValues={{
        nombre: '',
        email: '',
        tipoCuenta: 'personal',
        nombreEmpresa: '',
        identificacionFiscal: '',
        contactos: [{ nombre: '', email: '' }]
      }}
    >
      <div className="space-y-6">
        <FormField name="nombre" label="Nombre" required>
          <input type="text" />
        </FormField>

        <FormField name="email" label="Email" required>
          <input type="email" />
        </FormField>

        <FormField name="tipoCuenta" label="Tipo de Cuenta">
          <select>
            <option value="personal">Personal</option>
            <option value="empresa">Empresa</option>
          </select>
        </FormField>

        {/* Campos condicionales */}
        <ConditionalField watchField="tipoCuenta" condition="empresa">
          <div className="space-y-4">
            <FormField name="nombreEmpresa" label="Nombre de la Empresa">
              <input type="text" />
            </FormField>

            <FormField name="identificacionFiscal" label="Identificación Fiscal">
              <input type="text" />
            </FormField>
          </div>
        </ConditionalField>

        {/* Array de campos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contactos</h3>

          <FieldArray name="contactos" minItems={1}>
            <div className="space-y-4">
              <FormField name="nombre" label="Nombre del Contacto" required>
                <input type="text" />
              </FormField>

              <FormField name="email" label="Email del Contacto" required>
                <input type="email" />
              </FormField>
            </div>
          </FieldArray>
        </div>

        <FormButtonsBar />
      </div>
    </FormProvider>
  );
}
```

## Diferencias Clave

### 1. Reducción de Código Repetitivo

**Qazuor React Form Toolkit** reduce significativamente el código repetitivo:

- **Sin manejo manual de errores**: La visualización de errores se maneja automáticamente
- **Sin registro manual de campos**: Los campos se registran a través de componentes
- **Botones de formulario incorporados**: Las acciones comunes de formulario están pre-construidas
- **Manejo automático de etiquetas y descripciones**: No es necesario crear etiquetas manualmente

### 2. API Declarativa

**Qazuor React Form Toolkit** proporciona una API más declarativa:

- **Enfoque basado en componentes**: La estructura del formulario se define a través de componentes
- **Configuración basada en props**: El comportamiento se configura a través de props
- **Patrones consistentes**: Los patrones comunes están estandarizados

### 3. Características Avanzadas

**Qazuor React Form Toolkit** incluye soporte incorporado para características avanzadas:

- **Campos condicionales**: Mostrar/ocultar campos basados en valores de otros campos
- **Campos dependientes**: Cargar opciones basadas en valores de otros campos
- **Arrays de campos**: Arrays dinámicos de campos con validación
- **Validación asíncrona**: Validar campos de forma asíncrona con estados de carga
- **Internacionalización**: Soporte para múltiples idiomas
- **Integración con bibliotecas UI**: Funciona con Material UI, Chakra UI y más

### 4. Seguridad de Tipos

Ambas bibliotecas proporcionan seguridad de tipos, pero **Qazuor React Form Toolkit** lo hace más sencillo:

- **Inferencia automática de tipos**: Los tipos se infieren de los esquemas Zod
- **Tipos de props de componentes**: Todas las props de componentes están correctamente tipadas
- **Tipos de retorno de hooks**: Todos los hooks devuelven valores correctamente tipados

## Tabla Resumen

| Característica | React Hook Form | React Form Toolkit |
|----------------|----------------|-------------------|
| **Volumen de Código** | Más verboso | Más conciso |
| **Manejo de Errores** | Manual | Automático |
| **Campos Condicionales** | Implementación manual | Componente incorporado |
| **Arrays de Campos** | Configuración manual | Componente incorporado |
| **Estilizado** | Manual | Sistema incorporado |
| **Internacionalización** | Manual | Incorporada |
| **Seguridad de Tipos** | Buena | Excelente |
| **Curva de Aprendizaje** | Moderada | Baja |
| **Flexibilidad** | Muy alta | Alta |
| **Rendimiento** | Excelente | Excelente |

## Cuándo Usar Qazuor React Form Toolkit

Usa **Qazuor React Form Toolkit** cuando:

- Quieras reducir código repetitivo
- Necesites soporte incorporado para patrones avanzados de formulario
- Quieras estilizado y comportamiento consistentes en todos los formularios
- Necesites soporte de internacionalización
- Estés construyendo formularios con requisitos complejos de validación

## Cuándo Usar React Hook Form Directamente

Usa React Hook Form directamente cuando:

- Necesites máximo control sobre cada aspecto del formulario
- Tengas requisitos personalizados muy específicos que no encajen con los patrones de React Form Toolkit
- Estés construyendo un formulario muy simple con validación mínima
- Necesites minimizar el tamaño del bundle al mínimo absoluto

## Conclusión

**Qazuor React Form Toolkit** se construye sobre la sólida base de React Hook Form para proporcionar una experiencia más amigable para el desarrollador. Al reducir el código repetitivo y proporcionar soluciones incorporadas para patrones comunes de formularios, te permite construir formularios complejos más rápido mientras mantienes los beneficios de rendimiento de React Hook Form.

La elección entre las dos bibliotecas depende de tus necesidades específicas, pero para la mayoría de las aplicaciones, **Qazuor React Form Toolkit** proporcionará una mejor experiencia de desarrollo y un tiempo de desarrollo más rápido.
