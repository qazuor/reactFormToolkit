import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

import type { ReactNode } from 'react';
interface MainNakLinkProps {
    path: string;
    text: string;
    icon: ReactNode;
}

export function MainNakLink({ path, text, icon }: MainNakLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <li>
            <Link
                to={path}
                className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
            >
                {icon}
                {text}
            </Link>
        </li>
    );
}
