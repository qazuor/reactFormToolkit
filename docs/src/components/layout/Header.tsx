import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { ChevronLeft, Github, Menu, Moon, Search, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { LanguageSelector } from '../LanguageSelector';
import { Button } from '../ui/button';
import { DialogHeader } from '../ui/dialog';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import type { Doc } from './DocsSidebar';
import { Sidebar } from './Sidebar';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sidebarWidth: number;
    sidebarDocs: Doc[];
    searchResults: string[];
}

export function Header({ searchQuery, setSearchQuery, sidebarWidth, sidebarDocs, searchResults }: HeaderProps) {
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

    console.log('searchResults', searchResults);

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
                    <Dialog>
                        <DialogTrigger>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='sm:hidden'
                            >
                                <Search className='h-5 w-5' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='-mt-5 absolute top-[50%] right-5 left-5 z-50 max-w-md rounded-lg bg-slate-300 p-4 shadow-lg dark:bg-slate-800'>
                            <DialogHeader>
                                <DialogTitle>{t('search.title')}</DialogTitle>
                                <DialogDescription className='text-muted-foreground text-sm'>
                                    {t('search.description')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className='relative mt-5'>
                                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                                <Input
                                    type='text'
                                    placeholder={t('search.placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='w-full pl-9'
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <div className='relative mt-5'>
                                    {t('search.results')}
                                    <ul>
                                        {searchResults.map((result) => (
                                            <li key={result}>{result}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                    <div className='relative hidden sm:block'>
                        <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-[150px] pl-9 md:w-[200px]'
                        />
                        <Dialog open={searchResults.length > 0}>
                            <DialogContent className='absolute top-10 left-0 z-50 w-[200px] rounded-lg bg-slate-300 p-4 pt-0 shadow-lg dark:bg-slate-800'>
                                <DialogHeader>
                                    <DialogTitle>{t('search.results')}</DialogTitle>
                                </DialogHeader>
                                <div className='relative mt-5'>
                                    <ul>
                                        {searchResults.map((result) => (
                                            <li key={result}>{result}</li>
                                        ))}
                                    </ul>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div>
                        <div className='flex items-center gap-2 border md:hidden'>
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
