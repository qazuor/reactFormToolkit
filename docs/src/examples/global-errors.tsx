import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalErrorsExample } from './components/GlobalErrorsExample';
import globalErrorsCode from './components/GlobalErrorsExample.tsx?raw';

export function GlobalErrors() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.globalErrorsTitle')}
            description={t('form.globalErrorsDescription')}
            example={<GlobalErrorsExample setResult={setResult} />}
            code={globalErrorsCode}
            result={result}
        />
    );
}
