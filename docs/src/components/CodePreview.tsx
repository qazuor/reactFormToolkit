import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ClipboardCopy } from 'lucide-react';
import NormalizerModule from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    code: string;
    language?: string;
};

const nw = new NormalizerModule({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 120,
    indent: 1,
    'remove-initial-line-feed': false,
    'tabs-to-spaces': 4
});

export const CodePreview = ({ code, language = 'tsx' }: Props) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const normalizedCode = nw.normalize(code);
    const html = Prism.highlight(normalizedCode, Prism.languages[language] || Prism.languages.tsx, language);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(normalizedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error(t('codePreview.copyToClipboard.error'), error);
        }
    };

    return (
        <div className='relative'>
            <Button
                variant='ghost'
                size='sm'
                onClick={handleCopy}
                className={cn(
                    'absolute top-2 right-2 z-10 flex items-center gap-1 rounded border text-xs hover:bg-zinc-50',
                    copied
                        ? 'border-green-500 bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600'
                        : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600'
                )}
            >
                {copied ? (
                    <>
                        <Check className='h-4 w-4' />
                        {t('codePreview.copyToClipboard.success')}
                    </>
                ) : (
                    <>
                        <ClipboardCopy className='h-4 w-4' />
                        {t('codePreview.copyToClipboard.label')}
                    </>
                )}
            </Button>
            <pre className='overflow-auto rounded-md border border-zinc-200 pt-4 pb-4 dark:border-zinc-700'>
                <code
                    className={`language-${language}`}
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </pre>
        </div>
    );
};
