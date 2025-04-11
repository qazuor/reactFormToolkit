# Deployment Guide

## Publishing to NPM

1. Update version in package.json
```bash
pnpm version patch # or minor/major
```

2. Build the package
```bash
pnpm run build
```

3. Publish to NPM
```bash
pnpm publish --access public
```

## Deploying Docs to Vercel

1. Push your changes to GitHub

2. Connect your repository to Vercel:
   - Create a new project in Vercel
   - Select your repository
   - Configure build settings:
     - Framework Preset: Vite
     - Root Directory: docs
     - Build Command: npm run build
     - Output Directory: dist

3. Deploy:
   - Vercel will automatically deploy on push to main branch
   - Manual deployment can be triggered from Vercel dashboard

## Environment Variables

### NPM Package
- No environment variables required for the main package

### Examples Application
- Configure the following in Vercel:
  ```
  VITE_API_URL=your_api_url
  ```

## Continuous Integration

GitHub Actions workflow for automated publishing:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```
