import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import i18n from '@/i18n';
import { type SearchResult, buildSearchIndex, generateHighlightedExcerpt, search } from '@/lib/search';
import { cn } from '@/lib/utils';
import { File, FileText, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialQuery?: string;
}

export function SearchDialog({ open, onOpenChange, initialQuery = '' }: SearchDialogProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const lang = i18n.language;

    // Load search index on mount
    useEffect(() => {
        const loadSearchIndex = async () => {
            setIsLoading(true);
            try {
                const index = await buildSearchIndex(lang);
                setSearchIndex(index);
            } catch (error) {
                console.error('Failed to build search index:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSearchIndex();
    }, [lang]);

    // Focus input when dialog opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            setSearchQuery('');
            setSearchResults([]);
        }
    }, [open]);

    // Perform search when query changes
    useEffect(() => {
        if (!searchQuery.trim() || searchIndex.length === 0) {
            setSearchResults([]);
            return;
        }

        const results = search(searchQuery, searchIndex, { limit: 20, minScore: 0.2 });
        setSearchResults(results);
    }, [searchQuery, searchIndex]);

    // Navigate to result and close dialog
    const handleSelectResult = useCallback(
        (result: SearchResult) => {
            navigate(result.path);
            onOpenChange(false);
        },
        [navigate, onOpenChange]
    );

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open search dialog with Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                onOpenChange(true);
            }

            // Close with Escape
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onOpenChange, open]);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className='max-w-3xl gap-0 overflow-hidden p-0'
                onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing when clicking inside results
            >
                <DialogTitle className='sr-only'>{t('search.title')}</DialogTitle>
                <DialogDescription className='sr-only'>{t('search.description')}</DialogDescription>
                <Command className='rounded-lg border shadow-md'>
                    <div className='flex items-center border-b px-3'>
                        <CommandInput
                            ref={inputRef}
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className='h-12 flex-1'
                        />
                        <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 text-muted-foreground text-xs'
                        >
                            {t('search.shortcut', { defaultValue: 'ESC to close' })}
                        </Button>
                    </div>
                    <CommandList className='max-h-[500px] overflow-y-auto'>
                        <CommandEmpty>
                            {isLoading ? (
                                <div className='flex flex-col items-center justify-center py-6'>
                                    <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                                    <p className='mt-2 text-muted-foreground text-sm'>{t('search.loading')}</p>
                                </div>
                            ) : (
                                <p className='p-4 text-center text-muted-foreground text-sm'>{t('search.noResults')}</p>
                            )}
                        </CommandEmpty>
                        {searchResults.length > 0 && (
                            <CommandGroup heading={t('search.results')}>
                                {searchResults.map((result, index) => (
                                    <CommandItem
                                        key={`${result.path}-${index}`}
                                        value={`${result.title} ${result.path}`}
                                        onSelect={() => handleSelectResult(result)}
                                        className='px-4 py-3'
                                    >
                                        <div className='flex w-full flex-col'>
                                            <div className='flex items-center'>
                                                {result.type === 'example' ? (
                                                    <FileText className='mr-2 h-4 w-4 text-blue-500' />
                                                ) : (
                                                    <File className='mr-2 h-4 w-4 text-green-500' />
                                                )}
                                                <span className='font-medium'>{result.title}</span>
                                                <span className='ml-auto text-muted-foreground text-xs'>
                                                    {result.type === 'example' ? t('search.example') : t('search.doc')}
                                                </span>
                                            </div>
                                            {result.excerpt && (
                                                <div
                                                    className={cn(
                                                        'mt-1 line-clamp-2 text-muted-foreground text-xs',
                                                        result.type === 'example' && 'italic'
                                                    )}
                                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for highlighted text
                                                    dangerouslySetInnerHTML={{
                                                        __html: generateHighlightedExcerpt(result.excerpt, searchQuery)
                                                    }}
                                                />
                                            )}
                                            <div className='mt-1 text-muted-foreground text-xs opacity-60'>
                                                {result.path}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
