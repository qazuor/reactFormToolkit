import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import i18n from './i18n';
import { router } from './routes';
import './index.css';
import { I18nextProvider } from 'react-i18next';
import '@qazuor/react-form-toolkit/animations.css';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <Suspense fallback='loading'>
                <RouterProvider router={router} />
            </Suspense>
        </I18nextProvider>
    </StrictMode>
);
