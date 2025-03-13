import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../context/FormContext';

interface CancelButtonProps {
    text?: string;
    className?: string;
    confirmCancel?: boolean;
    confirmText?: string;
    onCancel: () => void;
    'data-testid'?: string;
}

export function CancelButton({
    text,
    className = '',
    confirmCancel = false,
    confirmText,
    onCancel,
    'data-testid': dataTestId
}: CancelButtonProps) {
    const { form } = useFormContext();
    const { t } = useTranslation();
    const [confirming, setConfirming] = useState(false);
    const { formState } = form;
    const isDirty = formState?.isDirty;

    // Default texts from translations
    const defaultText = t('form.cancel', { defaultValue: 'Cancel' });
    const defaultConfirmText = t('form.confirmCancel', { defaultValue: 'Confirm Cancel' });

    // Use provided texts or defaults
    const buttonText = text || defaultText;
    const buttonConfirmText = confirmText || defaultConfirmText;

    // Handle cancel action
    const handleCancel = () => {
        if (confirmCancel && !confirming && isDirty) {
            setConfirming(true);
            return;
        }

        if (onCancel) {
            onCancel();
        }

        setConfirming(false);
    };

    // Reset confirming state when clicked outside
    useEffect(() => {
        if (!confirmCancel) {
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
    }, [confirming, confirmCancel]);

    // Base button classes
    const baseClasses =
        'relative px-4 py-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    // State-specific classes
    const stateClasses = confirming
        ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500';

    return (
        <button
            type='button'
            onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling for confirmation mode
                handleCancel();
            }}
            className={`${baseClasses} ${stateClasses} ${className}`}
            data-testid={dataTestId}
        >
            {confirming ? buttonConfirmText : buttonText}
        </button>
    );
}
