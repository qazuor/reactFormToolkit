import { useFormContext } from '@/context';
import { FieldArrayContext } from '@/context';
import { useQRFTTranslation } from '@/hooks';
import { cn } from '@/lib';
import type { FieldArrayProps } from '@/types';
import { useFieldArray } from 'react-hook-form';

/**
 * FieldArray component for handling dynamic form field arrays
 *
 * @example
 * ```tsx
 * <FormProvider schema={schema}>
 *   <FieldArray name="items">
 *     <FormField name="name">
 *       <input type="text" />
 *     </FormField>
 *   </FieldArray>
 * </FormProvider>
 * ```
 */
export function FieldArray({
    name,
    children,
    minItems = 0,
    maxItems,
    addButtonText,
    removeButtonText,
    className,
    buttonClassName
}: FieldArrayProps) {
    const { t } = useQRFTTranslation();
    const { form } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name
    });

    const handleAdd = () => {
        if (!maxItems || fields.length < maxItems) {
            append({});
        }
    };

    const handleRemove = (index: number) => {
        if (fields.length > minItems) {
            remove(index);
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className='relative'
                >
                    <FieldArrayContext.Provider value={{ name, index }}>
                        <div className='mb-2 flex items-center justify-between'>
                            <span className='font-medium text-sm'>
                                {t('fieldArray.item')} {index + 1}
                            </span>
                            {fields.length > minItems && (
                                <button
                                    type='button'
                                    onClick={() => handleRemove(index)}
                                    className={cn(
                                        'rounded-md bg-red-100 px-2 py-1 text-red-700 text-sm hover:bg-red-200',
                                        buttonClassName
                                    )}
                                >
                                    {removeButtonText || t('fieldArray.remove')}
                                </button>
                            )}
                        </div>
                        {children}
                    </FieldArrayContext.Provider>
                </div>
            ))}

            {(!maxItems || fields.length < maxItems) && (
                <button
                    type='button'
                    onClick={handleAdd}
                    className={cn(
                        'mt-4 rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200',
                        buttonClassName
                    )}
                >
                    {addButtonText || t('fieldArray.add')}
                </button>
            )}
        </div>
    );
}
