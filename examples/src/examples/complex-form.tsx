import { ExampleViewer } from '@/components/ExampleViewer';
import { ComplexFormExample } from './components/ComplexFormExample';
import complexFormCode from './components/ComplexFormExample.tsx?raw';

export function ComplexForm() {
    return (
        <ExampleViewer
            title='Complex Form Example'
            description='A contact form with multiple fields and validation'
            example={<ComplexFormExample />}
            code={complexFormCode}
        />
    );
}
