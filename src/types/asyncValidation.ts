/**
 * Async validator function type
 */
export type AsyncValidationFn = (value: unknown) => Promise<boolean | string | undefined>;

/**
 * Props for the FormField component
 */
export type AsyncValidationProps = {
    /**
     * Optional async validation function
     */
    asyncValidationFn: AsyncValidationFn;

    /**
     * Debounce time in milliseconds for async validation
     * @default 500
     */
    asyncValidationDebounce?: number;

    /**
     * Show validation status icons
     * @default true
     */
    showValidationIcons?: boolean;

    /**
     * Show loading spinner during async validation
     * @default true
     */
    showLoadingSpinner?: boolean;

    /**
     * Text to display when async validation is in progress
     * @default 'Validating...'
     */
    textWhenValidating?: string;

    /**
     * Text to display when async validation is not executed
     * @default null
     */
    textWhenBeforeStartValidating?: string;
};

export interface FieldAsyncValidationProps {
    isValidating: boolean;

    hasError: boolean;
    error: string | undefined;
    asyncValidatingStarted: boolean;

    /**
     * Show validation status icons
     * @default true
     */
    showValidationIcons: boolean;

    /**
     * Show loading spinner during async validation
     * @default true
     */
    showLoadingSpinner: boolean;

    /**
     * Text to display when async validation is in progress
     * @default 'Validating...'
     */
    textWhenValidating?: string;

    /**
     * Text to display when async validation is not executed
     * @default null
     */
    textWhenBeforeStartValidating?: string;
}
