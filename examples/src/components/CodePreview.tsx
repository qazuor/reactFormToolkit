interface CodePreviewProps {
    code: string;
    language?: string;
}

export function CodePreview({ code, language = 'tsx' }: CodePreviewProps) {
    return (
        <div className='rounded-lg bg-gray-50 p-4'>
            <pre className='whitespace-pre-wrap'>{code}</pre>
        </div>
    );
}
