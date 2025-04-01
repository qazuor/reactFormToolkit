import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

interface FormResultProps {
    result: Record<string, unknown>;
}

export function FormResult({ result }: FormResultProps) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => {
        setVisible(!visible);
    };

    return (
        <div className=''>
            <Button
                variant='outline'
                type='button'
                onClick={toggleVisible}
                className='absolute ml-52 bg-gray-300'
            >
                {visible ? t('form.hideResult') : t('form.viewResult')}
            </Button>
            {visible && (
                <pre className='absolute z-50 mt-10 ml-52 min-h-30 min-w-96 overflow-x-auto rounded-lg border bg-gray-300 p-4 shadow-lg'>
                    {JSON.stringify(result, null, '  ')}
                </pre>
            )}
        </div>
    );
}
