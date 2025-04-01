import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldArrayExample } from './components/FieldArrayExample';
import fieldArrayFormCode from './components/FieldArrayExample.tsx?raw';

export function FieldArrayForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.fieldArrayTitle')}
            description={t('form.fieldArrayDescription')}
            example={<FieldArrayExample setResult={setResult} />}
            code={fieldArrayFormCode}
            result={result}
        />
    );
}
