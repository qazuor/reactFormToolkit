import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { ComplexFormExample } from './components/ComplexFormExample';
import complexFormCode from './components/ComplexFormExample.tsx?raw';

export function ComplexForm() {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title='Complex Form Example'
            description='A contact form with multiple fields and validation'
            example={<ComplexFormExample setResult={setResult} />}
            code={complexFormCode}
            result={result}
        />
    );
}
