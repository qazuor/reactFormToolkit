import { Book, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface HomeSidebarProps {
    onNavigation?: (path: string) => void;
}

export function HomeSidebar({ onNavigation }: HomeSidebarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = (path: string) => {
        if (onNavigation) {
            onNavigation(path);
        } else {
            navigate(path);
        }
    };

    return (
        <div className='space-y-4'>
            <div>
                <ul className='space-y-2'>
                    <li>
                        <button
                            type='button'
                            onClick={() => handleClick('/docs')}
                            className='flex items-center gap-2 rounded-md px-3 py-2 text-foreground text-sm transition-colors hover:bg-muted'
                        >
                            <Book className='h-4 w-4' />
                            {t('docs.title')}
                        </button>
                    </li>
                    <li>
                        <button
                            type='button'
                            onClick={() => handleClick('/examples')}
                            className='flex items-center gap-2 rounded-md px-3 py-2 text-foreground text-sm transition-colors hover:bg-muted'
                        >
                            <Code className='h-4 w-4' />
                            {t('examples.title')}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
