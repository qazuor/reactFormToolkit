import { ExampleViewer } from '@/components/ExampleViewer';
import { useTranslation } from 'react-i18next';
import { GlobalErrorsExample } from './components/GlobalErrorsExample';
import globalErrorsCode from './components/GlobalErrorsExample.tsx?raw';

export function GlobalErrors() {
    const { t } = useTranslation();

    return (
        <ExampleViewer
            title={t('form.globalErrorsTitle')}
            description={t('form.globalErrorsDescription')}
            example={<GlobalErrorsExample />}
            code={globalErrorsCode}
        />
    );
}
