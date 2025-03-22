import type { ClassValue } from 'clsx';

/**
 * Field style options
 */
export interface FieldStyleOptions {
    wrapper?: ClassValue;
    label?: ClassValue;
    description?: ClassValue;
    error?: ClassValue;
    requiredMark?: ClassValue;
    input?: ClassValue;
    select?: ClassValue;
    textarea?: ClassValue;
    checkbox?: ClassValue;
    isValid?: ClassValue;
    isInvalid?: ClassValue;
    isValidating?: ClassValue;
    isLoading?: ClassValue;
}

/**
 * Form style options
 */
export interface FormStyleOptions {
    wrapper?: ClassValue;
}

/**
 * Button style options
 */
export interface ButtonStyleOptions {
    submit?: ClassValue;
    cancel?: ClassValue;
    reset?: ClassValue;
}

/**
 * Tooltip style options
 */
export interface TooltipStyleOptions {
    icon?: ClassValue;
    content?: ClassValue;
}

/**
 * Complete form style options
 */
export interface FormProviderStyleOptions {
    field?: FieldStyleOptions;
    form?: FormStyleOptions;
    buttons?: ButtonStyleOptions;
    tooltip?: TooltipStyleOptions;
}

/**
 * Style options that can be passed to individual components
 */
export type ComponentStyleOptions = Partial<FieldStyleOptions>;
