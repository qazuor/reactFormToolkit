import { ExampleViewer } from '@/components/ExampleViewer';
import { useTranslation } from 'react-i18next';
import { FieldArrayExample } from './components/FieldArrayExample';
import fieldArrayFormCode from './components/FieldArrayExample.tsx?raw';

export function FieldArrayForm() {
    const { t } = useTranslation();

    return (
        <ExampleViewer
            title={t('form.fieldArrayTitle')}
            description={t('form.fieldArrayDescription')}
            example={<FieldArrayExample />}
            code={fieldArrayFormCode}
        />
    );
}
