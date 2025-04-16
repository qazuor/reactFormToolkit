import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MarkdownLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * Custom link component that uses React Router's Link for internal navigation
 * and regular anchor tags for external links
 */
export function MarkdownLink({ href, children, className, ...props }: MarkdownLinkProps) {
    // Check if the link is internal (starts with / but not with // for external links)
    const isInternalLink = href && href.startsWith('/') && !href.startsWith('//');

    if (isInternalLink) {
        return (
            <Link
                to={href}
                className={cn('text-primary hover:underline', className)}
                {...props}
            >
                {children}
            </Link>
        );
    }

    // External links
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('text-primary hover:underline', className)}
            {...props}
        >
            {children}
        </a>
    );
}
