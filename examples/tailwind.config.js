/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                }
            }
        }
    },
    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/typography')({
            className: 'prose',
            theme: {
                light: {
                    css: {
                        '--tw-prose-body': '#24292f',
                        '--tw-prose-headings': '#24292f',
                        '--tw-prose-lead': '#57606a',
                        '--tw-prose-links': '#0969da',
                        '--tw-prose-bold': '#24292f',
                        '--tw-prose-counters': '#57606a',
                        '--tw-prose-bullets': '#57606a',
                        '--tw-prose-hr': '#d0d7de',
                        '--tw-prose-quotes': '#24292f',
                        '--tw-prose-quote-borders': '#d0d7de',
                        '--tw-prose-captions': '#57606a',
                        '--tw-prose-code': '#24292f',
                        '--tw-prose-pre-code': '#24292f',
                        '--tw-prose-pre-bg': '#f6f8fa',
                        '--tw-prose-th-borders': '#d0d7de',
                        '--tw-prose-td-borders': '#d0d7de'
                    }
                },
                dark: {
                    css: {
                        '--tw-prose-body': '#c9d1d9',
                        '--tw-prose-headings': '#c9d1d9',
                        '--tw-prose-lead': '#8b949e',
                        '--tw-prose-links': '#58a6ff',
                        '--tw-prose-bold': '#c9d1d9',
                        '--tw-prose-counters': '#8b949e',
                        '--tw-prose-bullets': '#8b949e',
                        '--tw-prose-hr': '#30363d',
                        '--tw-prose-quotes': '#c9d1d9',
                        '--tw-prose-quote-borders': '#30363d',
                        '--tw-prose-captions': '#8b949e',
                        '--tw-prose-code': '#c9d1d9',
                        '--tw-prose-pre-code': '#c9d1d9',
                        '--tw-prose-pre-bg': '#161b22',
                        '--tw-prose-th-borders': '#30363d',
                        '--tw-prose-td-borders': '#30363d'
                    }
                }
            }
        })
    ]
};
