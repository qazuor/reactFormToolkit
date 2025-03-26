import { zodResolver } from '@hookform/resolvers/zod';
import { CancelButton, FormField, FormProvider, ResetButton, SubmitButton } from '@qazuor/react-form-toolkit';
import type { ErrorAnimation, ErrorDisplayOptions, ErrorPosition } from '@qazuor/react-form-toolkit';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

type FormData = z.infer<typeof schema>;

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

const defaultConfig: ErrorDisplayOptions = {
    position: 'below',
    animation: 'none',
    showIcon: true,
    delay: 0,
    autoDismiss: false,
    dismissAfter: 3000,
    groupErrors: false,
    maxErrors: undefined
};

const positions: ErrorPosition[] = ['below', 'above', 'right', 'tooltip'];
const animations: ErrorAnimation[] = ['none', 'fadeIn', 'slideIn', 'pulse', 'shake'];

export function ErrorsFormExample() {
    const { t } = useTranslation();
    const [config, setConfig] = useState<ErrorDisplayOptions>(defaultConfig);
    const exampleForm = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur'
    });

    const handleSubmit: SubmitHandler<FormData> = async (data) => {
        console.info('Form submitted:', data);
    };

    const handleReset = () => {
        const form = document.querySelector('form');
        if (form) {
            form.reset();
        }
    };

    const handleConfigChange = (key: keyof ErrorDisplayOptions, value: unknown) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleClearConfig = () => {
        setConfig(defaultConfig);
        handleReset();
    };

    return (
        <div className='space-y-8'>
            <section className='rounded-lg border bg-gray-50 p-6'>
                <div className='mb-4 flex items-center justify-between'>
                    <h2 className='font-bold text-xl'>{t('form.errorConfig.title')}</h2>
                    <button
                        type='button'
                        onClick={handleClearConfig}
                        className='rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300'
                    >
                        {t('form.errorConfig.clear')}
                    </button>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                        <label
                            htmlFor='position'
                            className='block font-medium text-sm'
                        >
                            {t('form.errorConfig.position')}
                        </label>
                        <select
                            id='position'
                            className='mt-1 block w-full rounded-md border p-2'
                            value={config.position}
                            onChange={(e) => handleConfigChange('position', e.target.value)}
                        >
                            {positions.map((pos) => (
                                <option
                                    key={pos}
                                    value={pos}
                                >
                                    {pos}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor='animation'
                            className='block font-medium text-sm'
                        >
                            {t('form.errorConfig.animation')}
                        </label>
                        <select
                            id='animation'
                            className='mt-1 block w-full rounded-md border p-2'
                            value={config.animation}
                            onChange={(e) => handleConfigChange('animation', e.target.value)}
                        >
                            {animations.map((anim) => (
                                <option
                                    key={anim}
                                    value={anim}
                                >
                                    {anim}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor='delay'
                            className='block font-medium text-sm'
                        >
                            {t('form.errorConfig.delay')}
                        </label>
                        <input
                            id='delay'
                            type='number'
                            className='mt-1 block w-full rounded-md border p-2'
                            value={config.delay}
                            onChange={(e) => handleConfigChange('delay', Number(e.target.value))}
                            min={0}
                            step={100}
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={config.showIcon}
                                onChange={(e) => handleConfigChange('showIcon', e.target.checked)}
                            />
                            <span className='font-medium text-sm'>{t('form.errorConfig.showIcon')}</span>
                        </label>

                        <label className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={config.groupErrors}
                                onChange={(e) => handleConfigChange('groupErrors', e.target.checked)}
                            />
                            <span className='font-medium text-sm'>{t('form.errorConfig.groupErrors')}</span>
                        </label>

                        <label className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={config.autoDismiss}
                                onChange={(e) => handleConfigChange('autoDismiss', e.target.checked)}
                            />
                            <span className='font-medium text-sm'>{t('form.errorConfig.autoDismiss')}</span>
                        </label>
                    </div>

                    {config.groupErrors && (
                        <div>
                            <label
                                htmlFor='maxErrors'
                                className='block font-medium text-sm'
                            >
                                {t('form.errorConfig.maxErrors')}
                            </label>
                            <input
                                id='maxErrors'
                                type='number'
                                className='mt-1 block w-full rounded-md border p-2'
                                value={config.maxErrors}
                                onChange={(e) => handleConfigChange('maxErrors', Number(e.target.value))}
                                min={1}
                            />
                        </div>
                    )}

                    {config.autoDismiss && (
                        <div>
                            <label
                                htmlFor='dismissAfter'
                                className='block font-medium text-sm'
                            >
                                {t('form.errorConfig.dismissAfter')}
                            </label>
                            <input
                                id='dismissAfter'
                                type='number'
                                className='mt-1 block w-full rounded-md border p-2'
                                value={config.dismissAfter}
                                onChange={(e) => handleConfigChange('dismissAfter', Number(e.target.value))}
                                min={1000}
                                step={1000}
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className='rounded-lg border p-6'>
                <h2 className='mb-4 font-bold text-xl'>{t('form.exampleForm.title')}</h2>
                <FormProvider
                    schema={schema}
                    onSubmit={handleSubmit}
                    form={exampleForm}
                    errorDisplayOptions={config}
                >
                    <div className='space-y-4'>
                        <FormField
                            name='username'
                            label={t('form.exampleForm.username.label')}
                        >
                            <input
                                type='text'
                                className='w-full rounded-md border px-3 py-2'
                                placeholder={t('form.exampleForm.username.placeholder')}
                            />
                        </FormField>

                        <FormField
                            name='email'
                            label={t('form.exampleForm.email.label')}
                        >
                            <input
                                type='email'
                                className='w-full rounded-md border px-3 py-2'
                                placeholder={t('form.exampleForm.email.placeholder')}
                            />
                        </FormField>

                        <FormField
                            name='password'
                            label={t('form.exampleForm.password.label')}
                        >
                            <input
                                type='password'
                                className='w-full rounded-md border px-3 py-2'
                                placeholder={t('form.exampleForm.password.placeholder')}
                            />
                        </FormField>

                        <div className='flex gap-4'>
                            <SubmitButton>{t('form.submit')}</SubmitButton>
                            <ResetButton onClick={handleReset}>{t('form.exampleForm.reset')}</ResetButton>
                            <CancelButton onCancel={() => console.log('Cancelled')} />
                        </div>
                    </div>
                </FormProvider>
            </section>
        </div>
    );
}
