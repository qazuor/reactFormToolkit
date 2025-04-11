import { useTranslation } from 'react-i18next';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className='z-10 mt-auto border-t bg-background bg-zinc-200 px-4 py-6 text-center text-muted-foreground text-sm dark:bg-slate-900'>
            <div className='mx-auto max-w-7xl'>
                <p>
                    {t('examples.footer.text')}
                    <a
                        href='https://github.com/qazuor'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-1 font-medium text-primary transition-colors hover:text-primary/90'
                    >
                        Qazuor
                    </a>
                </p>
            </div>
        </footer>
    );
}
