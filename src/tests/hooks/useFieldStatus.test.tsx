import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { useFieldStatus } from '../../hooks/useFieldStatus';

describe('useFieldStatus', () => {
    const schema = z.object({
        test: z.string(),
        nested: z.object({
            field: z.string()
        }),
        array: z.array(
            z.object({
                name: z.string(),
                subArray: z.array(
                    z.object({
                        value: z.string()
                    })
                )
            })
        )
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <FormProvider
            schema={schema}
            onSubmit={(data) => console.log('Form submitted:', data)}
            defaultValues={{
                test: '',
                nested: { field: '' },
                array: [
                    {
                        name: '',
                        subArray: [{ value: '' }]
                    }
                ]
            }}
        >
            {children}
        </FormProvider>
    );

    it('returns initial field status', () => {
        const { result } = renderHook(() => useFieldStatus('test'), { wrapper });

        expect(result.current).toEqual({
            error: undefined,
            hasError: false,
            isDirty: false,
            isTouched: false,
            isValidating: false
        });
    });

    it('handles nested object fields', () => {
        const { result } = renderHook(() => useFieldStatus('nested.field'), { wrapper });

        expect(result.current).toEqual({
            error: undefined,
            hasError: false,
            isDirty: false,
            isTouched: false,
            isValidating: false
        });
    });

    it('handles array fields', () => {
        const { result } = renderHook(() => useFieldStatus('array.0.name'), { wrapper });

        expect(result.current).toEqual({
            error: undefined,
            hasError: false,
            isDirty: false,
            isTouched: false,
            isValidating: false
        });
    });

    it('handles nested array fields', () => {
        const { result } = renderHook(() => useFieldStatus('array.0.subArray.0.value'), { wrapper });

        expect(result.current).toEqual({
            error: undefined,
            hasError: false,
            isDirty: false,
            isTouched: false,
            isValidating: false
        });
    });
});
