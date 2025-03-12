import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../context/FormContext';
import type { SubmitButtonProps } from '../types';

export function SubmitButton({
    text,
    loadingText,
    className = '',
    successText,
    showSuccess = true,
    successDuration = 2000,
    'data-testid': dataTestId
}: SubmitButtonProps) {
    const { form } = useFormContext();
    const { t } = useTranslation();
    const [showSuccessState, setShowSuccessState] = useState(false);
    const { isSubmitting, isSubmitSuccessful } = form.formState;

    // Default texts from translations
    const defaultText = t('form.submit', { defaultValue: 'Submit' });
    const defaultLoadingText = t('form.loading', { defaultValue: 'Loading...' });
    const defaultSuccessText = t('form.success', { defaultValue: 'Success!' });

    // Use provided texts or defaults
    const buttonText = text || defaultText;
    const buttonLoadingText = loadingText || defaultLoadingText;
    const buttonSuccessText = successText || defaultSuccessText;

    // Handle success state
    useEffect(() => {
        if (isSubmitSuccessful && showSuccess) {
            setShowSuccessState(true);
            const timer = setTimeout(() => {
                setShowSuccessState(false);
            }, successDuration);
            return () => clearTimeout(timer);
        }
    }, [isSubmitSuccessful, showSuccess, successDuration]);

    // Determine button state and appearance
    const isLoading = isSubmitting;
    const isSuccess = showSuccessState && !isLoading;

    // Base button classes
    const baseClasses =
        'relative px-4 py-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    // State-specific classes
    const stateClasses = isLoading
        ? 'bg-blue-400 cursor-not-allowed'
        : isSuccess
          ? 'bg-green-500 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';

    return (
        <button
            type='submit'
            disabled={isLoading}
            className={`${baseClasses} ${stateClasses} ${className}`}
            data-testid={dataTestId}
        >
            {isLoading && (
                <span className='-translate-y-1/2 absolute top-1/2 left-3 transform'>
                    <svg
                        className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <title>{t('field.loading', { defaultValue: 'Loading' })}</title>
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                        />
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        />
                    </svg>
                </span>
            )}

            {isSuccess && (
                <span className='-translate-y-1/2 absolute top-1/2 left-3 transform'>
                    <svg
                        className='h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                    >
                        <title>{t('field.success', { defaultValue: 'Success' })}</title>
                        <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                        />
                    </svg>
                </span>
            )}

            <span className={isLoading || isSuccess ? 'ml-6' : ''}>
                {isLoading ? buttonLoadingText : isSuccess ? buttonSuccessText : buttonText}
            </span>
        </button>
    );
}
