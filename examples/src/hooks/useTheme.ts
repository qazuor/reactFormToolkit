import { useLayoutEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'app-theme';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved === 'light' || saved === 'dark') {
                return saved;
            }
        }

        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    // Sync <html class="dark"> and load Prism theme
    useLayoutEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    return {
        theme,
        toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
        setTheme
    };
}
