import { cn } from '@/lib/utils';
import type React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import type { ReactNode } from 'react';
interface MainNavLinkProps {
    path: string;
    text: string;
    icon: ReactNode;
    isActiveUseFullPath?: boolean;
    isAList?: boolean;
    onNavigation?: (path: string) => void;
}

export function MainNavLink({ path, text, icon, isActiveUseFullPath, isAList = true, onNavigation }: MainNavLinkProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = isActiveUseFullPath ? location.pathname === path : location.pathname.startsWith(path);

    const handleClick = (e: React.MouseEvent) => {
        if (onNavigation) {
            e.preventDefault();
            onNavigation(path);
        } else {
            navigate(path);
        }
    };

    const getLink = () => {
        const linkClasses = cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            isAList && 'w-full',
            isActive
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-slate-800'
        );

        return (
            <Link
                to={path}
                className={linkClasses}
                onClick={handleClick}
            >
                {icon}
                {text}
            </Link>
        );
    };

    return isAList ? <li>{getLink()}</li> : getLink();
}
