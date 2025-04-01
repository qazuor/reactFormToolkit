import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DependentFieldsExample } from './components/DependentFieldsExample';
import dependentFieldsCode from './components/DependentFieldsExample.tsx?raw';

export function DependentFields() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.dependentFieldsTitle')}
            description={t('form.dependentFieldsDescription')}
            example={<DependentFieldsExample setResult={setResult} />}
            code={dependentFieldsCode}
            result={result}
        />
    );
}
