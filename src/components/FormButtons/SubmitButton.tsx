import { FormErrorIcon, LoadingIcon } from '@/components/Icons';
import { useFormContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn, hasAsyncErrors, hasPendingValidations } from '@/lib';
import type { SubmitButtonProps } from '@/types';

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
    const { t } = useQRFTTranslation();
    const {
        formState: { isSubmitting },
        asyncValidations,
        asyncErrors
    } = useFormContext();

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
