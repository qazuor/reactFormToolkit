import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

import type { ReactNode } from 'react';
interface MainNakLinkProps {
    path: string;
    text: string;
    icon: ReactNode;
    isActiveUseFullPath?: boolean;
    isAList?: boolean;
}

export function MainNakLink({ path, text, icon, isActiveUseFullPath, isAList = true }: MainNakLinkProps) {
    const location = useLocation();
    const isActive = isActiveUseFullPath ? location.pathname === path : location.pathname.startsWith(path);

    const getLink = () => (
        <Link
            to={path}
            className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                isAList && 'w-full',
                isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-slate-800'
            )}
        >
            {icon}
            {text}
        </Link>
    );

    return isAList ? <li>{getLink()}</li> : getLink();
}
