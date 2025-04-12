import { cn } from '@/lib/utils';
import { Book, ChevronLeft, Code, Github, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { LanguageSelector } from '../LanguageSelector';
import { MainNakLink } from '../MainNavLink';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import type { Doc } from './DocsSidebar';
import { Sidebar } from './Sidebar';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sidebarWidth: number;
    sidebarDocs: Doc[];
}

export function Header({ searchQuery, setSearchQuery, sidebarWidth, sidebarDocs }: HeaderProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const isHomePath = location.pathname === '/';
    const isDocPath = location.pathname.startsWith('/docs');
    const isExamplePath = location.pathname.startsWith('/examples');

    return (
        <header className='sticky top-0 z-50 border-b bg-background px-2 py-2 shadow-sm md:px-4 md:py-3'>
            <div className='mx-auto flex w-full items-center justify-between gap-2'>
                <div className='flex items-center gap-2 md:gap-4'>
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
                        <SheetContent
                            side='left'
                            className='flex w-[85vw] max-w-[350px] flex-col'
                        >
                            <SheetHeader className='border-b pb-2'>
                                <SheetTitle className='flex items-start justify-between'>
                                    <span className='flex items-start justify-between'>
                                        {!isHomePath && (
                                            <>
                                                <h2 className='flex pt-1 pb-1 text-left'>
                                                    {isDocPath && t('docs.title')}
                                                    {isExamplePath && t('examples.title')}
                                                </h2>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    asChild={true}
                                                    className='ml-6 flex'
                                                >
                                                    <Link to='/'>
                                                        <ChevronLeft className='h-4 w-4' />
                                                        {t('navigation.backToMainMenu')}
                                                    </Link>
                                                </Button>
                                            </>
                                        )}
                                        {isHomePath && t('navigation.menu')}
                                    </span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className='h-[calc(100vh-7rem)] overflow-scroll pb-10'>
                                <Sidebar
                                    docs={sidebarDocs}
                                    width={sidebarWidth}
                                />
                            </div>
                            <SheetFooter className='z-1 mt-auto border-t bg-white/40 pt-4 dark:bg-slate-900/40'>
                                <div className='flex w-full items-center justify-between'>
                                    <a
                                        href='https://github.com/qazuor/reactFormToolkit'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 text-foreground'
                                    >
                                        <Github className='h-5 w-5' /> Github
                                        <LanguageSelector />
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={toggleTheme}
                                            className='text-foreground'
                                        >
                                            {theme === 'light' ? (
                                                <Moon className='h-5 w-5' />
                                            ) : (
                                                <Sun className='h-5 w-5' />
                                            )}
                                        </Button>
                                    </a>
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
                <Link
                    to='/'
                    className='flex flex-shrink-1 items-center gap-4 mr-20'
                >
                    <img
                        className={cn('w-48', theme === 'dark' ? 'hidden' : 'inline-block')}
                        alt='Qazuor React Form Toolkit'
                        src='/logo-transparent.png'
                    />
                    <img
                        className={cn('w-48', theme === 'light' ? 'hidden' : 'inline-block')}
                        alt='Qazuor React Form Toolkit'
                        src='/logo-transparent-dark.png'
                    />
                </Link>
                <MainNakLink
                    path='/docs'
                    text={t('docs.title')}
                    icon={<Book className='h-4 w-4' />}
                    isActiveUseFullPath={false}
                    isAList={false}
                />
                <MainNakLink
                    path='/examples'
                    text={t('examples.title')}
                    icon={<Code className='h-4 w-4' />}
                    isActiveUseFullPath={false}
                    isAList={false}
                />
                <div className='w-full'></div>
                <div className='flex items-center gap-2 md:gap-4'>
                    <Popover>
                        <PopoverTrigger asChild={true}>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='sm:hidden'
                            >
                                <Search className='h-5 w-5' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className='w-[250px] p-2'
                            align='end'
                        >
                            <div className='relative'>
                                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                                <Input
                                    type='text'
                                    placeholder={t('search.placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='w-full pl-9'
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className='relative hidden sm:block'>
                        <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-[150px] pl-9 md:w-[200px]'
                        />
                    </div>
                    <div className='hidden sm:block'>
                        <LanguageSelector />
                    </div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={toggleTheme}
                        className='hidden text-foreground sm:flex'
                    >
                        {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
                    </Button>
                    <a
                        href='https://github.com/qazuor/reactFormToolkit'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hidden items-center gap-2 text-foreground sm:flex'
                    >
                        <Github className='h-5 w-5' />
                        <span className='hidden sm:inline'>GitHub</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
