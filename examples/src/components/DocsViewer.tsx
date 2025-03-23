import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getHighlighter } from 'shiki';

interface DocsViewerProps {
    path: string;
}

export function DocsViewer({ path }: DocsViewerProps) {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadContent() {
            try {
                const highlighter = await getHighlighter({
                    themes: ['github-light', 'github-dark'],
                    langs: ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json', 'markdown', 'yaml', 'scss']
                });

                const marked = new Marked(
                    markedHighlight({
                        async: true,
                        async highlight(code, lang) {
                            if (!lang) {
                                return code;
                            }
                            return highlighter.codeToHtml(code, {
                                lang,
                                theme: 'github-light'
                            });
                        }
                    })
                );

                marked.setOptions({
                    gfm: true,
                    breaks: true,
                    headerIds: true,
                    mangle: false
                });

                const response = await fetch(`/docs/${path}`);
                if (!response.ok) {
                    throw new Error(`Failed to load documentation: ${response.statusText}`);
                }
                const text = await response.text();
                const htmlContent = await marked.parse(text);
                setContent(htmlContent);
                setError(null);
            } catch (error) {
                console.error('Error loading documentation:', error);
                setError(t('errors.docLoadFailed'));
            }
        }

        loadContent();
    }, [path, t]);

    if (error) {
        return <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>;
    }

    if (!content) {
        return (
            <div className='flex items-center justify-center p-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
            </div>
        );
    }

    return (
        <div
            className='prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[var(--shiki-color-background)] prose-code:text-[var(--shiki-token-keyword)]'
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
