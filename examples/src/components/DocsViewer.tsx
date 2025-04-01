import toc from '@jsdevtools/rehype-toc';
import { type FC, useEffect, useState } from 'react';
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
import 'github-markdown-css/github-markdown-light.css';
import rehypeScrollToTop from '@benjc/rehype-scroll-to-top';
import { useTranslation } from 'react-i18next';
import rehypePrism from 'rehype-prism-plus';

export const DocsViewer: FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [content, setContent] = useState<string>(t('loading'));

    useEffect(() => {
        const path = location.pathname.replace('docs/', '');
        const mdPath = `/docs${path}.md?raw`;

        fetch(mdPath)
            .then((res) => (res.ok ? res.text() : Promise.reject(t('fileNotFound'))))
            .then(setContent)
            .catch(() => setContent(`Error: ${t('fileNotFound')}`));
    }, [location]);

    return (
        <div className='markdown-body'>
            <Markdown
                remarkPlugins={[remarkGfm, remarkAlert, remarkBreaks, remarkHeadingGap]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypePrism,
                    rehypeSlug,
                    toc,
                    rehypeAutolinkHeadings,
                    [
                        rehypeScrollToTop,
                        {
                            topLink: {
                                disabled: true
                            },
                            bottomLink: {
                                ariaLabel: t('backToTop'),
                                classes: 'backToTop',
                                disabled: false,
                                id: 'backToTop',
                                text: `${t('backToTop')} ↑`
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
