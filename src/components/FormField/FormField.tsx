import { FieldArrayContext, useFormContext } from '@/context';
import { useFieldState, useFieldValidation } from '@/hooks';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import { getUiLibraryCompatibleStyles } from '@/lib/ui-library';
import type { FormFieldProps } from '@/types';
import { type ReactElement, useContext, useEffect, useMemo, useRef } from 'react';
import { isValidElement } from 'react';
import { FormFieldRenderer } from './FormFieldRenderer';

/**
 * FormField component for rendering form inputs with validation
 * This component handles state management and validation logic
 *
 * @param {FormFieldProps} props - Component props
 * @returns {ReactElement} Form field component
 *
 * @example
 * ```tsx
 * <FormField name="email" label="Email Address" required>
 *   <input type="email" className="form-input" />
 * </FormField>
 * ```
 */
export function FormField({
    name,
    label,
    required,
    asyncValidation,
    children,
    description,
    descriptionOptions,
    tooltip,
    tooltipOptions,
    styleOptions,
    errorDisplayOptions
}: FormFieldProps): ReactElement {
    const {
        form,
        schema,
        styleOptions: providerStyles,
        errorDisplayOptions: providerErrorOptions,
        uiLibrary
    } = useFormContext();
    const childRef = useRef<HTMLInputElement>(null);
    const arrayContext = useContext(FieldArrayContext);
    const previousValueRef = useRef<unknown>();

    // Get the full field path considering array context
    const fieldPath = arrayContext ? `${arrayContext.name}.${arrayContext.index}.${name}` : name;

    // Merge error display options from provider and component
    const mergedErrorOptions = useMemo(
        () => ({
            ...providerErrorOptions,
            ...errorDisplayOptions
        }),
        [providerErrorOptions, errorDisplayOptions]
    );

    // Merge styles from default, provider, and component
    const mergedStyles = useMemo(() => {
        // If using a UI library, use the modified styles that don't style inputs
        const baseStyles = uiLibrary?.enabled ? getUiLibraryCompatibleStyles(defaultStyles) : defaultStyles;

        const filteredProviderStyles = uiLibrary?.enabled
            ? getUiLibraryCompatibleStyles(providerStyles)
            : providerStyles;
        console.log(label, {
            defaultStyles,
            providerStyles,
            uiLibrary,
            baseStyles,
            filteredProviderStyles,
            styleOptions,
            merge: mergeStyles(baseStyles, filteredProviderStyles || {}, styleOptions as Record<string, string>)
        });
        return mergeStyles(baseStyles, filteredProviderStyles || {}, styleOptions as Record<string, string>);
    }, [uiLibrary, providerStyles, styleOptions]);

    // Determine if field is required from props or schema
    const isRequired = useMemo(
        () => required ?? formUtils.isFieldRequired(fieldPath, schema),
        [fieldPath, required, schema]
    );

    // Check if input is a checkbox
    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';
    const { error, isTouched, hasError } = useFieldState(fieldPath);

    // Get validation state and styles
    const {
        className,
        ariaInvalid,
        ariaDescribedBy,
        asyncError,
        asyncValidating,
        asyncValidatingStarted,
        hasAsyncError,
        showValidationIcons,
        showLoadingSpinner,
        textWhenValidating,
        textWhenBeforeStartValidating,
        validate
    } = useFieldValidation({
        fieldPath,
        isCheckbox,
        mergedStyles,
        asyncValidation,
        schema,
        hasError
    });

    // Combine async error with field error
    const displayError = asyncError || error?.message;

    // Create context value for field
    const contextValue = useMemo(
        () => ({
            name: fieldPath,
            form
        }),
        [fieldPath, form]
    );

    // Effect to force revalidation when the value changes
    useEffect(() => {
        const subscription = form.watch((_value, { name: fieldName }) => {
            if (fieldName === name) {
                const currentValue = form.getValues(name);
                if (currentValue !== previousValueRef.current && isTouched) {
                    previousValueRef.current = currentValue;
                    // Force revalidation when the field changes and has been touched
                    form.trigger(name).catch(console.error);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form, name, isTouched]);

    // Determine error display settings
    const showError = !providerErrorOptions?.groupErrors && (!!error || !!asyncError);
    const isErrorAbove = mergedErrorOptions?.position === 'above';
    const isErrorRight = mergedErrorOptions?.position === 'right';

    // Return the renderer component with all necessary props
    return (
        <FormFieldRenderer
            fieldPath={fieldPath}
            name={name}
            label={label}
            isRequired={isRequired}
            description={description}
            descriptionOptions={descriptionOptions}
            tooltip={tooltip}
            tooltipOptions={tooltipOptions}
            children={children}
            showError={showError}
            displayError={displayError}
            errorOptions={mergedErrorOptions}
            isErrorAbove={isErrorAbove}
            isErrorRight={isErrorRight}
            childRef={childRef}
            contextValue={contextValue}
            wrapperClassName={cn(mergedStyles.field?.wrapper)}
            asyncValidationProps={{
                showValidationIcons,
                isValidating: asyncValidating,
                showLoadingSpinner,
                asyncValidatingStarted,
                hasError: hasAsyncError,
                error: asyncError,
                textWhenValidating,
                textWhenBeforeStartValidating
            }}
            inputProps={{
                className: cn(mergedStyles.field?.input, className),
                ariaInvalid,
                ariaDescribedBy,
                validate
            }}
        />
    );
}
