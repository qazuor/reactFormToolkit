import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { ConditionalFieldsExample } from './components/ConditionalFieldsExample';
import ConditionalFieldsCode from './components/ConditionalFieldsExample.tsx?raw';

export function ConditionalFieldForm() {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    return (
        <ExampleViewer
            title='Conditional Field & Conditional Fields group Example'
            description='A simple form with some conditional fields'
            example={<ConditionalFieldsExample setResult={setResult} />}
            code={ConditionalFieldsCode}
            result={result}
        />
    );
}
