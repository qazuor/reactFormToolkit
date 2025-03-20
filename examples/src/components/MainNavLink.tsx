import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

import type { ReactNode } from 'react';
interface MainNakLinkProps {
    path: string;
    text: string;
    icon: ReactNode;
}

export function MainNakLink({ path, text, icon }: MainNakLinkProps) {
    return (
        <li>
            <Link
                to={path}
                className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                    location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                )}
            >
                {text}
                {icon}
            </Link>
        </li>
    );
}
