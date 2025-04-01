import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prism-themes/themes/prism-ghcolors.css';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import Normalizer from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    code: string;
    language?: string;
};

const nw = new Normalizer({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 80,
    indent: 1,
    'remove-initial-line-feed': false,
    'tabs-to-spaces': 4
});

export const CodePreview = ({ code, language = 'tsx' }: Props) => {
    const { t } = useTranslation();
    const ref = useRef<HTMLElement>(null);
    code = nw.normalize(code);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (ref.current) {
            Prism.highlightElement(ref.current);
        }
    }, [code]);

    return (
        <pre className='overflow-auto rounded-md border bg-zinc-50 p-4 text-sm dark:bg-zinc-900'>
            <code
                ref={ref}
                className={`language-${language}`}
                data-prismjs-copy={t('copyToClipboard.label')}
                data-prismjs-copy-error={t('copyToClipboard.error')}
                data-prismjs-copy-success={t('copyToClipboard.success')}
            >
                {code}
            </code>
        </pre>
    );
};
