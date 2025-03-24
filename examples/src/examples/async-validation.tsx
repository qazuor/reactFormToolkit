import { ExampleViewer } from '@/components/ExampleViewer';
import { useTranslation } from 'react-i18next';
import { AsyncValidationExample } from './components/AsyncValidationExample';
import asyncValidationCode from './components/AsyncValidationExample.tsx?raw';

export function AsyncValidation() {
    const { t } = useTranslation();

    return (
        <ExampleViewer
            title={t('form.asyncValidationTitle')}
            description={t('form.asyncValidationDescription')}
            example={<AsyncValidationExample />}
            code={asyncValidationCode}
        />
    );
}
