import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export function LanguageSelector() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant='ghost'
            size='sm'
            type='button'
            onClick={toggleLanguage}
            className='text-gray-600 hover:text-gray-900'
        >
            {i18n.language === 'en' ? 'ES' : 'EN'}
        </Button>
    );
}
