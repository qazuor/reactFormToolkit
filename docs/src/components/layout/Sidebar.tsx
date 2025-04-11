import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
    width: number;
    docs: any[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function Sidebar({ width, docs, searchQuery, setSearchQuery }: SidebarProps) {
    const { t } = useTranslation();

    return (
        <aside
            className='hidden border-r bg-muted/40 md:block'
            style={{ width }}
        >
            <div
                className='fixed flex h-[calc(100vh-4rem)] flex-col'
                style={{ width }}
            >
                <div className='flex-1 space-y-6 overflow-y-auto p-6'>
                    <div className='relative md:hidden'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='pl-9'
                        />
                    </div>
                    <SidebarContent docs={docs} />
                </div>
            </div>
        </aside>
    );
}
