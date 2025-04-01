import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledFormExample } from './components/StyledFormExample';
import styledFormCode from './components/StyledFormExample.tsx?raw';

export function StyledForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.styledTitle')}
            description={t('form.styledDescription')}
            example={<StyledFormExample setResult={setResult} />}
            code={styledFormCode}
            result={result}
        />
    );
}
