import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nFormExample } from './components/I18nFormExample';
import i18nFormCode from './components/I18nFormExample.tsx?raw';

export function I18nForm() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.i18nTitle')}
            description={t('form.i18nDescription')}
            example={<I18nFormExample setResult={setResult} />}
            code={i18nFormCode}
            result={result}
        />
    );
}
