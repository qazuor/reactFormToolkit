import toc from '@jsdevtools/rehype-toc';
import { FC, useEffect, useState } from 'react';
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
    docFile: string;
    useTOC?: boolean;
}

export const DocsViewer: FC<DocsViewerProps> = ({ docFile, useTOC = true }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [content, setContent] = useState<string>(t('docViewer.loading'));
    const lang = i18n.language;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const path = docFile ? docFile : location.pathname.replace('docs/', '');
        const mdPath = `/docs/${lang}/${path}.md?raw`;

        fetch(mdPath)
            .then((res) => (res.ok ? res.text() : Promise.reject(t('docViewer.fileNotFound'))))
            .then(setContent)
            .catch(() => {
                console.error('Error fetching markdown file:', mdPath);
                setContent(`Error: ${t('docViewer.fileNotFound')}`);
            });
    }, [location, lang]);

    return (
        <div className='markdown-body relative bg-white px-4 py-6 text-black dark:bg-zinc-900 dark:text-zinc-100'>
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
                                        className: 'toc-title-container'
                                    },
                                    children: [
                                        {
                                            type: 'element',
                                            tagName: 'h2',
                                            properties: {
                                                className: 'toc-title'
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
