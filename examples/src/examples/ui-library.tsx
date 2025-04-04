import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UILibraryExample } from './components/UILibraryExample';
import uiLibraryCode from './components/UILibraryExample.tsx?raw';

export function UILibrary() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title={t('form.uiLibrary.title')}
            description={t('form.uiLibrary.description')}
            example={<UILibraryExample setResult={setResult} />}
            code={uiLibraryCode}
            result={result}
        />
    );
}
