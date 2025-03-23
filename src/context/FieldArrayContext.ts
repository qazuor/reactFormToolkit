import { createContext, useContext } from 'react';

interface FieldArrayContextValue {
    name: string;
    index: number;
}

export const FieldArrayContext = createContext<FieldArrayContextValue | null>(null);

export function useFieldArray() {
    const context = useContext(FieldArrayContext);
    if (!context) {
        throw new Error('useFieldArray must be used within a FieldArray component');
    }
    return context;
}
