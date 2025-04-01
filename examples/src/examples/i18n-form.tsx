import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { I18nFormExample } from './components/I18nFormExample';
import i18nFormCode from './components/I18nFormExample.tsx?raw';

export function I18nForm() {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title='I18n Form Example'
            description='A form with custom translations and language switching'
            example={<I18nFormExample setResult={setResult} />}
            code={i18nFormCode}
            result={result}
        />
    );
}
