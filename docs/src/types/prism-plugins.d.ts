declare module 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace' {
    class NormalizeWhitespace {
        constructor(options?: {
            'remove-trailing'?: boolean;
            'remove-indent'?: boolean;
            'left-trim'?: boolean;
            'right-trim'?: boolean;
            'break-lines'?: number;
            indent?: number;
            'remove-initial-line-feed'?: boolean;
            'tabs-to-spaces'?: number;
            'spaces-to-tabs'?: number;
        });
        normalize(text: string, options?: object): string;
    }
    export = NormalizeWhitespace;
}
