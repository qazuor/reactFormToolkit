import { Book, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { MainNakLink } from '../MainNavLink';

interface SidebarContentProps {
    docs: any[];
}

export function SidebarContent({ docs }: SidebarContentProps) {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <div className='space-y-6 pb-16'>
            <div>
                <h2 className='font-semibold text-foreground text-sm'>{t('docs.title')}</h2>
                <ul className='mt-2 space-y-1'>
                    {docs.map((doc) => (
                        <MainNakLink
                            key={doc.path}
                            path={`/docs/${doc.path.replace(/\.md$/, '')}`}
                            text={t(`docs.tabs.${doc.title}`, { defaultValue: doc.title })}
                            icon={<Book className='h-4 w-4' />}
                        />
                    ))}
                </ul>
            </div>
            <div>
                <h2 className='font-semibold text-foreground text-sm'>{t('examples.title')}</h2>
                <ul className='mt-2 space-y-1'>
                    <MainNakLink
                        path='/examples/basic'
                        text={t('examples.tabs.basic')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/complex'
                        text={t('examples.tabs.complex')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/validation'
                        text={t('examples.tabs.validation')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/async'
                        text={t('examples.tabs.async')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/errors'
                        text={t('examples.tabs.errors')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/i18n'
                        text={t('examples.tabs.i18n')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/styled'
                        text={t('examples.tabs.styled')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/field-array'
                        text={t('examples.tabs.fieldArray')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/global-errors'
                        text={t('examples.tabs.globalErrors')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/conditional-field'
                        text={t('examples.tabs.conditionalFields')}
                        icon={<Code className='h-4 w-4' />}
                    />
                    <MainNakLink
                        path='/examples/dependent-fields'
                        text={t('examples.tabs.dependentFields')}
                        icon={<Code className='h-4 w-4' />}
                    />
                </ul>
            </div>
        </div>
    );
}
