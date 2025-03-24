import { ValidationStatusIcon } from '@/components/Icons/';
import { FormFieldContext, useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useFieldStatus, useQRFTTranslation } from '@/hooks';
import { cn, defaultStyles, formUtils, mergeStyles } from '@/lib';
import type { FormFieldProps } from '@/types';
import {
    type ReactElement,
    cloneElement,
    isValidElement,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Controller, type ControllerRenderProps, type FieldValues as TFieldValues } from 'react-hook-form';
import { FieldDescription } from './FieldDescription';
import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

/**
 * FormField component for rendering form inputs with validation
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
    children,
    description,
    descriptionOptions,
    tooltip,
    tooltipOptions,
    styleOptions,
    errorDisplayOptions,
    asyncValidation,
    asyncValidationDebounce = 500,
    showValidationIcons = true,
    showLoadingSpinner = true
}: FormFieldProps): ReactElement {
    const { form, schema, styleOptions: providerStyles, errorDisplayOptions: providerErrorOptions } = useFormContext();
    const { t } = useQRFTTranslation();
    const childRef = useRef<HTMLElement>(null);
    const arrayContext = useContext(FieldArrayContext);
    const [isValidating, setIsValidating] = useState(false);
    const [asyncError, setAsyncError] = useState<string>();
    const debounceTimeout = useRef<NodeJS.Timeout>();
    const [hasStartedValidating, setHasStartedValidating] = useState(false);

    // Construct the full field path if inside a FieldArray
    const fieldPath = arrayContext ? `${arrayContext.name}.${arrayContext.index}.${name}` : name;

    // Merge error display options
    const mergedErrorOptions = useMemo(
        () => ({
            ...providerErrorOptions,
            ...errorDisplayOptions
        }),
        [providerErrorOptions, errorDisplayOptions]
    );

    // Merge component styles with provider styles
    const mergedStyles = useMemo(
        () => mergeStyles(defaultStyles, providerStyles || {}, styleOptions as Record<string, string>),
        [providerStyles, styleOptions]
    );

    // Determine if field is required based on schema
    const isRequired = useMemo(
        () => required ?? formUtils.isFieldRequired(fieldPath, schema),
        [fieldPath, required, schema]
    );

    // Determine field type and properties
    const isCheckbox = isValidElement(children) && children.props.type === 'checkbox';

    const { error, hasError } = useFieldStatus(fieldPath);
    const displayError = asyncError || error?.message;

    // Handle async validation
    useEffect(() => {
        if (!asyncValidation) {
            return;
        }

        const subscription = form.watch((value, { name: changedField }) => {
            if (changedField === fieldPath) {
                const fieldValue = value[fieldPath as keyof typeof value];

                if (debounceTimeout.current) {
                    // Clear any existing timeout
                    clearTimeout(debounceTimeout.current);
                }

                // Check Zod validation first
                const result = schema?.safeParse({ [fieldPath]: fieldValue });
                const hasFieldError =
                    !result || result.success
                        ? false
                        : result.error.issues.some((issue) => issue.path[0] === fieldPath);

                if (!(hasStartedValidating || hasFieldError)) {
                    // Mark that validation has started
                    setHasStartedValidating(true);
                }

                if (hasFieldError) {
                    setIsValidating(false);
                    setAsyncError(undefined);
                    setHasStartedValidating(false);
                } else {
                    setIsValidating(true);
                    setAsyncError(undefined);

                    // Set new timeout for debounced validation
                    debounceTimeout.current = setTimeout(async () => {
                        try {
                            const validationError = await asyncValidation(fieldValue);
                            setAsyncError(validationError);
                        } catch (error) {
                            setAsyncError(t('field.asyncValidationError'));
                            console.error('AsyncValidation error', error);
                        } finally {
                            setIsValidating(false);
                        }
                    }, asyncValidationDebounce);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [asyncValidation, fieldPath, form, t, schema, asyncValidationDebounce]);

    const contextValue = useMemo(
        () => ({
            name: fieldPath,
            form
        }),
        [fieldPath, form]
    );

    if (!isValidElement(children)) {
        return <></>;
    }

    /**
     * Renders the child element with the field properties
     */
    const renderChildElement = (field: ControllerRenderProps<TFieldValues, string>): ReactElement => {
        // Properties specific to checkboxes
        const checkboxProps = isCheckbox ? { checked: !!field.value } : {};

        const inputType = isCheckbox ? 'checkbox' : 'input';
        const baseClasses = mergedStyles.field?.[inputType];

        const stateClasses = cn({
            [(mergedStyles.field?.isInvalid as string) || '']: hasError,
            [(mergedStyles.field?.isValid as string) || '']: !hasError,
            [(mergedStyles.field?.isLoading as string) || '']: field.disabled || isValidating,
            [(mergedStyles.field?.isValidating as string) || '']: isValidating
        });

        // Filter out non-DOM props to avoid React warnings
        const { tooltipPosition, errorDisplay, ...childProps } = children.props;

        return cloneElement(children, {
            ...childProps,
            ...field,
            ref: childRef,
            ...checkboxProps,
            className: cn(baseClasses, stateClasses, children.props.className),
            value: isCheckbox ? field.value : (field.value ?? ''),
            id: fieldPath,
            'data-testid': fieldPath,
            'aria-invalid': !!(error || asyncError),
            'aria-describedby': description ? descriptionOptions?.id || `${fieldPath}-description` : undefined
        });
    };

    return (
        <div className={cn(mergedStyles.field?.wrapper)}>
            <FormFieldContext.Provider value={contextValue}>
                {description && descriptionOptions?.position === 'above' && (
                    <FieldDescription
                        id={descriptionOptions?.id || `${fieldPath}-description`}
                        position='above'
                        className={cn(mergedStyles.field?.description, descriptionOptions?.className)}
                        role={descriptionOptions?.role}
                        aria-label={descriptionOptions?.['aria-label']}
                    >
                        {description}
                    </FieldDescription>
                )}
                {label && (
                    <FieldLabel
                        htmlFor={fieldPath}
                        required={isRequired}
                        tooltip={tooltip}
                        tooltipOptions={tooltipOptions}
                    >
                        {label}
                    </FieldLabel>
                )}
                <Controller
                    control={form.control}
                    name={fieldPath}
                    render={({ field }) => {
                        const showError = !providerErrorOptions?.groupErrors && (hasError || !!asyncError);
                        const isAbove = mergedErrorOptions?.position === 'above';
                        const isRight = mergedErrorOptions?.position === 'right';

                        return (
                            <div className='relative'>
                                {showError && isAbove && (
                                    <FieldError
                                        name={fieldPath}
                                        inputRef={childRef}
                                        options={mergedErrorOptions}
                                    />
                                )}
                                <div className={cn(isRight && 'flex items-center gap-2')}>
                                    {renderChildElement(field)}
                                    {showValidationIcons && asyncValidation && (
                                        <div className='items-top pointer-events-none absolute inset-y-0 right-0 flex pt-3 pr-3'>
                                            {hasStartedValidating && isValidating && showLoadingSpinner && (
                                                <ValidationStatusIcon status='loading' />
                                            )}
                                            {!isValidating && !!asyncError && <ValidationStatusIcon status='error' />}
                                            {hasStartedValidating && !(isValidating || asyncError) && field.value && (
                                                <ValidationStatusIcon status='success' />
                                            )}
                                        </div>
                                    )}
                                    {showError && !isAbove && (
                                        <FieldError
                                            name={fieldPath}
                                            message={displayError}
                                            inputRef={childRef}
                                            options={mergedErrorOptions}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    }}
                />
                {description && (!descriptionOptions?.position || descriptionOptions?.position === 'below') && (
                    <FieldDescription
                        id={descriptionOptions?.id || `${fieldPath}-description`}
                        position='below'
                        className={descriptionOptions?.className}
                        role={descriptionOptions?.role}
                        aria-label={descriptionOptions?.['aria-label']}
                    >
                        {description}
                    </FieldDescription>
                )}
            </FormFieldContext.Provider>
        </div>
    );
}
