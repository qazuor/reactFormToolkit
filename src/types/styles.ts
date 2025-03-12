/**
 * Styles for form fields.
 * These styles are applied to the different parts of a form field.
 */
export interface FieldStyles {
    /** CSS class for the field wrapper */
    wrapper?: string;
    /** CSS class for the field label */
    label?: string;
    /** CSS class for input elements */
    input?: string;
    /** CSS class for select elements */
    select?: string;
    /** CSS class for checkbox elements */
    checkbox?: string;
    /** CSS class for textarea elements */
    textarea?: string;
    /** CSS class for error messages */
    error?: string;
    /** CSS class for field descriptions */
    description?: string;
    /** CSS class for the required mark (*) */
    requiredMark?: string;
    /** CSS class for the loading state during async validation */
    validating?: string;
}

/**
 * Styles for the form and its fields.
 */
export interface FormStyles {
    /** CSS class for the form element */
    form?: string;
    /** Styles for form fields */
    field?: FieldStyles;
}
