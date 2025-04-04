import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeInputsExample } from './components/NativeInputsExample';
import nativeInputsCode from './components/NativeInputsExample.tsx?raw';

export function NativeInputs() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.nativeInputs.title')}
            description={t('form.nativeInputs.description')}
            example={<NativeInputsExample setResult={setResult} />}
            code={nativeInputsCode}
            result={result}
        />
    );
}
