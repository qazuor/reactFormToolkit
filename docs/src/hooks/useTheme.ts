import { useLayoutEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'app-theme';

// Create a global event for theme changes
const themeChangeEvent = new CustomEvent('themeChange');

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

        // Dispatch a custom event when theme changes
        window.dispatchEvent(themeChangeEvent);
    }, [theme]);

    return {
        theme,
        toggleTheme: () => {
            setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
        },
        setTheme
    };
}
