import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorsFormExample } from './components/ErrorsFormExample';
import errorsFormCode from './components/ErrorsFormExample.tsx?raw';

export function ErrorsForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.errorsTitle')}
            description={t('form.errorsDescription')}
            example={<ErrorsFormExample setResult={setResult} />}
            code={errorsFormCode}
            result={result}
        />
    );
}
