import { cn } from '@/lib/utils';
import { Book, Code, Github, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';
import { MainNakLink } from './MainNavLink';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const SIDEBAR_WIDTH = 280;

export function Layout() {
    const { t } = useTranslation();
    const location = useLocation();
    const isDocsRoute = location.pathname === '/';

    return (
        <div className='flex min-h-screen flex-col'>
            <header className='border-b bg-white px-4 py-3 shadow-sm sticky top-0 z-50'>
                <div className='mx-auto flex w-full max-w-7xl items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Sheet>
                            <SheetTrigger asChild={true}>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    className='md:hidden'
                                >
                                    <Menu className='h-5 w-5' />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='left'>
                                <div className='mt-8'>
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Link
                            to='/'
                            className='flex items-center gap-2'
                        >
                            <h1 className='font-bold text-gray-900 text-xl'>{t('examples.title')}</h1>
                        </Link>
                    </div>
                    <div className='flex items-center gap-4'>
                        <LanguageSelector />
                        <a
                            href='https://github.com/qazuor/reactFormToolkit'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
                        >
                            <Github className='h-5 w-5' />
                            <span className='hidden sm:inline'>GitHub</span>
                        </a>
                    </div>
                </div>
            </header>
            <div className='flex flex-1'>
                <aside
                    className='hidden border-r bg-gray-50 md:block'
                    style={{ width: SIDEBAR_WIDTH }}
                >
                    <div
                        className='fixed h-[calc(100vh-4rem)] overflow-y-auto'
                        style={{ width: SIDEBAR_WIDTH }}
                    >
                        <div className='p-6'>
                            <SidebarContent />
                        </div>
                    </div>
                </aside>
                <main className='flex-1 overflow-hidden'>
                    <div className='container mx-auto max-w-5xl px-4 py-8'>
                        <div className={cn('rounded-lg bg-white p-6 shadow-lg', isDocsRoute && 'p-8')}>
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
            <footer className='border-t bg-white px-4 py-6 text-center text-gray-600 text-sm'>
                <div className='mx-auto max-w-7xl'>
                    <p>
                        {t('examples.footer.text')}{' '}
                        <a
                            href='https://github.com/qazuor'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                        >
                            Qazuor
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

function SidebarContent() {
    const { t } = useTranslation();

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='font-semibold text-gray-900 text-sm'>Documentation</h2>
                <ul className='mt-2 space-y-1'>
                    <MainNakLink
                        path='/'
                        text='Home'
                        icon={<Book className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/docs/components'
                        text={t('docs.tabs.components')}
                        icon={<Book className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/docs/deployment'
                        text={t('docs.tabs.deployment')}
                        icon={<Book className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/docs/hooks'
                        text={t('docs.tabs.hooks')}
                        icon={<Book className='h-4 w-4' />}
                    />
                </ul>
            </div>
            <div>
                <h2 className='font-semibold text-gray-900 text-sm'>Examples</h2>
                <ul className='mt-2 space-y-1'>
                    <MainNakLink
                        path='/examples/basic'
                        text={t('examples.tabs.basic')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/complex'
                        text={t('examples.tabs.complex')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/validation'
                        text={t('examples.tabs.validation')}
                        icon={<Code className='h-4 w-4' />}
                    />
                </ul>
            </div>
        </div>
    );
}
