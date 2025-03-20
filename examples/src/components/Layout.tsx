import { cn } from '@/lib/utils';
import { Book, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { MainNakLink } from './MainNavLink';

export function Layout() {
    const { t } = useTranslation();
    const location = useLocation();
    const isDocsRoute = location.pathname === '/';

    return (
        <div className='flex min-h-screen flex-col bg-gray-50'>
            <header className='border-b bg-white px-4 py-3 shadow-sm'>
                <div className='mx-auto flex w-full items-center justify-between'>
                    <div className='flex w-full items-center justify-center gap-8'>
                        <div>
                            <h1 className='font-bold text-gray-900 text-xl'>{t('examples.title')}</h1>
                            <p className='text-gray-600 text-sm'>{t('examples.description')}</p>
                        </div>
                        <nav>
                            <ul className='flex items-center gap-2'>
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
                        </nav>
                    </div>
                </div>
            </header>
            <main className='flex-1 px-4 py-8'>
                <div className='mx-auto max-w-6xl'>
                    <div className={cn('rounded-lg bg-white shadow-lg', isDocsRoute ? 'p-8' : 'p-6')}>
                        <Outlet />
                    </div>
                </div>
            </main>
            <footer className='border-t bg-white px-4 py-6 text-center text-gray-600 text-sm'>
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
            </footer>
        </div>
    );
}
