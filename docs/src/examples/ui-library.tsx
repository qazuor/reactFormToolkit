import { ExampleViewer } from '@/components/ExampleViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Theme, useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChakraUIExample } from './components/uilibraries/ChakraUIExample';
import chakraUICode from './components/uilibraries/ChakraUIExample.tsx?raw';
import { MaterialUIExample } from './components/uilibraries/MaterialUIExample';
import materialUICode from './components/uilibraries/MaterialUIExample.tsx?raw';
import { ShadcnUIExample } from './components/uilibraries/ShadcnUIExample';
import shadcnUICode from './components/uilibraries/ShadcnUIExample.tsx?raw';

export function UILibrary() {
    const { t } = useTranslation();
    const [shadcnResult, setShadcnResult] = useState<Record<string, unknown> | null>(null);
    const [materialResult, setMaterialResult] = useState<Record<string, unknown> | null>(null);
    const [chakraResult, setChakraResult] = useState<Record<string, unknown> | null>(null);
    const [activeTab, setActiveTab] = useState('shadcn');
    const { theme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(theme);

    // Listen for theme changes using a window event listener
    useEffect(() => {
        // Set initial theme
        setCurrentTheme(theme);

        // Create a handler for theme changes
        const handleThemeChange = () => {
            // Get the current theme from localStorage to ensure we have the latest value
            const storedTheme = localStorage.getItem('app-theme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                setCurrentTheme(storedTheme as Theme);
            }
        };

        // Add event listener for theme changes
        window.addEventListener('themeChange', handleThemeChange);

        // Clean up event listener
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    const getActiveResult = () => {
        switch (activeTab) {
            case 'shadcn':
                return shadcnResult;
            case 'material':
                return materialResult;
            case 'chakra':
                return chakraResult;
            default:
                return null;
        }
    };

    const getActiveCode = () => {
        switch (activeTab) {
            case 'shadcn':
                return shadcnUICode;
            case 'material':
                return materialUICode;
            case 'chakra':
                return chakraUICode;
            default:
                return '';
        }
    };

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='mb-2 font-bold text-2xl'>
                    {t('form.uiLibrary.title')} ({currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'})
                </h2>
                <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('form.uiLibrary.description')}
                </p>
            </div>

            <Tabs
                defaultValue='shadcn'
                onValueChange={setActiveTab}
                className='w-full'
            >
                <TabsList className='mb-4'>
                    <TabsTrigger value='shadcn'>Shadcn UI</TabsTrigger>
                    <TabsTrigger value='material'>Material UI</TabsTrigger>
                    <TabsTrigger value='chakra'>Chakra UI</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='shadcn'
                    className='p-6'
                >
                    <ExampleViewer
                        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} UI Example`}
                        description=''
                        example={
                            <ShadcnUIExample
                                setResult={setShadcnResult}
                                currentTheme={currentTheme}
                            />
                        }
                        code={getActiveCode()}
                        result={getActiveResult()}
                    />
                </TabsContent>

                <TabsContent
                    value='material'
                    className='p-6'
                >
                    <ExampleViewer
                        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} UI Example`}
                        description=''
                        example={
                            <MaterialUIExample
                                setResult={setMaterialResult}
                                currentTheme={currentTheme}
                            />
                        }
                        code={getActiveCode()}
                        result={getActiveResult()}
                    />
                </TabsContent>

                <TabsContent
                    value='chakra'
                    className='p-6'
                >
                    <ExampleViewer
                        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} UI Example`}
                        description=''
                        example={
                            <ChakraUIExample
                                setResult={setChakraResult}
                                currentTheme={currentTheme}
                            />
                        }
                        code={getActiveCode()}
                        result={getActiveResult()}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
