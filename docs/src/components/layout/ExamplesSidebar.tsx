import { Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MainNavLink } from '../MainNavLink';

export interface ExamplesSidebarProps {
    onNavigation?: (path: string) => void;
}

export function ExamplesSidebar({ onNavigation }: ExamplesSidebarProps) {
    const { t } = useTranslation();

    return (
        <div>
            <h2 className='mb-2 hidden font-semibold text-foreground text-sm md:block'>{t('examples.title')}</h2>
            <ul className='mt-2 space-y-1'>
                <MainNavLink
                    path='/examples/basic'
                    text={t('examples.tabs.basic')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/complex'
                    text={t('examples.tabs.complex')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/validation'
                    text={t('examples.tabs.validation')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/async'
                    text={t('examples.tabs.async')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/errors'
                    text={t('examples.tabs.errors')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/i18n'
                    text={t('examples.tabs.i18n')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/styled'
                    text={t('examples.tabs.styled')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/field-array'
                    text={t('examples.tabs.fieldArray')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/global-errors'
                    text={t('examples.tabs.globalErrors')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/conditional-field'
                    text={t('examples.tabs.conditionalFields')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/dependent-field'
                    text={t('examples.tabs.dependentFields')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/native-inputs'
                    text={t('examples.tabs.nativeInputs')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
                <MainNavLink
                    path='/examples/ui-library'
                    text={t('examples.tabs.uiLibrary')}
                    icon={<Code className='h-4 w-4' />}
                    onNavigation={onNavigation}
                />
            </ul>
        </div>
    );
}
