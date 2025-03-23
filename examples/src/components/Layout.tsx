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
            <header className='sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm'>
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
                            className='flex items-center gap-4'
                        >
                            <img
                                src='/logo.webp'
                                alt='Qazuor React Form Toolkit'
                                className='h-10 w-auto'
                            />
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
                    <div className='container mx-auto max-w-4xl px-4 py-12'>
                        <div
                            className={cn(
                                'rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5',
                                isDocsRoute && 'p-10'
                            )}
                        >
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
            <footer className='mt-auto border-t bg-white px-4 py-6 text-center text-gray-500 text-sm'>
                <div className='mx-auto max-w-7xl'>
                    <p>
                        {t('examples.footer.text')}{' '}
                        <a
                            href='https://github.com/qazuor'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-medium text-blue-600 transition-colors hover:text-blue-700'
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
                <Link
                    to='/'
                    className={cn(
                        'mb-4 flex w-full items-center space-y-1 rounded-md p-2 font-semibold text-gray-900 text-sm transition-colors',
                        location.pathname === '/'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                >
                    {t('title')}
                </Link>
                <h2 className='font-semibold text-gray-900 text-sm'>{t('docs.title')}</h2>
                <ul className='mt-2 space-y-1'>
                    <MainNakLink
                        path='/docs/readme'
                        text={t('docs.tabs.readme')}
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
                    <MainNakLink
                        path='/docs/i18n'
                        text={t('docs.tabs.i18n')}
                        icon={<Book className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/docs/styling'
                        text={t('docs.tabs.styling')}
                        icon={<Book className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/docs/api-reference'
                        text={t('docs.tabs.api-reference')}
                        icon={<Book className='h-4 w-4' />}
                    />
                </ul>
            </div>
            <div>
                <h2 className='font-semibold text-gray-900 text-sm'>{t('examples.title')}</h2>
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
                    <MainNakLink
                        path='/examples/errors'
                        text={t('examples.tabs.errors')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/i18n'
                        text={t('examples.tabs.i18n')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/styled'
                        text={t('examples.tabs.styled')}
                        icon={<Code className='h-4 w-4' />}
                    />
                </ul>
            </div>
        </div>
    );
}
