// Define FormData type for use in examples
declare global {
    interface FormData {
        [key: string]: any;
    }
}

// Define AsyncValidationProps for use in examples
export interface AsyncValidationProps {
    asyncValidationFn: (value: unknown) => Promise<boolean | string | undefined>;
    asyncValidationDebounce?: number;
    showValidationIcons?: boolean;
    showLoadingSpinner?: boolean;
    textWhenValidating?: string;
    textWhenBeforeStartValidating?: string;
}
