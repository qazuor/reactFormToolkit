import toc from '@jsdevtools/rehype-toc';
import { type FC, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { remarkAlert } from 'remark-github-blockquote-alert';
import remarkHeadingGap from 'remark-heading-gap';
import 'remark-github-blockquote-alert/alert.css';
import i18n from '@/i18n';
import rehypeScrollToTop from '@benjc/rehype-scroll-to-top';
import { useTranslation } from 'react-i18next';
import rehypePrism from 'rehype-prism-plus';

// Define the toc type
interface TocElement {
    type: string;
    tagName?: string;
    properties?: Record<string, string | number | boolean | undefined>;
    children?: TocElement[];
}

interface DocsViewerProps {
    docFile?: string;
    useTOC?: boolean;
}

export const DocsViewer: FC<DocsViewerProps> = ({ docFile, useTOC = true }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const contentRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>(t('docViewer.loading'));
    const currentLang = i18n.language;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const path = docFile ? docFile : location.pathname.replace('docs/', '');
        // Determine language and construct path
        const lang = currentLang.split('-')[0];
        const supportedLangs = ['en', 'es'];
        const langToUse = supportedLangs.includes(lang) ? lang : 'en';

        // Check if path already includes language prefix
        const hasLangPrefix = path.startsWith('en/') || path.startsWith('es/');
        const langPath = hasLangPrefix ? path : `${langToUse}/${path}`;

        const mdPath = `/docs/${langPath}.md?raw`;

        fetch(mdPath)
            .then((res) => {
                if (res.ok) {
                    return res.text();
                }
                // If file not found and we're using a non-English language, try English as fallback
                if (!hasLangPrefix && langToUse !== 'en') {
                    const fallbackPath = `/docs/en/${path}.md?raw`;
                    return fetch(fallbackPath).then((fallbackRes) =>
                        fallbackRes.ok ? fallbackRes.text() : Promise.reject(t('docViewer.fileNotFound'))
                    );
                }
                return Promise.reject(t('docViewer.fileNotFound'));
            })
            .then(setContent)
            .catch(() => {
                console.error('Error fetching markdown file:', mdPath);
                setContent(`Error: ${t('docViewer.fileNotFound')}`);
            });
    }, [location, i18n.language, t]);

    // Add event listener for clicks on TOC links
    useEffect(() => {
        const handleTocLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if the clicked element is a TOC link or its parent
            const tocLink = target.closest('.toc-link');
            if (tocLink?.getAttribute('href')) {
                e.preventDefault();

                // Get the href attribute which contains the ID
                const href = tocLink.getAttribute('href');
                if (href?.startsWith('#')) {
                    const id = href.substring(1);
                    const element = document.getElementById(id);

                    if (element) {
                        // Scroll to the element
                        element.scrollIntoView({ behavior: 'smooth' });

                        // Set focus to the element for accessibility
                        element.setAttribute('tabindex', '-1');
                        element.focus({ preventScroll: true });

                        // Update URL hash without scrolling
                        window.history.pushState(null, '', href);
                    }
                }
            }
        };

        // Add event listener to the content container
        const contentContainer = contentRef.current;
        if (contentContainer) {
            contentContainer.addEventListener('click', handleTocLinkClick);
        }

        return () => {
            if (contentContainer) {
                contentContainer.removeEventListener('click', handleTocLinkClick);
            }
        };
    }, [content]);

    return (
        <div
            ref={contentRef}
            className='markdown-body relative bg-white px-4 py-6 text-black dark:bg-zinc-900 dark:text-zinc-100'
        >
            <Markdown
                remarkPlugins={[remarkGfm, remarkAlert, remarkBreaks, remarkHeadingGap]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypePrism,
                    rehypeSlug,
                    rehypeAutolinkHeadings,
                    [
                        rehypeScrollToTop,
                        {
                            topLink: {
                                disabled: true
                            },
                            bottomLink: {
                                ariaLabel: t('docViewer.backToTop'),
                                classes: 'backToTop',
                                disabled: false,
                                id: 'backToTop',
                                text: `${t('docViewer.backToTop')} ↑`
                            }
                        }
                    ],
                    [
                        toc,
                        {
                            customizeTOC: (toc: TocElement) => {
                                if (useTOC === false) {
                                    return null;
                                }
                                const title = {
                                    type: 'element',
                                    tagName: 'div',
                                    properties: {
                                        className: ['toc-title-container']
                                    },
                                    children: [
                                        {
                                            type: 'element',
                                            tagName: 'h2',
                                            properties: {
                                                className: ['toc-title']
                                            },
                                            children: [
                                                {
                                                    type: 'text',
                                                    value: 'Table of Contents'
                                                }
                                            ]
                                        }
                                    ]
                                };
                                if (toc?.children) {
                                    toc.children.unshift(title);
                                }

                                // Add onClick handlers to all links in the TOC
                                if (toc?.children) {
                                    const processNode = (node: TocElement) => {
                                        if (node.tagName === 'a' && node.properties) {
                                            // Add a class to identify TOC links
                                            node.properties.className = (node.properties.className || []).concat([
                                                'toc-link'
                                            ]);
                                        }

                                        if (node.children) {
                                            node.children.forEach(processNode);
                                        }
                                    };

                                    toc.children.forEach(processNode);
                                }

                                return toc;
                            }
                        }
                    ]
                ]}
            >
                {content}
            </Markdown>
        </div>
    );
};
