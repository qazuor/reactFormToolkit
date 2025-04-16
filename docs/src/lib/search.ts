import { marked } from 'marked';

export interface SearchResult {
    title: string;
    path: string;
    content: string;
    excerpt: string;
    score: number;
    type: 'doc' | 'example';
    headingLevel?: number; // 1 for h1, 2 for h2, etc.
}

interface DocIndex {
    title: string;
    path: string;
}

interface ExampleIndex {
    title: string;
    description: string;
    path: string;
}

interface SearchOptions {
    limit?: number;
    minScore?: number;
}

/**
 * Parses markdown content and extracts searchable sections with metadata
 * @param content Markdown content to parse
 * @param path Path to the document
 * @returns Array of search results with extracted content
 */
export function parseMarkdown(content: string, path: string): SearchResult[] {
    const results: SearchResult[] = [];
    const tokens = marked.lexer(content);

    let currentTitle = '';
    let currentHeadingLevel = 0;
    let currentContent = '';

    // First pass to extract the main title
    const mainTitleToken = tokens.find((token) => token.type === 'heading' && token.depth === 1);
    const mainTitle = mainTitleToken && 'text' in mainTitleToken ? mainTitleToken.text : path;

    // Add the main document as a result
    results.push({
        title: mainTitle,
        path,
        content: content,
        excerpt: `${content.slice(0, 150).replace(/\n/g, ' ').trim()}...`,
        score: 0, // Will be calculated during search
        type: 'doc',
        headingLevel: 0
    });

    // Process tokens to extract sections
    for (const token of tokens) {
        if (token.type === 'heading') {
            // Save previous section if it exists
            if (currentTitle && currentContent) {
                results.push({
                    title: currentTitle,
                    path: `${path}#${currentTitle.toLowerCase().replace(/\s+/g, '-')}`,
                    content: currentContent,
                    excerpt: `${currentContent.slice(0, 150).replace(/\n/g, ' ').trim()}...`,
                    score: 0,
                    type: 'doc',
                    headingLevel: currentHeadingLevel
                });
            }

            // Start new section
            currentTitle = 'text' in token ? token.text : '';
            currentHeadingLevel = token.depth;
            currentContent = '';
        } else if (token.type === 'paragraph' || token.type === 'list') {
            // Add content to current section
            currentContent +=
                'text' in token
                    ? token.text
                    : 'items' in token
                      ? token.items.map((item) => ('text' in item ? item.text : '')).join(' ')
                      : '';
            currentContent += ' ';
        } else if (token.type === 'code') {
            // Add code blocks with lower weight
            currentContent += `${token.text} `;
        }
    }

    // Add the last section
    if (currentTitle && currentContent) {
        results.push({
            title: currentTitle,
            path: `${path}#${currentTitle.toLowerCase().replace(/\s+/g, '-')}`,
            content: currentContent,
            excerpt: `${currentContent.slice(0, 150).replace(/\n/g, ' ').trim()}...`,
            score: 0,
            type: 'doc',
            headingLevel: currentHeadingLevel
        });
    }

    return results;
}

/**
 * Loads and indexes all documentation files
 * @returns Promise resolving to array of search results
 */
