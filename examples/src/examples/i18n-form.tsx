import { ExampleViewer } from '@/components/ExampleViewer';
import { I18nFormExample } from './components/I18nFormExample';
import i18nFormCode from './components/I18nFormExample.tsx?raw';

export function I18nForm() {
    return (
        <ExampleViewer
            title='I18n Form Example'
            description='A form with custom translations and language switching'
            example={<I18nFormExample />}
            code={i18nFormCode}
        />
    );
}
