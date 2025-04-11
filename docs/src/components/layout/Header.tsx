import { cn } from '@/lib/utils';
import { Github, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { LanguageSelector } from '../LanguageSelector';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { SidebarContent } from './SidebarContent';

interface HeaderProps {
    docs: any[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function Header({ docs, searchQuery, setSearchQuery }: HeaderProps) {
    const { t } = useTranslation();
    const { theme, toggle } = useTheme();
    const isDocPath = location.pathname.indexOf('/docs') === 0;
    const isExamplePath = location.pathname.indexOf('/examples') === 0;

    return (
        <header className='sticky top-0 z-50 border-b bg-background px-4 py-3 shadow-sm'>
            <div className='mx-auto flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Sheet>
                        <SheetTrigger asChild={true}>
                            <Button
                                size='icon'
                                variant='ghost'
                                className='md:hidden'
                            >
                                <Menu className='h-5 w-5' />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left'>
                            <div className='mt-8'>
                                <SidebarContent docs={docs} />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link
                        to='/'
                        className='flex items-center gap-4'
                    >
                        <img
                            className={theme === 'dark' ? 'hidden' : 'inline-block'}
                            width={150}
                            alt='Qazuor React Form Toolkit'
                            src='/logo-transparent.png'
                        />
                        <img
                            className={theme === 'light' ? 'hidden' : 'inline-block'}
                            width={150}
                            alt='Qazuor React Form Toolkit'
                            src='/logo-transparent-dark.png'
                        />
                    </Link>
                    <Link
                        to='/docs'
                        className={cn(
                            'flex items-center gap-4 rounded-md px-3 py-2 text-sm transition-colors',
                            isDocPath
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                    >
                        {t('docs.title')}
                    </Link>
                    <Link
                        to='/examples'
                        className={cn(
                            'flex items-center gap-4 rounded-md px-3 py-2 text-sm transition-colors',
                            isExamplePath
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                    >
                        {t('examples.title')}
                    </Link>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='relative hidden md:block'>
                        <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-[200px] pl-9'
                        />
                    </div>
                    <LanguageSelector />
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={toggle}
                        className='text-foreground'
                    >
                        {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
                    </Button>
                    <a
                        href='https://github.com/qazuor/reactFormToolkit'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-foreground'
                    >
                        <Github className='h-5 w-5' />
                        <span className='hidden sm:inline'>GitHub</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
