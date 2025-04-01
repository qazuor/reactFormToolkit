import { ExampleViewer } from '@/components/ExampleViewer';
import { useState } from 'react';
import { ValidationFormExample } from './components/ValidationFormExample';
import validationFormCode from './components/ValidationFormExample.tsx?raw';

export function ValidationForm() {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
        <ExampleViewer
            title='Validation Form Example'
            description='A registration form with advanced validation rules'
            example={<ValidationFormExample setResult={setResult} />}
            code={validationFormCode}
            result={result}
        />
    );
}
