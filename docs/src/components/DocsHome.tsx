import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function DocsHome() {
    const { t } = useTranslation();

    return (
        <div className='markdown-body relative bg-white px-4 py-6 text-black dark:bg-zinc-900 dark:text-zinc-100'>
            <h1>{t('docs.title')}</h1>
            <p>
                {t('docs.welcome', {
                    defaultValue:
                        'Welcome to the Qazuor React Form Toolkit documentation. Please select a topic from the sidebar to learn more about the library.'
                })}
            </p>

            <h2>{t('docs.gettingStarted', { defaultValue: 'Getting Started' })}</h2>
            <ul>
                <li>
                    <Link to='/docs/introduction'>{t('docs.tabs.Introduction')}</Link> -
                    {t('docs.introDescription', { defaultValue: 'Learn about the library and its features' })}
                </li>
                <li>
                    <Link to='/docs/form-provider'>{t('docs.tabs.Form Provider')}</Link> -
                    {t('docs.formProviderDescription', { defaultValue: 'The core component for managing form state' })}
                </li>
                <li>
                    <Link to='/docs/form-field'>{t('docs.tabs.Form Field')}</Link> -
                    {t('docs.formFieldDescription', { defaultValue: 'For rendering individual form fields' })}
                </li>
            </ul>

            <h2>{t('docs.advancedTopics', { defaultValue: 'Advanced Topics' })}</h2>
            <ul>
                <li>
                    <Link to='/docs/conditional-field'>{t('docs.tabs.Conditional Field')}</Link> -
                    {t('docs.conditionalFieldDescription', { defaultValue: 'Show/hide fields based on conditions' })}
                </li>
                <li>
                    <Link to='/docs/dependent-field'>{t('docs.tabs.Dependant Field')}</Link> -
                    {t('docs.dependentFieldDescription', { defaultValue: 'Fields that depend on other fields' })}
                </li>
                <li>
                    <Link to='/docs/field-array'>{t('docs.tabs.Field Array')}</Link> -
                    {t('docs.fieldArrayDescription', { defaultValue: 'Dynamic arrays of form fields' })}
                </li>
            </ul>
        </div>
    );
}
