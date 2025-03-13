/**
 * Default styles object containing classes for form elements.
 * These are Tailwind CSS classes that provide a clean, modern look.
 */
export const defaultStyles = {
    /** Default form wrapper styles */
    form: 'space-y-6',
    /** Default field styles */
    field: {
        /** Field wrapper styles */
        wrapper: 'mb-4 relative',
        /** Label styles */
        label: 'block text-sm text-gray-700 mb-1 font-bold',
        /** Input field styles */
        input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200',
        /** Select field styles */
        select: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200',
        /** Checkbox field styles */
        checkbox:
            'rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200',
        /** Textarea field styles */
        textarea:
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200',
        /** Error message styles */
        error: 'mt-2 text-sm text-red-600 animate-fadeIn',
        /** Field description styles */
        description: 'mt-2 text-sm text-gray-500',
        /** Required field mark (*) styles */
        requiredMark: 'ml-1 text-red-500',
        /** Validating state styles */
        validating: 'ml-2 text-xs text-blue-500 animate-pulse',
        /** Valid state indicator styles */
        valid: 'absolute right-3 top-9 text-green-500 animate-fadeIn',
        /** Invalid state indicator styles */
        invalid: 'absolute right-3 top-9 text-red-500 animate-fadeIn',
        /** Loading state styles */
        loading: 'animate-spin absolute right-3 top-9 text-gray-400',
        /** Tooltip container styles */
        tooltipContainer: 'relative inline-block ml-1',
        /** Tooltip icon styles */
        tooltipIcon: 'text-gray-500 hover:text-gray-700 cursor-pointer transition-colors',
        /** Tooltip content styles */
        tooltipContent: 'absolute z-10 p-2 text-xs bg-gray-800 text-white rounded shadow-lg max-w-xs'
    }
};
