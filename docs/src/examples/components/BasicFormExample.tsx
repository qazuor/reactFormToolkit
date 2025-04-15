import { FormButtonsBar, FormDescription, FormField, FormProvider } from '@qazuor/react-form-toolkit';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

interface BasicFormProps {
    setResult: (data: Record<string, unknown> | null) => void;
}

export function BasicFormExample({ setResult }: BasicFormProps) {
    const { t } = useTranslation();

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setResult(data);
    };

    return (
        <FormProvider
            schema={schema}
            onSubmit={handleSubmit}
        >
            <FormDescription position='above'>{t('form.description')}</FormDescription>
            <div className='space-y-6'>
                <FormField
                    name='email'
                    label={t('form.email')}
                    description={t('form.emailDescription')}
                    descriptionOptions={{
                        position: 'below',
                        className: 'text-blue-600',
                        role: 'note'
                    }}
                    tooltip={t('form.emailTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start',
                        sideOffset: 8,
                        className: 'custom-tooltip'
                    }}
                    required={true}
                >
                    <input
                        type='email'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.emailPlaceholder')}
                    />
                </FormField>

                <FormField
                    name='password'
                    label={t('form.password')}
                    tooltip={t('form.passwordTooltip')}
                    tooltipOptions={{
                        position: 'right',
                        align: 'start',
                        sideOffset: 8
                    }}
                    required={true}
                >
                    <input
                        type='password'
                        className='w-full rounded-md border px-3 py-2'
                        placeholder={t('form.passwordPlaceholder')}
                    />
                </FormField>
                <FormButtonsBar
                    direction='horizontal'
                    fullWidth={false}
                    onCancel={() => console.log('Cancelled')}
                />
            </div>
        </FormProvider>
    );
}
