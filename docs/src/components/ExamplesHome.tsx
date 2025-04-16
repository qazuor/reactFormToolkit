import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function ExamplesHome() {
    const { t } = useTranslation();

    return (
        <div className='markdown-body relative bg-white px-4 py-6 text-black dark:bg-zinc-900 dark:text-zinc-100'>
            <h1>{t('examples.title')}</h1>
            <p>
                {t('examples.homeDescription', {
                    defaultValue:
                        'Explore these examples to see Qazuor React Form Toolkit in action. Each example demonstrates different features and capabilities of the library.'
                })}
            </p>

            <h2>{t('examples.basicExamples', { defaultValue: 'Basic Examples' })}</h2>
            <ul>
                <li>
                    <Link to='/examples/basic'>{t('examples.tabs.basic')}</Link> -{t('form.basicDescription')}
                </li>
                <li>
                    <Link to='/examples/validation'>{t('examples.tabs.validation')}</Link> -
                    {t('form.validationDescription')}
                </li>
                <li>
                    <Link to='/examples/styled'>{t('examples.tabs.styled')}</Link> -{t('form.styledDescription')}
                </li>
            </ul>

            <h2>{t('examples.advancedExamples', { defaultValue: 'Advanced Examples' })}</h2>
            <ul>
                <li>
                    <Link to='/examples/conditional-field'>{t('examples.tabs.conditionalFields')}</Link> -
                    {t('form.conditionalFieldDescription')}
                </li>
                <li>
                    <Link to='/examples/dependent-field'>{t('examples.tabs.dependentFields')}</Link> -
                    {t('form.dependentFieldDescription')}
                </li>
                <li>
                    <Link to='/examples/field-array'>{t('examples.tabs.fieldArray')}</Link> -
                    {t('form.fieldArrayDescription')}
                </li>
                <li>
                    <Link to='/examples/async'>{t('examples.tabs.async')}</Link> -{t('form.asyncValidationDescription')}
                </li>
            </ul>
        </div>
    );
}
