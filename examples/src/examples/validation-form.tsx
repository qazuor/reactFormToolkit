import { ExampleViewer } from '@/components/ExampleViewer';
import { ValidationFormExample } from './components/ValidationFormExample';
import validationFormCode from './components/ValidationFormExample.tsx?raw';

export function ValidationForm() {
    return (
        <ExampleViewer
            title='Validation Form Example'
            description='A registration form with advanced validation rules'
            example={<ValidationFormExample />}
            code={validationFormCode}
        />
    );
}
