/// <reference types="vite/client" />

declare module '*.tsx?raw' {
    const content: string;
    export default content;
}

declare module '*.ts?raw' {
    const content: string;
    export default content;
}

declare module '*.md?raw' {
    const content: string;
    export default content;
}

interface ImportMeta {
    readonly env: {
        readonly VITE_API_URL?: string;
        readonly VITE_SUPABASE_URL?: string;
        readonly VITE_SUPABASE_ANON_KEY?: string;
        readonly MODE: string;
        readonly BASE_URL: string;
        readonly PROD: boolean;
        readonly DEV: boolean;
        readonly SSR: boolean;
    };
}
