import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { ConditionalFieldsExample } from './components/ConditionalFieldsExample';
import ConditionalFieldsCode from './components/ConditionalFieldsExample.tsx?raw';
import { useTranslation } from 'react-i18next';

export function ConditionalFieldForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    return (
        <ExampleViewer
            title={t('form.conditionalFieldTitle')}
            description={t('form.conditionalFieldDescription')}
            example={<ConditionalFieldsExample setResult={setResult} />}
            code={ConditionalFieldsCode}
            result={result}
        />
    );
}
