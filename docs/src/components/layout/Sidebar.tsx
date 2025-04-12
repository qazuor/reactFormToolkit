import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { type Doc, DocsSidebar } from './DocsSidebar';
import { ExamplesSidebar } from './ExamplesSidebar';
import { HomeSidebar } from './HomeSidebar';

interface SidebarProps {
    width: number;
    docs: Doc[];
}

export function Sidebar({ width, docs }: SidebarProps) {
    const location = useLocation();
    const isHomePath = location.pathname === '/';
    const isDocPath = location.pathname.startsWith('/docs');
    const isExamplePath = location.pathname.startsWith('/examples');

    return (
        <aside
            className={cn('bg-white/40 dark:bg-slate-900/40', isHomePath && 'md:hidden')}
            style={{ width }}
        >
            <div
                className='flex flex-col overflow-hidden border-gray-200 md:fixed md:h-[calc(100vh-4rem)] md:border-r md:bg-background md:shadow-md dark:border-gray-700'
                style={{ width }}
            >
                <div className='flex-1 space-y-4 overflow-y-auto pb-10 md:p-6'>
                    <div className='mb-100 md:pb-20'>
                        {isHomePath && <HomeSidebar />}
                        {isDocPath && <DocsSidebar docs={docs} />}
                        {isExamplePath && <ExamplesSidebar />}
                    </div>
                </div>
            </div>
        </aside>
    );
}
