import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { BasicFormExample } from './components/BasicFormExample';
import basicFormCode from './components/BasicFormExample.tsx?raw';
import { useTranslation } from 'react-i18next';

export function BasicForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.basicTitle')}
            description={t('form.basicDescription')}
            example={<BasicFormExample setResult={setResult} />}
            code={basicFormCode}
            result={result}
        />
    );
}
