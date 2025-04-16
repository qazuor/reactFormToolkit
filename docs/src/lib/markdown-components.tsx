import { cn } from '@/lib/utils';
import type React from 'react';
import type { Components } from 'react-markdown';
import { Link } from 'react-router-dom';

/**
 * Custom components for use with react-markdown
 * This provides React Router integration for internal links
 */
export const markdownComponents: Components = {
    // Handle links - use React Router for internal links
    a: (({
        href,
        children,
        className,
        ...props
    }: { href?: string; children?: React.ReactNode; className?: string; [key: string]: unknown }) => {
        // Check if the link is internal (starts with / but not with // for external links)
        if (href?.startsWith('/') && !href.startsWith('//')) {
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
                target='_blank'
                rel='noopener noreferrer'
                className={cn('text-primary hover:underline', className)}
                {...props}
            >
                {children}
            </a>
        );
    }) as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>,

    // Customize other markdown elements as needed
    h1: (({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string; [key: string]: unknown }) => (
        <h1
            className={cn('mt-8 mb-4 font-bold text-3xl', className)}
            {...props}
        >
            {children}
        </h1>
    )) as React.ComponentType<React.HTMLAttributes<HTMLHeadingElement>>,

    h2: (({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string; [key: string]: unknown }) => (
        <h2
            className={cn('mt-6 mb-3 font-bold text-2xl', className)}
            {...props}
        >
            {children}
        </h2>
    )) as React.ComponentType<React.HTMLAttributes<HTMLHeadingElement>>,

    h3: (({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string; [key: string]: unknown }) => (
        <h3
            className={cn('mt-5 mb-2 font-bold text-xl', className)}
            {...props}
        >
            {children}
        </h3>
    )) as React.ComponentType<React.HTMLAttributes<HTMLHeadingElement>>,

    p: ({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) => (
        <p
            className={cn('my-4', className)}
            {...props}
        >
            {children}
        </p>
    ),

    ul: (({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string; [key: string]: unknown }) => (
        <ul
            className={cn('my-4 list-disc pl-6', className)}
            {...props}
        >
            {children}
        </ul>
    )) as React.ComponentType<React.HTMLAttributes<HTMLUListElement>>,

    ol: ({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLOListElement>) => (
        <ol
            className={cn('my-4 list-decimal pl-6', className)}
            {...props}
        >
            {children}
        </ol>
    ),

    li: ({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLLIElement>) => (
        <li
            className={cn('mb-1', className)}
            {...props}
        >
            {children}
        </li>
    ),

    code: ({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) => (
        <code
            className={cn('rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800', className)}
            {...props}
        >
            {children}
        </code>
    ),

    pre: ({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            className={cn('my-4 overflow-auto rounded-md bg-gray-100 p-4 dark:bg-gray-800', className)}
            {...props}
        >
            {children}
        </pre>
    ),

    table: (({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
        <div className='my-6 overflow-x-auto'>
            <table
                className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}
                {...props}
            >
                {children}
            </table>
        </div>
    )) as React.ComponentType<React.TableHTMLAttributes<HTMLTableElement>>,

    th: (({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
        <th
            className={cn('bg-gray-50 px-4 py-3 text-left font-semibold text-sm dark:bg-gray-800', className)}
            {...props}
        >
            {children}
        </th>
    )) as React.ComponentType<React.ThHTMLAttributes<HTMLTableHeaderCellElement>>,

    td: (({
        children,
        className,
        ...props
    }: { children?: React.ReactNode; className?: string; [key: string]: unknown }) => (
        <td
            className={cn('border-gray-200 border-t px-4 py-3 text-sm dark:border-gray-700', className)}
            {...props}
        >
            {children}
        </td>
    )) as React.ComponentType<React.TdHTMLAttributes<HTMLTableDataCellElement>>
};
