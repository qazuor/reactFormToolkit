import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Doc, DocsSidebar } from './DocsSidebar';
import { ExamplesSidebar } from './ExamplesSidebar';
import { HomeSidebar } from './HomeSidebar';

interface SidebarProps {
    width: number;
    docs: Doc[];
    onNavigation?: (path: string) => void;
}

export function Sidebar({ width, docs, onNavigation }: SidebarProps) {
    const location = useLocation();
    const isHomePath = location.pathname === '/';
    const isDocPath = location.pathname.startsWith('/docs');
    const isExamplePath = location.pathname.startsWith('/examples');
    const navigate = useNavigate();

    // Function to handle navigation
    const handleNavigation = (path: string) => {
        if (onNavigation) {
            // If onNavigation is provided (mobile), use it to close the sidebar
            onNavigation(path);
        } else {
            // Otherwise just navigate (desktop)
            navigate(path);
        }
    };

    return (
        <aside
            className={cn('bg-white/40 dark:bg-slate-900/40', isHomePath && 'md:hidden')}
            style={{ width }}
        >
            <div className='flex h-full flex-col overflow-hidden border-gray-200 md:fixed md:h-[calc(100vh-4rem)] md:border-r md:bg-background md:shadow-md dark:border-gray-700'>
                <div className='flex-1 space-y-4 overflow-y-auto p-4 md:p-6'>
                    <div className='pb-4 md:pb-20'>
                        {isHomePath && <HomeSidebar />}
                        {isDocPath && (
                            <DocsSidebar
                                docs={docs}
                                onNavigation={handleNavigation}
                            />
                        )}
                        {isExamplePath && <ExamplesSidebar onNavigation={handleNavigation} />}
                    </div>
                </div>
            </div>
        </aside>
    );
}
