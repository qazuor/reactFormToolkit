import { FormErrorIcon, LoadingIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type { SubmitButtonProps } from '@/types';

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
    const { t } = useQRFTTranslation();
    const { formState, asyncValidations, asyncErrors } = useFormContext();
    const { isSubmitting } = formState;

    // Check if any async validations are pending
    const hasPendingValidations = Object.entries(asyncValidations || {}).some(([_fieldName, isValidating]) => {
        // Only count fields that are actually validating
        return isValidating;
    });

    // Check if any async validations have errors
    const hasAsyncErrors = Object.entries(asyncErrors || {}).some(([_fieldName, hasError]) => {
        // Only count fields that has errors
        return hasError;
    });

    const isFormValid = !(hasPendingValidations || hasAsyncErrors);
    const isDisabled = !isFormValid || isSubmitting;

    const getTooltipText = () => {
        if (hasPendingValidations) {
            return t('form.submitDisabledPendingValidations');
        }
        if (hasAsyncErrors) {
            return t('form.submitDisabledAsyncErrors');
        }
        return undefined;
    };

    return (
        <button
            type='submit'
            disabled={isDisabled}
            data-testid='submit-button'
            className={cn(
                'relative flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            title={getTooltipText()}
            {...props}
        >
            {isSubmitting && <LoadingIcon className='mr-2 h-4 w-4 animate-spin' />}
            {!(isSubmitting || isFormValid) && <FormErrorIcon className='mr-2 h-4 w-4' />}
            {children}
        </button>
    );
}
