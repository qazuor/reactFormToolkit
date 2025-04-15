import { cn } from '@/lib/utils';
import type React from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainNavLinkProps {
    path: string;
    text: string;
    icon?: ReactNode;
    isActiveUseFullPath?: boolean;
    isAList?: boolean;
    onNavigation?: (path: string) => void;
    className?: string;
}

export function MainNavLink({
    path,
    text,
    icon,
    isActiveUseFullPath,
    isAList = true,
    onNavigation,
    className
}: MainNavLinkProps) {
    const location = useLocation();
    const isActive = isActiveUseFullPath ? location.pathname === path : location.pathname.startsWith(path);

    const handleClick = (e: React.MouseEvent) => {
        if (onNavigation) {
            e.preventDefault();
            onNavigation(path);
        }
    };

    const getLink = () => {
        const linkClasses = cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            isAList && 'w-full',
            isActive
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-slate-800',
            className
        );

        return (
            <Link
                to={path}
                className={linkClasses}
                onClick={handleClick}
            >
                {icon && icon}
                {text}
            </Link>
        );
    };

    return isAList ? <li>{getLink()}</li> : getLink();
}
