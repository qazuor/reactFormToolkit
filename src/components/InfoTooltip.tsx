import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../context/FormContext';
import type { InfoTooltipProps } from '../types';

export function InfoTooltip({
    content,
    className = '',
    contentClassName = '',
    iconClassName = '',
    position = 'top',
    'data-testid': dataTestId
}: InfoTooltipProps) {
    const { styles } = useFormContext();
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    // Handle escape key to close tooltip
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isVisible) {
                setIsVisible(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isVisible]);

    // Handle click outside to close tooltip
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) && isVisible) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    // Default styles
    const defaultContainerClass = 'relative inline-block ml-1';
    const defaultIconClass = 'text-gray-500 hover:text-gray-700 cursor-pointer transition-colors';
    const defaultContentClass = 'absolute z-10 p-2 text-xs bg-gray-800 text-white rounded shadow-lg max-w-xs';

    // Position classes
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-1'
    };

    // Custom styles from form context
    const tooltipContainerClass = styles.tooltipContainer || defaultContainerClass;
    const tooltipIconClass = styles.tooltipIcon || defaultIconClass;
    const tooltipContentClass = styles.tooltipContent || defaultContentClass;

    return (
        <div
            className={`${tooltipContainerClass} ${className}`}
            ref={tooltipRef}
            data-testid={dataTestId}
        >
            {/* Info icon */}
            <button
                type='button'
                className={`${tooltipIconClass} ${iconClassName}`}
                onClick={() => setIsVisible(!isVisible)}
                onKeyUp={(e) => e.key === 'Enter' && setIsVisible(!isVisible)}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                aria-label='More information'
                aria-expanded={isVisible}
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <title>{t('field.tooltipInfo', { defaultValue: 'More info' })}</title>
                    <circle
                        cx='12'
                        cy='12'
                        r='10'
                    />
                    <line
                        x1='12'
                        y1='16'
                        x2='12'
                        y2='12'
                    />
                    <line
                        x1='12'
                        y1='8'
                        x2='12.01'
                        y2='8'
                    />
                </svg>
            </button>

            {/* Tooltip content */}
            {isVisible && (
                <div
                    className={`${tooltipContentClass} ${positionClasses[position]} ${contentClassName}`}
                    role='tooltip'
                >
                    {content}
                    <div
                        className={`absolute h-2 w-2 rotate-45 transform bg-gray-800 ${
                            position === 'top'
                                ? '-translate-x-1/2 -mb-1 bottom-0 left-1/2'
                                : position === 'right'
                                  ? '-translate-y-1/2 -ml-1 top-1/2 left-0'
                                  : position === 'bottom'
                                    ? '-translate-x-1/2 -mt-1 top-0 left-1/2'
                                    : '-translate-y-1/2 -mr-1 top-1/2 right-0'
                        }`}
                    />
                </div>
            )}
        </div>
    );
}
