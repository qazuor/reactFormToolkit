import { Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MainNakLink } from '../MainNavLink';

export function DocsSidebar({ docs }) {
    const { t } = useTranslation();

    console.log('docs sidebar', docs);

    return (
        <div>
            <h2 className='mb-2 hidden font-semibold text-foreground text-sm md:block'>{t('docs.title')}</h2>
            <ul className='mt-2 space-y-1'>
                {docs.map((doc) => (
                    <MainNakLink
                        key={doc.path}
                        path={`/docs/${doc.path.replace(/\.md$/, '')}`}
                        text={t(`docs.tabs.${doc.title}`, { defaultValue: doc.title })}
                        icon={<Book className='h-4 w-4' />}
                    />
                ))}
            </ul>
        </div>
    );
}
