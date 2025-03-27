import { DocsViewer } from '@/components/DocsViewer';
import { Home } from '@/components/Home';
import { Layout } from '@/components/Layout';
import { AsyncValidation } from '@/examples/async-validation';
import { BasicForm } from '@/examples/basic-form';
import { ComplexForm } from '@/examples/complex-form';
import { ErrorsForm } from '@/examples/errors-form';
import { FieldArrayForm } from '@/examples/field-array';
import { GlobalErrors } from '@/examples/global-errors';
import { I18nForm } from '@/examples/i18n-form';
import { StyledForm } from '@/examples/styled-form';
import { ValidationForm } from '@/examples/validation-form';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/docs/readme',
                element: <DocsViewer path='README.md' />
            },
            {
                path: '/docs/api-reference',
                element: <DocsViewer path='api-reference.md' />
            },
            {
                path: '/docs/deployment',
                element: <DocsViewer path='deployment.md' />
            },
            {
                path: '/docs/field-array',
                element: <DocsViewer path='field-array.md' />
            },
            {
                path: '/docs/form-buttons',
                element: <DocsViewer path='form-buttons.md' />
            },
            {
                path: '/docs/form-field',
                element: <DocsViewer path='form-field.md' />
            },
            {
                path: '/docs/form-provider',
                element: <DocsViewer path='form-provider.md' />
            },
            {
                path: '/docs/hooks',
                element: <DocsViewer path='hooks.md' />
            },
            {
                path: '/docs/i18n',
                element: <DocsViewer path='i18n.md' />
            },
            {
                path: '/docs/introduction',
                element: <DocsViewer path='introduction.md' />
            },
            {
                path: '/docs/styling',
                element: <DocsViewer path='styling.md' />
            },
            {
                path: '/docs/utilities',
                element: <DocsViewer path='utilities.md' />
            },
            {
                path: 'examples/basic',
                element: <BasicForm />
            },
            {
                path: 'examples/complex',
                element: <ComplexForm />
            },
            {
                path: 'examples/validation',
                element: <ValidationForm />
            },
            {
                path: 'examples/async',
                element: <AsyncValidation />
            },
            {
                path: 'examples/errors',
                element: <ErrorsForm />
            },
            {
                path: 'examples/i18n',
                element: <I18nForm />
            },
            {
                path: 'examples/styled',
                element: <StyledForm />
            },
            {
                path: 'examples/field-array',
                element: <FieldArrayForm />
            },
            {
                path: 'examples/global-errors',
                element: <GlobalErrors />
            }
        ]
    }
]);
