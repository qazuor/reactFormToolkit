import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../context/FormContext';

interface ResetButtonProps {
    text?: string;
    className?: string;
    confirmReset?: boolean;
    confirmText?: string;
    onReset?: () => void;
    'data-testid'?: string;
}

export function ResetButton({
    text,
    className = '',
    confirmReset = false,
    confirmText,
    onReset,
    'data-testid': dataTestId
}: ResetButtonProps) {
    const { form } = useFormContext();
    const { t } = useTranslation();
    const [confirming, setConfirming] = useState(false);

    // Default texts from translations
    const defaultText = t('form.reset', { defaultValue: 'Reset' });
    const defaultConfirmText = t('form.confirmReset', { defaultValue: 'Confirm Reset' });

    // Use provided texts or defaults
    const buttonText = text || defaultText;
    const buttonConfirmText = confirmText || defaultConfirmText;

    // Reset form to default values
    const handleReset = () => {
        if (confirmReset && !confirming) {
            setConfirming(true);
            return;
        }

        form.reset();

        if (onReset) {
            onReset();
        }

        setConfirming(false);
    };

    // Reset confirming state when clicked outside
    useEffect(() => {
        if (!confirmReset) {
            return;
        }

        const handleClickOutside = () => {
            setConfirming(false);
        };

        if (confirming) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [confirming, confirmReset]);

    // Base button classes
    const baseClasses =
        'relative px-4 py-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    // State-specific classes
    const stateClasses = confirming
        ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500';

    return (
        <button
            type='button'
            onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling for confirmation mode
                handleReset();
            }}
            className={`${baseClasses} ${stateClasses} ${className}`}
            data-testid={dataTestId}
        >
            {confirming ? buttonConfirmText : buttonText}
        </button>
    );
}
