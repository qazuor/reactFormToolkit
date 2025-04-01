import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { ValidationFormExample } from './components/ValidationFormExample';
import validationFormCode from './components/ValidationFormExample.tsx?raw';
import { useTranslation } from 'react-i18next';

export function ValidationForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.validationTitle')}
            description={t('form.validationDescription')}
            example={<ValidationFormExample setResult={setResult} />}
            code={validationFormCode}
            result={result}
        />
    );
}
