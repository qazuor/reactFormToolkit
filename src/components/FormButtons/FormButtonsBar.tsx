import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type { FormButtonsBarProps } from '@/types/buttons';
import { CancelButton } from './CancelButton';
import { ResetButton } from './ResetButton';
import { SubmitButton } from './SubmitButton';

/**
 * FormButtonsBar component for rendering form action buttons
 *
 * @example
 * ```tsx
 * <FormButtonsBar
 *   direction="horizontal"
 *   fullWidth={false}
 *   onCancel={() => console.log('cancelled')}
 * >
 *   <button type="button">Custom Button</button>
 * </FormButtonsBar>
 * ```
 */
export function FormButtonsBar({
    direction = 'horizontal',
    fullWidth = false,
    className,
    buttonStyles,
    showSubmit = true,
    showReset = true,
    showCancel = true,
    submitText,
    resetText,
    cancelText,
    onCancel,
    children
}: FormButtonsBarProps) {
    const { t } = useQRFTTranslation();

    const containerClasses = cn(
        'flex',
        {
            'flex-col gap-2': direction === 'vertical',
            'flex-row gap-2': direction === 'horizontal'
        },
        className
    );

    const buttonClasses = cn({
        'w-full': fullWidth,
        'flex-2': !fullWidth && direction === 'horizontal',
        'w-fit': !fullWidth && direction === 'vertical'
    });

    return (
        <div className={containerClasses}>
            {showSubmit && (
                <SubmitButton className={cn(buttonClasses, buttonStyles?.submit)}>
                    {submitText || t('form.submit')}
                </SubmitButton>
            )}
            {showReset && (
                <ResetButton className={cn(buttonClasses, buttonStyles?.reset)}>
                    {resetText || t('form.reset')}
                </ResetButton>
            )}
            {showCancel && (
                <CancelButton
                    className={cn(buttonClasses, buttonStyles?.cancel)}
                    onCancel={onCancel}
                >
                    {cancelText || t('form.cancel')}
                </CancelButton>
            )}
            {children && <div className={buttonClasses}>{children}</div>}
        </div>
    );
}
