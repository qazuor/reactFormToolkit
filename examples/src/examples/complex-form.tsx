import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { ComplexFormExample } from './components/ComplexFormExample';
import complexFormCode from './components/ComplexFormExample.tsx?raw';
import { useTranslation } from 'react-i18next';

export function ComplexForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.complexTitle')}
            description={t('form.complexDescription')}
            example={<ComplexFormExample setResult={setResult} />}
            code={complexFormCode}
            result={result}
        />
    );
}
