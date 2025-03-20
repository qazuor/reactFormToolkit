import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BasicForm } from './examples/basic-form';
import { ComplexForm } from './examples/complex-form';
import { ValidationForm } from './examples/validation-form';

export default function App() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('basic');

    return (
        <div className='min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl'>
                <div className='mb-12 text-center'>
                    <h1 className='mb-4 font-bold text-4xl text-gray-900'>{t('examples.title')}</h1>
                    <p className='text-gray-600 text-lg'>{t('examples.description')}</p>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                >
                    <TabsList className='mb-8 grid grid-cols-3'>
                        <TabsTrigger value='basic'>{t('examples.tabs.basic')}</TabsTrigger>
                        <TabsTrigger value='complex'>{t('examples.tabs.complex')}</TabsTrigger>
                        <TabsTrigger value='validation'>{t('examples.tabs.validation')}</TabsTrigger>
                    </TabsList>

                    <div className='rounded-lg bg-white p-6 shadow-lg'>
                        <TabsContent value='basic'>
                            <BasicForm />
                        </TabsContent>
                        <TabsContent value='complex'>
                            <ComplexForm />
                        </TabsContent>
                        <TabsContent value='validation'>
                            <ValidationForm />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
