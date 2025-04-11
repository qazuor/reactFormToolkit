import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

interface FormResultProps {
    result: Record<string, unknown> | null;
}

export function FormResult({ result }: FormResultProps) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!result) {
        return null;
    }

    return (
        <div className='fixed right-4 bottom-4 z-50 w-96 rounded-lg border border-gray-200 bg-white shadow-lg transition-all'>
            <div
                className='flex cursor-pointer items-center justify-between border-b p-3'
                onClick={() => setIsExpanded(!isExpanded)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsExpanded(!isExpanded);
                        e.preventDefault();
                    }
                }}
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role='button'
                tabIndex={0}
            >
                <div className='flex items-center gap-2'>
                    <Check className='h-5 w-5 text-green-500' />
                    <span className='font-medium text-gray-700'>{t('formResults.submissionResult')}</span>
                </div>
                <Button
                    variant='ghost'
                    size='sm'
                    type='button'
                    className='p-1'
                >
                    {isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronUp className='h-4 w-4' />}
                </Button>
            </div>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-200 ease-in-out',
                    isExpanded ? 'max-h-96' : 'max-h-0'
                )}
            >
                <div className='flex items-center justify-between border-b bg-gray-50 p-2'>
                    <span className='text-gray-600 text-sm'>{t('formResults.submittedData')}</span>
                    <Code className='h-4 w-4 text-gray-500' />
                </div>
                <pre className='max-h-80 overflow-auto bg-gray-50 p-4 text-gray-700 text-sm'>
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        </div>
    );
}
