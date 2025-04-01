import type React from 'react';
import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
    title: string;
    description: string;
    consoleLogTitle: string;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

class InternalErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(`${this.props.consoleLogTitle}:`, error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className='rounded border bg-red-100 p-4 text-red-800'>
                        <h2>{this.props.title}</h2>
                        <p>{this.props.description}</p>
                        <p>{this.state.error?.message}</p>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}

export function withErrorBoundary(Component: React.FC, fallback?: ReactNode) {
    const { t } = useTranslation();
    return function WrappedWithErrorBoundary(props: React.ComponentProps<typeof Component>) {
        return (
            <InternalErrorBoundary
                fallback={fallback}
                title={t('errors.errorBoundary.title')}
                description={t('errors.errorBoundary.description')}
                consoleLogTitle={t('errors.errorBoundary.consoleLogTitle')}
            >
                <Component {...props} />
            </InternalErrorBoundary>
        );
    };
}
