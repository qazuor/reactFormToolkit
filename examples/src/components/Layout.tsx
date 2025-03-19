import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function Layout() {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {t('examples.title')}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('examples.description')}
                    </p>
                </div>

                <nav className="mb-8">
                    <ul className="flex space-x-4 justify-center">
                        <li>
                            <Link
                                to="/examples/basic"
                                className={cn(
                                    'px-4 py-2 rounded-md transition-colors',
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
                                to="/examples/complex"
                                className={cn(
                                    'px-4 py-2 rounded-md transition-colors',
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
                                to="/examples/validation"
                                className={cn(
                                    'px-4 py-2 rounded-md transition-colors',
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

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}