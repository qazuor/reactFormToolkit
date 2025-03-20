import { ExampleViewer } from '@/components/ExampleViewer';
import { BasicFormExample } from './components/BasicFormExample';
import basicFormCode from './components/BasicFormExample.tsx?raw';

export function BasicForm() {
    return (
        <ExampleViewer
            title='Basic Form Example'
            description='A simple login form with email and password fields'
            example={<BasicFormExample />}
            code={basicFormCode}
        />
    );
}
