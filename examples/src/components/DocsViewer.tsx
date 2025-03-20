import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

interface DocsViewerProps {
    path: string;
}

export function DocsViewer({ path }: DocsViewerProps) {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(path)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load documentation: ${response.statusText}`);
                }
                return response.text();
            })
            .then((text) => {
                const htmlContent = marked(text, { mangle: false, headerIds: false });
                setContent(htmlContent);
                setError(null);
            })
            .catch((error) => {
                console.error('Error loading documentation:', error);
                setError(t('errors.docLoadFailed'));
            });
    }, [path]);

    if (error) {
        return <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>;
    }

    if (!content) {
        return (
            <div className='flex items-center justify-center p-8'>
                <div className='animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full' />
            </div>
        );
    }

    return (
        <div
            className='prose prose-slate max-w-none dark:prose-invert'
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
