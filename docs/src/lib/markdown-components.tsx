import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

/**
 * Custom components for use with react-markdown
 * This provides React Router integration for internal links
 */
export const markdownComponents = {
    // Handle links - use React Router for internal links
    a: ({ href, children, className, ...props }) => {
        // Check if the link is internal (starts with / but not with // for external links)
        if (href && href.startsWith('/') && !href.startsWith('//')) {
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
    },

    // Customize other markdown elements as needed
    h1: ({ children, className, ...props }) => (
        <h1
            className={cn('mt-8 mb-4 text-3xl font-bold', className)}
            {...props}
        >
            {children}
        </h1>
    ),

    h2: ({ children, className, ...props }) => (
        <h2
            className={cn('mt-6 mb-3 text-2xl font-bold', className)}
            {...props}
        >
            {children}
        </h2>
    ),

    h3: ({ children, className, ...props }) => (
        <h3
            className={cn('mt-5 mb-2 text-xl font-bold', className)}
            {...props}
        >
            {children}
        </h3>
    ),

    p: ({ children, className, ...props }) => (
        <p
            className={cn('my-4', className)}
            {...props}
        >
            {children}
        </p>
    ),

    ul: ({ children, className, ...props }) => (
        <ul
            className={cn('list-disc pl-6 my-4', className)}
            {...props}
        >
            {children}
        </ul>
    ),

    ol: ({ children, className, ...props }) => (
        <ol
            className={cn('list-decimal pl-6 my-4', className)}
            {...props}
        >
            {children}
        </ol>
    ),

    li: ({ children, className, ...props }) => (
        <li
            className={cn('mb-1', className)}
            {...props}
        >
            {children}
        </li>
    ),

    code: ({ children, className, ...props }) => (
        <code
            className={cn('bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm', className)}
            {...props}
        >
            {children}
        </code>
    ),

    pre: ({ children, className, ...props }) => (
        <pre
            className={cn('bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto my-4', className)}
            {...props}
        >
            {children}
        </pre>
    ),

    table: ({ children, className, ...props }) => (
        <div className='overflow-x-auto my-6'>
            <table
                className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}
                {...props}
            >
                {children}
            </table>
        </div>
    ),

    th: ({ children, className, ...props }) => (
        <th
            className={cn('px-4 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800', className)}
            {...props}
        >
            {children}
        </th>
    ),

    td: ({ children, className, ...props }) => (
        <td
            className={cn('px-4 py-3 text-sm border-t border-gray-200 dark:border-gray-700', className)}
            {...props}
        >
            {children}
        </td>
    )
};
