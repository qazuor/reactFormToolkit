import { useEffect, useState } from 'react';
import { type Theme, getHighlighter } from 'shiki';

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
                    themes: ['github-dark'],
                    langs: ['typescript', 'tsx', 'javascript', 'jsx']
                });

                await highlighter.loadTheme('github-dark' as Theme);
                const html = highlighter.codeToHtml(code, {
                    lang: language,
                    theme: 'github-dark'
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
        <div className='overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm'>
            {highlightedCode ? (
                <div
                    className='font-mono text-xs leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            ) : (
                <pre className='whitespace-pre-wrap font-mono text-gray-300 text-xs leading-relaxed'>{code}</pre>
            )}
        </div>
    );
}
