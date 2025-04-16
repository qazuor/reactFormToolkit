# Contribuyendo a React Form Toolkit

¡Damos la bienvenida a contribuciones a React Form Toolkit! Esta guía te ayudará a comenzar con el proceso de desarrollo.

## Primeros Pasos

### Prerrequisitos

- Node.js (v16 o superior)
- pnpm (v7 o superior)

### Configuración

1. Haz un fork del repositorio en GitHub
2. Clona tu fork localmente
   ```bash
   git clone https://github.com/tu-usuario/reactFormToolkit.git
   cd reactFormToolkit
   ```
3. Instala dependencias
   ```bash
   pnpm install
   ```
4. Inicia el entorno de desarrollo
   ```bash
   pnpm dev
   ```

Esto iniciará tanto la biblioteca en modo watch como el sitio de documentación.

## Estructura del Proyecto

- `/src` - Código fuente de la biblioteca
  - `/components` - Componentes React
  - `/hooks` - Hooks de React
  - `/context` - Proveedores de contexto React
  - `/lib` - Funciones de utilidad
  - `/types` - Definiciones de tipo TypeScript
  - `/i18n` - Recursos de internacionalización
- `/docs` - Sitio de documentación
- `/tests` - Archivos de prueba

## Flujo de Trabajo de Desarrollo

1. Crea una nueva rama para tu característica o corrección de error
   ```bash
   git checkout -b feature/nombre-de-tu-caracteristica
   ```

2. Realiza tus cambios en el código

3. Escribe pruebas para tus cambios
   ```bash
   pnpm test
   ```

4. Actualiza la documentación si es necesario

5. Ejecuta linting y formateo
   ```bash
   pnpm lint
   pnpm format
   ```

6. Haz commit de tus cambios con un mensaje descriptivo
   ```bash
   git commit -m "feat: añadir nueva característica"
   ```

7. Envía tu rama a tu fork
   ```bash
   git push origin feature/nombre-de-tu-caracteristica
   ```

8. Crea un pull request en GitHub

## Estándares de Codificación

Usamos [Biome](https://biomejs.dev/) para linting y formateo. Por favor, asegúrate de que tu código sigue nuestras pautas de estilo ejecutando:

```bash
pnpm lint
pnpm format
```

### TypeScript

- Usa TypeScript para todo código nuevo
- Proporciona definiciones de tipo adecuadas
- Evita usar el tipo `any`
- Usa genéricos donde sea apropiado

### Pruebas

Usamos [Vitest](https://vitest.dev/) para pruebas. Por favor, escribe pruebas para todas las nuevas características y correcciones de errores:

```bash
pnpm test
```

Para archivos específicos:

```bash
pnpm test:file src/tests/components/FormField.test.tsx
```

Para cobertura:

```bash
pnpm test:coverage
```

## Añadiendo Nuevas Características

Al añadir nuevas características, por favor sigue estas pautas:

1. **Componentes**
   - Coloca nuevos componentes en el directorio apropiado
   - Exporta componentes desde el archivo index.ts más cercano
   - Escribe comentarios JSDoc completos
   - Incluye ejemplos de uso en comentarios

2. **Hooks**
   - Coloca hooks en el directorio `/hooks`
   - Exporta hooks desde `/hooks/index.ts`
   - Documenta parámetros y valores de retorno

3. **Utilidades**
   - Coloca funciones de utilidad en el directorio `/lib`
   - Escribe funciones puras cuando sea posible
   - Documenta parámetros y valores de retorno

## Internacionalización

Al añadir nuevo contenido de texto:

1. Añade la versión en inglés a `/src/i18n/locales/en.json`
2. Añade traducciones para otros idiomas soportados si es posible

## Documentación

Al añadir nuevas características, por favor actualiza la documentación:

1. Actualiza o crea archivos markdown en `/docs/public/docs/en/` y `/docs/public/docs/es/`
2. Añade ejemplos al sitio de documentación si es aplicable

## Proceso de Pull Request

1. Asegúrate de que todas las pruebas pasen
2. Actualiza la documentación si es necesario
3. Asegúrate de que tu código sigue nuestros estándares de codificación
4. Completa la plantilla de pull request
5. Solicita una revisión de un mantenedor

## Proceso de Lanzamiento

Los mantenedores manejarán los lanzamientos usando el siguiente proceso:

1. Actualizar versión en package.json
2. Crear una nueva etiqueta
3. Enviar a GitHub
4. GitHub Actions publicará en npm

## Licencia

Al contribuir a React Form Toolkit, aceptas que tus contribuciones estarán licenciadas bajo la Licencia MIT del proyecto.

## ¿Preguntas?

Si tienes alguna pregunta, no dudes en abrir un issue en GitHub o contactar a los mantenedores.

¡Gracias por contribuir a React Form Toolkit!
