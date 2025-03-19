import { createBrowserRouter } from 'react-router-dom';
import { BasicForm } from '@/examples/basic-form';
import { ComplexForm } from '@/examples/complex-form';
import { ValidationForm } from '@/examples/validation-form';
import { Layout } from '@/components/Layout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'examples/basic',
                element: <BasicForm />,
            },
            {
                path: 'examples/complex',
                element: <ComplexForm />,
            },
            {
                path: 'examples/validation',
                element: <ValidationForm />,
            },
        ],
    },
]);