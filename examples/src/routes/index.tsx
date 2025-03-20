import { DocsViewer } from '@/components/DocsViewer';
import { Home } from '@/components/Home';
import { Layout } from '@/components/Layout';
import { BasicForm } from '@/examples/basic-form';
import { ComplexForm } from '@/examples/complex-form';
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
                path: '/docs',
                element: <DocsViewer path='readme.md' />
            },
            {
                path: '/docs/components',
                element: <DocsViewer path='../components.md' />
            },
            {
                path: '/docs/deployment',
                element: <DocsViewer path='../deployment.md' />
            },
            {
                path: '/docs/hooks',
                element: <DocsViewer path='../hooks.md' />
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
            }
        ]
    }
]);
