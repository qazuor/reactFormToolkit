import { Book, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function HomeSidebar() {
    const { t } = useTranslation();
    return (
        <div className='space-y-4'>
            <div>
                <ul className='space-y-2'>
                    <li>
                        <Link
                            to='/docs'
                            className='flex items-center gap-2 rounded-md px-3 py-2 text-foreground text-sm transition-colors hover:bg-muted'
                        >
                            <Book className='h-4 w-4' />
                            {t('docs.title')}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/examples'
                            className='flex items-center gap-2 rounded-md px-3 py-2 text-foreground text-sm transition-colors hover:bg-muted'
                        >
                            <Code className='h-4 w-4' />
                            {t('examples.title')}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
