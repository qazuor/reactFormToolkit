import { useState } from 'react';
import { FormProvider, FormField } from '@qazuor/react-form-toolkit';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BasicForm } from './examples/basic-form';
import { ComplexForm } from './examples/complex-form';
import { ValidationForm } from './examples/validation-form';

export default function App() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('basic');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {t('examples.title')}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('examples.description')}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="basic">
                            {t('examples.tabs.basic')}
                        </TabsTrigger>
                        <TabsTrigger value="complex">
                            {t('examples.tabs.complex')}
                        </TabsTrigger>
                        <TabsTrigger value="validation">
                            {t('examples.tabs.validation')}
                        </TabsTrigger>
                    </TabsList>

                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <TabsContent value="basic">
                            <BasicForm />
                        </TabsContent>
                        <TabsContent value="complex">
                            <ComplexForm />
                        </TabsContent>
                        <TabsContent value="validation">
                            <ValidationForm />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}