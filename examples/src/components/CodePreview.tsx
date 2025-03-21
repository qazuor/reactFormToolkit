import { useEffect, useState } from 'react';
import { getHighlighter } from 'shiki';

interface CodePreviewProps {
    code: string;
    language?: string;
}

export function CodePreview({ code, language = 'tsx' }: CodePreviewProps) {
    const [highlightedCode, setHighlightedCode] = useState<string>('');

    useEffect(() => {
        async function highlight() {
            try {
                const highlighter = await getHighlighter({
                    themes: ['github-light'],
                    langs: ['typescript', 'tsx', 'javascript', 'jsx']
                });

                const html = highlighter.codeToHtml(code, {
                    lang: language,
                    theme: 'github-light'
                });
                setHighlightedCode(html);
            } catch (error) {
                console.error('Error initializing syntax highlighter:', error);
                // Fallback to plain text if highlighting fails
                setHighlightedCode(`<pre><code>${code}</code></pre>`);
            }
        }

        highlight();
    }, [code, language]);

    return (
        <div className='overflow-x-auto rounded-lg bg-[var(--shiki-color-background)] p-4'>
            {highlightedCode ? (
                <div
                    className='font-mono text-[13px] leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            ) : (
                <pre className='whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[var(--shiki-color-text)]'>
                    {code}
                </pre>
            )}
        </div>
    );
}
