# Contributing to React Form Toolkit

We welcome contributions to React Form Toolkit! This guide will help you get started with the development process.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v7 or higher)

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/your-username/reactFormToolkit.git
   cd reactFormToolkit
   ```
3. Install dependencies
   ```bash
   pnpm install
   ```
4. Start the development environment
   ```bash
   pnpm dev
   ```

This will start both the library in watch mode and the documentation site.

## Project Structure

- `/src` - Library source code
  - `/components` - React components
  - `/hooks` - React hooks
  - `/context` - React context providers
  - `/lib` - Utility functions
  - `/types` - TypeScript type definitions
  - `/i18n` - Internationalization resources
- `/docs` - Documentation site
- `/tests` - Test files

## Development Workflow

1. Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the codebase

3. Write tests for your changes
   ```bash
   pnpm test
   ```

4. Update documentation if necessary

5. Run linting and formatting
   ```bash
   pnpm lint
   pnpm format
   ```

6. Commit your changes with a descriptive message
   ```bash
   git commit -m "feat: add new feature"
   ```

7. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a pull request on GitHub

## Coding Standards

We use [Biome](https://biomejs.dev/) for linting and formatting. Please ensure your code follows our style guidelines by running:

```bash
pnpm lint
pnpm format
```

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid using `any` type
- Use generics where appropriate

### Testing

We use [Vitest](https://vitest.dev/) for testing. Please write tests for all new features and bug fixes:

```bash
pnpm test
```

For specific files:

```bash
pnpm test:file src/tests/components/FormField.test.tsx
```

For coverage:

```bash
pnpm test:coverage
```

## Adding New Features

When adding new features, please follow these guidelines:

1. **Components**
   - Place new components in the appropriate directory
   - Export components from the nearest index.ts file
   - Write comprehensive JSDoc comments
   - Include usage examples in comments

2. **Hooks**
   - Place hooks in the `/hooks` directory
   - Export hooks from `/hooks/index.ts`
   - Document parameters and return values

3. **Utilities**
   - Place utility functions in the `/lib` directory
   - Write pure functions when possible
   - Document parameters and return values

## Internationalization

When adding new text content:

1. Add the English version to `/src/i18n/locales/en.json`
2. Add translations for other supported languages if possible

## Documentation

When adding new features, please update the documentation:

1. Update or create markdown files in `/docs/public/docs/en/` and `/docs/public/docs/es/`
2. Add examples to the documentation site if applicable

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if necessary
3. Make sure your code follows our coding standards
4. Fill out the pull request template
5. Request a review from a maintainer

## Release Process

Maintainers will handle releases using the following process:

1. Update version in package.json
2. Create a new tag
3. Push to GitHub
4. GitHub Actions will publish to npm

## License

By contributing to React Form Toolkit, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

If you have any questions, feel free to open an issue on GitHub or reach out to the maintainers.

Thank you for contributing to React Form Toolkit!
