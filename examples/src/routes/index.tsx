import DocsPage from '@/components/DocsPage';
import { Home } from '@/components/Home';
import { Layout } from '@/components/Layout';
import { AsyncValidation } from '@/examples/async-validation';
import { BasicForm } from '@/examples/basic-form';
import { ComplexForm } from '@/examples/complex-form';
import { ConditionalFieldForm } from '@/examples/conditional-field-form';
import { DependentFields } from '@/examples/dependent-field';
import { ErrorsForm } from '@/examples/errors-form';
import { FieldArrayForm } from '@/examples/field-array';
import { GlobalErrors } from '@/examples/global-errors';
import { I18nForm } from '@/examples/i18n-form';
import { NativeInputs } from '@/examples/native-inputs';
import { StyledForm } from '@/examples/styled-form';
import { UILibrary } from '@/examples/ui-library';
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
                path: '/docs/*',
                element: <DocsPage />
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
            },
            {
                path: 'examples/conditional-field',
                element: <ConditionalFieldForm />
            },
            {
                path: 'examples/dependent-fields',
                element: <DependentFields />
            },
            {
                path: 'examples/native-inputs',
                element: <NativeInputs />
            },
            {
                path: 'examples/ui-library',
                element: <UILibrary />
            }
        ]
    }
]);
