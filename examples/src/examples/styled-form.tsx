import { ExampleViewer } from '@/components/ExampleViewer';
import { useTranslation } from 'react-i18next';
import { StyledFormExample } from './components/StyledFormExample';
import styledFormCode from './components/StyledFormExample.tsx?raw';

export function StyledForm() {
    const { t } = useTranslation();

    return (
        <ExampleViewer
            title={t('form.styledTitle')}
            description={t('form.styledDescription')}
            example={<StyledFormExample />}
            code={styledFormCode}
        />
    );
}
