import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AsyncValidationExample } from './components/AsyncValidationExample';
import asyncValidationCode from './components/AsyncValidationExample.tsx?raw';

export function AsyncValidation() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.asyncValidationTitle')}
            description={t('form.asyncValidationDescription')}
            example={<AsyncValidationExample setResult={setResult} />}
            code={asyncValidationCode}
            result={result}
        />
    );
}
