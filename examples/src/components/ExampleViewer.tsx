import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CodePreview } from './CodePreview';
import { FormResult } from './FormResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ExampleViewerProps {
    example: ReactNode;
    code: string;
    title: string;
    description?: string;
    result: any;
}

export function ExampleViewer({ example, code, title, description, result }: ExampleViewerProps) {
    const { t } = useTranslation();

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='mb-2 font-bold text-2xl'>{title}</h2>
                {description && <p className='text-gray-600'>{description}</p>}
            </div>
            <FormResult result={result} />
            <Tabs defaultValue='preview'>
                <TabsList>
                    <TabsTrigger value='preview'>{t('examples.tabs.preview')}</TabsTrigger>
                    <TabsTrigger value='code'>{t('examples.tabs.code')}</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='preview'
                    className='rounded-lg border p-6'
                >
                    {example}
                </TabsContent>

                <TabsContent value='code'>
                    <CodePreview
                        code={code}
                        language='tsx'
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
