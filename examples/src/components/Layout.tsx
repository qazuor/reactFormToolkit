import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function Layout() {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <div className='min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl'>
                <div className='mb-12 text-center'>
                    <h1 className='mb-4 font-bold text-4xl text-gray-900'>{t('examples.title')}</h1>
                    <p className='text-gray-600 text-lg'>{t('examples.description')}</p>
                </div>

                <nav className='mb-8'>
                    <ul className='flex justify-center space-x-4'>
                        <li>
                            <Link
                                to='/examples/basic'
                                className={cn(
                                    'rounded-md px-4 py-2 transition-colors',
                                    location.pathname === '/examples/basic'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                {t('examples.tabs.basic')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/examples/complex'
                                className={cn(
                                    'rounded-md px-4 py-2 transition-colors',
                                    location.pathname === '/examples/complex'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                {t('examples.tabs.complex')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/examples/validation'
                                className={cn(
                                    'rounded-md px-4 py-2 transition-colors',
                                    location.pathname === '/examples/validation'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                {t('examples.tabs.validation')}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className='rounded-lg bg-white p-6 shadow-lg'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
