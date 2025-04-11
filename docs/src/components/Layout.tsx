import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { withErrorBoundary } from './ErrorBoundary';
import { Footer } from './layout/Footer';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';

const SIDEBAR_WIDTH = 320;

export function Layout() {
    const location = useLocation();
    const isDocsRoute = location.pathname === '/';
    const [searchQuery, setSearchQuery] = useState('');

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
                docs={docs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className='flex flex-1'>
                <Sidebar
                    width={SIDEBAR_WIDTH}
                    docs={docs}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <main className='flex-1 overflow-hidden'>
                    <div className='container mx-auto max-w-4xl px-4 py-12'>
                        <div className={cn(isDocsRoute && 'p-10')}>
                            <SafeComponent />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
