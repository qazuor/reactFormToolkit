import { ExampleViewer } from '@/components/ExampleViewer';
import { useTranslation } from 'react-i18next';
import { ErrorsFormExample } from './components/ErrorsFormExample';
import errorsFormCode from './components/ErrorsFormExample.tsx?raw';

export function ErrorsForm() {
    const { t } = useTranslation();

    return (
        <ExampleViewer
            title={t('form.errorsTitle')}
            description={t('form.errorsDescription')}
            example={<ErrorsFormExample />}
            code={errorsFormCode}
        />
    );
}
