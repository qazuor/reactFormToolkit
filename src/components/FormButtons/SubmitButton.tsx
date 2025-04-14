import { FormErrorIcon, LoadingIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn, hasAsyncErrors, hasPendingValidations } from '@/lib/utils';
import type { SubmitButtonProps } from '@/types';

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
    const { t } = useQRFTTranslation();
    const {
        formState: { isSubmitting },
        styleOptions,
        asyncValidations,
        asyncErrors
    } = useFormContext();

    // Get button style from provider or use default
    const submitButtonClass =
        styleOptions?.buttons?.submit || 'bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700';

    const hasSomePendingValidations = hasPendingValidations(asyncValidations || {});
    const hasSomeAsyncErrors = hasAsyncErrors(asyncErrors || {});

    const isFormValid = !(hasSomePendingValidations || hasSomeAsyncErrors);
    const isDisabled = !isFormValid || isSubmitting;

    const getTooltipText = () => {
        if (hasSomePendingValidations) {
            return t('form.submitDisabledPendingValidations');
        }
        if (hasSomeAsyncErrors) {
            return t('form.submitDisabledAsyncErrors');
        }
        if (isSubmitting) {
            return t('form.isSubmitting');
        }
        return undefined;
    };

    return (
        <button
            type='submit'
            disabled={isDisabled}
            data-testid='submit-button'
            className={cn(
                'relative flex items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                submitButtonClass,
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
