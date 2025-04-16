import { cn } from '@/lib/utils';
import { ChevronLeft, Github, Menu, Moon, Search, Sun } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { LanguageSelector } from '../LanguageSelector';
import { SearchDialog } from '../SearchDialog';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import type { Doc } from './DocsSidebar';
import { Sidebar } from './Sidebar';

interface HeaderProps {
    searchQuery: string;
    sidebarWidth: number;
    sidebarDocs: Doc[];
}

export function Header({ searchQuery, sidebarWidth, sidebarDocs }: HeaderProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const isHomePath = location.pathname === '/';
    const isDocPath = location.pathname.startsWith('/docs');
    const isExamplePath = location.pathname.startsWith('/examples');
    const navigate = useNavigate();

    // Function to handle navigation from sidebar
    const handleSidebarNavigation = (path: string, closeSidebar = true) => {
        if (closeSidebar) {
            setOpen(false);
        }
        navigate(path);
    };

    const [open, setOpen] = useState(false);
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);

    const handleOpenSearchDialog = useCallback(() => {
        setSearchDialogOpen(true);
    }, []);

    return (
        <header className='sticky top-0 z-50 border-b bg-background px-2 py-2 shadow-sm md:px-4 md:py-3'>
            <div className='mx-auto flex w-full items-center justify-between gap-2'>
                <div className='flex items-center gap-2 md:gap-4'>
                    <Sheet
                        open={open}
                        onOpenChange={setOpen}
                    >
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
                                        {isHomePath ? (
                                            <span>{t('navigation.menu')}</span>
                                        ) : (
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
                                                    onClick={() => handleSidebarNavigation('/', false)}
                                                >
                                                    <span>
                                                        <ChevronLeft className='h-4 w-4' />
                                                        {t('navigation.backToMainMenu')}
                                                    </span>
                                                </Button>
                                            </>
                                        )}
                                    </span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className='max-h-[calc(100vh-10.5rem)] flex-1 flex-grow overflow-y-auto overflow-x-hidden'>
                                <Sidebar
                                    docs={sidebarDocs}
                                    width={sidebarWidth}
                                    onNavigation={handleSidebarNavigation}
                                />
                            </div>
                            <SheetFooter className='z-10 shrink-0 border-t'>
                                <div className='flex w-full items-center justify-between py-2'>
                                    <a
                                        href='https://github.com/qazuor/reactFormToolkit'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 text-foreground'
                                    >
                                        <Github className='h-5 w-5' /> <span>Github</span>
                                    </a>
                                    <div className='flex items-center gap-2'>
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
                                    </div>
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
                <Link
                    to='/'
                    className='mr-1 flex flex-shrink-1 items-center gap-4'
                >
                    <img
                        className={cn('w-24 max-w-none', theme === 'dark' ? 'hidden' : 'inline-block')}
                        alt='Qazuor React Form Toolkit'
                        src='/logo-transparent.png'
                    />
                    <img
                        className={cn('w-24 max-w-none', theme === 'light' ? 'hidden' : 'inline-block')}
                        alt='Qazuor React Form Toolkit'
                        src='/logo-transparent-dark.png'
                    />
                </Link>
                <div className='w-full' />
                <div className='flex items-center gap-2 md:gap-4'>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleOpenSearchDialog}
                        className='sm:hidden'
                    >
                        <Search className='h-5 w-5' />
                    </Button>

                    <div className='relative hidden sm:block'>
                        <Button
                            variant='outline'
                            onClick={handleOpenSearchDialog}
                            className='w-[200px] justify-start text-muted-foreground md:w-[260px]'
                        >
                            <Search className='mr-2 h-4 w-4' />
                            <span>{t('search.placeholder')}</span>
                            <kbd className='pointer-events-none absolute right-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex'>
                                <span className='text-xs'>⌘</span>K
                            </kbd>
                        </Button>
                    </div>

                    <SearchDialog
                        open={searchDialogOpen}
                        onOpenChange={setSearchDialogOpen}
                        initialQuery={searchQuery}
                    />

                    <div>
                        <div className='flex items-center gap-2 md:hidden'>
                            <LanguageSelector />
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={toggleTheme}
                                className='text-foreground'
                            >
                                {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
                            </Button>
                        </div>
                    </div>
                    <div className='hidden sm:block'>
                        <LanguageSelector />
                    </div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                            toggleTheme();
                        }}
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
