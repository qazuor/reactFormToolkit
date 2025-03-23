import type { ErrorDisplayOptions } from '@/types';
import { createContext, useContext } from 'react';

export const FormErrorsContext = createContext<ErrorDisplayOptions | undefined>(undefined);

export function useFormErrors(): ErrorDisplayOptions | undefined {
    return useContext(FormErrorsContext);
}
