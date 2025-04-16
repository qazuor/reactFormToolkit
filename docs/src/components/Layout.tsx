import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { withErrorBoundary } from './ErrorBoundary';
import { Footer } from './layout/Footer';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';

const SIDEBAR_WIDTH = 300;

export function Layout() {
    const location = useLocation();
    const isHomeRoute = location.pathname === '/';
    const [searchQuery] = useState('');

    const [docs, setDocs] = useState([]);

    useEffect(() => {
        fetch('/docs/docs-index.json')
            .then((res) => res.json())
            .then(setDocs)
            .catch(() => setDocs([]));
    }, []);

    const SafeComponent = withErrorBoundary(Outlet);

    return (
        <div className='flex min-h-screen flex-col bg-background text-foreground'>
            <Header
                searchQuery={searchQuery}
                sidebarWidth={SIDEBAR_WIDTH}
                sidebarDocs={docs}
            />
            <div className='flex-1'>
                <div className='hidden md:block'>
                    <Sidebar
                        width={SIDEBAR_WIDTH}
                        docs={docs}
                    />
                </div>
                <main className='flex-1 overflow-hidden pb-16'>
                    <div className='container mx-auto max-w-4xl px-4 py-12'>
                        <div className={cn(isHomeRoute && 'p-10')}>
                            <SafeComponent />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
