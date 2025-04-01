import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { BasicFormExample } from './components/BasicFormExample';
import basicFormCode from './components/BasicFormExample.tsx?raw';

export function BasicForm() {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title='Basic Form Example'
            description='A simple login form with email and password fields'
            example={<BasicFormExample setResult={setResult} />}
            code={basicFormCode}
            result={result}
        />
    );
}
