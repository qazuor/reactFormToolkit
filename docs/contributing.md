# Contribution Guide

## Table of Contents

- [Contribution Guide](#contribution-guide)
  - [Table of Contents](#table-of-contents)
  - [Contribution Process](#contribution-process)
  - [Development Environment Setup](#development-environment-setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Code Guidelines](#code-guidelines)
  - [Testing](#testing)
  - [Documentation](#documentation)
  - [TODO List](#todo-list)
    - [TODO](#todo)
    - [In Progress](#in-progress)
    - [Pull Request Workflow](#pull-request-workflow)
  - [License](#license)

Contributions are welcome! Please feel free to submit a Pull Request.

## Contribution Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Environment Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/react-form-toolkit.git
cd react-form-toolkit

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development environment
npm run dev
```

## Project Structure

```
/
├── src/
│   ├── components/     # Core components
│   ├── hooks/          # Custom hooks
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Utility functions
│   └── index.ts        # Main entry point
├── tests/              # Tests
├── examples/           # Usage examples
└── docs/               # Documentation
```

## Code Guidelines

- Use TypeScript for all code
- Ensure code passes all tests
- Follow the existing code style (ESLint and Prettier are used)
- Add JSDoc comments for all exported functions and types
- Write tests for new features

## Testing

Run tests with:

```bash
npm test
```

For watch mode:

```bash
npm test -- --watch
```

## Documentation

If you add a new feature, please also update the corresponding documentation. Documentation can be found in the `/docs` folder.

## TODO List

Here are some areas where contributions are especially appreciated:

### TODO

- [ ] Validation
  - [ ] Add Toast as an option to show errors
- [ ] Add more examples
- [ ] Add more testing
- [ ] Field Arrays
- [ ] Conditional Fields
- [ ] Dependants Fields
- [ ] UI
  - [ ] Add styles for non-Tailwind projects
  - [ ] Add extrahtml prop
  - [ ] Add FormLayouts feature
- [ ] Common Form implementations
  - [ ] Signin, Signup, ForgotPassword
  - [ ] Contact us
- [ ] Add form persistence feature
- [ ] Add Form generation from schema feature
- [ ] Add more internationalized texts
- [ ] Add more languages
- [ ] Create a demo website

### In Progress

- [ ] UI
  - [ ] Add info tooltips
  - [ ] support components libraries (shadcn, mantine, MUI, etc)
- [ ] Validation
  - [ ] add form context global errors
  - [ ] make errors msg more flexible and configurable

### Pull Request Workflow

1. Ensure your code passes all tests
2. Update documentation if necessary
3. Update or add tests for your code
4. Ensure your code follows style guidelines
5. Submit PR with a clear description of changes
6. Wait for review and discussion

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT).
