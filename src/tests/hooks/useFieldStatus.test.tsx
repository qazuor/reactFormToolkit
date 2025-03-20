import { renderHook } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { useFieldStatus } from '../../hooks/useFieldStatus';

describe('useFieldStatus', () => {
    const schema = z.object({
        test: z.string()
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <FormProvider
            schema={schema}
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
            onSubmit={() => {}}
        >
            {children}
        </FormProvider>
    );

    it('returns initial field status', () => {
        const { result } = renderHook(() => useFieldStatus('test'), { wrapper });

        expect(result.current).toEqual({
            error: undefined,
            isTouched: false,
            isDirty: false,
            hasError: false
        });
    });
});