export async function buildSearchIndex(): Promise<SearchResult[]> {
    try {
        // Fetch the docs index
        const docsIndexResponse = await fetch('/docs/docs-index.json');
        const docsIndex: DocIndex[] = await docsIndexResponse.json();

        // Fetch examples data
        const examplesData: ExampleIndex[] = [
            {
                title: 'Basic Form',
                description: 'A simple login form with email and password fields',
                path: '/examples/basic'
            },
            {
                title: 'Complex Form',
                description: 'A contact form with multiple fields and validation',
                path: '/examples/complex'
            },
            {
                title: 'Validation Form',
                description: 'A registration form with advanced validation rules',
                path: '/examples/validation'
            },
            {
                title: 'Async Validation',
                description: 'A form demonstrating asynchronous validation with loading states',
                path: '/examples/async'
            },
            {
                title: 'Error Handling',
                description: 'Different ways to display and manage form validation errors',
                path: '/examples/errors'
            },
            {
                title: 'Global Errors',
                description: 'Examples of handling form-level errors with global error messages',
                path: '/examples/global-errors'
            },
            {
                title: 'Internationalization',
                description: 'A form with custom translations and language switching',
                path: '/examples/i18n'
            },
            {
                title: 'Styled Form',
                description: 'A form with custom styling using the style system',
                path: '/examples/styled'
            },
            {
                title: 'Field Array',
                description: 'A form demonstrating dynamic form arrays with validation',
                path: '/examples/field-array'
            },
            {
                title: 'Conditional Fields',
                description: 'A form demonstrating conditional field rendering',
                path: '/examples/conditional-field'
            },
            {
                title: 'Dependent Fields',
                description: 'A form demonstrating dependent field loading and validation',
                path: '/examples/dependent-field'
            },
            {
                title: 'Native Inputs',
                description: 'A form showcasing all native HTML form inputs with validation',
                path: '/examples/native-inputs'
            },
            {
                title: 'UI Libraries',
                description: 'A form showcasing integration with popular UI libraries',
                path: '/examples/ui-library'
            }
        ];

        // Process all docs
        const searchResults: SearchResult[] = [];

        // Process markdown files
        for (const doc of docsIndex) {
            try {
                const response = await fetch(`/docs/${doc.path}?raw`);
                if (!response.ok) {
                    continue;
                }

                const content = await response.text();
                const results = parseMarkdown(content, `/docs/${doc.path.replace(/\.md$/, '')}`);
                searchResults.push(...results);
            } catch (error) {
                console.error(`Error processing ${doc.path}:`, error);
            }
        }

        // Add examples to search index
        for (const example of examplesData) {
            searchResults.push({
                title: example.title,
                path: example.path,
                content: example.description,
                excerpt: example.description,
                score: 0,
                type: 'example'
            });
        }

        return searchResults;
    } catch (error) {
        console.error('Error building search index:', error);
        return [];
    }
}

/**
 * Searches the index for the given query
 * @param query Search query
 * @param searchIndex Search index to search in
 * @param options Search options
 * @returns Filtered and sorted search results
 */
export function search(query: string, searchIndex: SearchResult[], options: SearchOptions = {}): SearchResult[] {
    if (!query.trim()) {
        return [];
    }

    const { limit = 10, minScore = 0.2 } = options;
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    if (terms.length === 0) {
        return [];
    }

    // Score each result
    const scoredResults = searchIndex.map((result) => {
        const titleLower = result.title.toLowerCase();
        const contentLower = result.content.toLowerCase();

        let score = 0;

        // Check for exact matches in title (highest priority)
        if (titleLower.includes(query.toLowerCase())) {
            score += 10;
        }

        // Check for partial matches in title
        for (const term of terms) {
            if (titleLower.includes(term)) {
                score += 5;
            }
        }

        // Check for exact matches in content
        if (contentLower.includes(query.toLowerCase())) {
            score += 3;
        }

        // Check for partial matches in content
        for (const term of terms) {
            if (contentLower.includes(term)) {
                score += 1;
            }

            // Count occurrences for additional scoring
            const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length;
            score += occurrences * 0.1;
        }

        // Boost score based on heading level (h1 > h2 > h3...)
        if (result.headingLevel) {
            score += (6 - Math.min(result.headingLevel, 6)) * 0.5;
        }

        // Boost examples slightly
        if (result.type === 'example') {
            score += 0.5;
        }

        return {
            ...result,
            score
        };
    });

    // Filter by minimum score and sort by score
    return scoredResults
        .filter((result) => result.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Generates a highlighted excerpt from content based on search terms
 * @param content The content to extract excerpt from
 * @param query The search query
 * @returns Highlighted excerpt with search terms
 */
export function generateHighlightedExcerpt(content: string, query: string): string {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const contentLower = content.toLowerCase();

    // Find the first occurrence of any search term
    let startPos = -1;
    for (const term of terms) {
        const pos = contentLower.indexOf(term);
        if (pos !== -1 && (startPos === -1 || pos < startPos)) {
            startPos = pos;
        }
    }

    // If no term found, use the beginning
    if (startPos === -1) {
        startPos = 0;
    }

    // Move back to include some context
    startPos = Math.max(0, startPos - 40);

    // Find a word boundary to start from
    while (startPos > 0 && content[startPos] !== ' ' && content[startPos] !== '\n') {
        startPos--;
    }

    // Extract excerpt (about 200 chars)
    const excerpt = content.slice(startPos, startPos + 200);

    // Add ellipsis if needed
    const prefix = startPos > 0 ? '...' : '';
    const suffix = startPos + 200 < content.length ? '...' : '';

    // Highlight terms
    let highlighted = prefix + excerpt + suffix;
    for (const term of terms) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    }

    return highlighted;
}
