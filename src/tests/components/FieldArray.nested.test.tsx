import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { FieldArray } from '../../components/FieldArray/FieldArray';
import { FormField } from '../../components/FormField/FormField';
import { FormProvider } from '../../components/FormProvider/FormProvider';
import { TooltipProvider } from '../../components/ui/tooltip';

const schema = z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    departments: z.array(
        z.object({
            name: z.string().min(2, 'Department name must be at least 2 characters'),
            employees: z.array(
                z.object({
                    name: z.string().min(2, 'Employee name must be at least 2 characters'),
                    role: z.string().min(2, 'Role must be at least 2 characters')
                })
            )
        })
    )
});

describe('FieldArray with Nested Arrays', () => {
    const renderNestedFieldArray = () => {
        return render(
            <TooltipProvider>
                <FormProvider
                    schema={schema}
                    onSubmit={(data) => console.log(data)}
                    defaultValues={{
                        companyName: '',
                        departments: [
                            {
                                name: '',
                                employees: [
                                    {
                                        name: '',
                                        role: ''
                                    }
                                ]
                            }
                        ]
                    }}
                >
                    <FormField name='companyName'>
                        <input type='text' />
                    </FormField>

                    <FieldArray
                        name='departments'
                        addButtonText='Add Department'
                        removeButtonText='Remove Department'
                    >
                        <FormField name='name'>
                            <input type='text' />
                        </FormField>

                        <FieldArray
                            name='employees'
                            addButtonText='Add Employee'
                            removeButtonText='Remove Employee'
                            minItems={1}
                            maxItems={5}
                        >
                            <FormField name='name'>
                                <input type='text' />
                            </FormField>
                            <FormField name='role'>
                                <input type='text' />
                            </FormField>
                        </FieldArray>
                    </FieldArray>
                </FormProvider>
            </TooltipProvider>
        );
    };

    it('renders nested field arrays with correct paths', () => {
        renderNestedFieldArray();

        expect(screen.getByTestId('companyName')).toBeInTheDocument();
        expect(screen.getByTestId('departments.0.name')).toBeInTheDocument();
        expect(screen.getByTestId('departments.0.employees.0.name')).toBeInTheDocument();
        expect(screen.getByTestId('departments.0.employees.0.role')).toBeInTheDocument();
    });

    it('validates nested fields correctly', async () => {
        renderNestedFieldArray();

        // Enter invalid values and trigger validation
        const inputs = [
            screen.getByTestId('companyName'),
            screen.getByTestId('departments.0.name'),
            screen.getByTestId('departments.0.employees.0.name'),
            screen.getByTestId('departments.0.employees.0.role')
        ];

        for (const input of inputs) {
            await userEvent.type(input, 'a');
            fireEvent.blur(input);
        }

        await waitFor(() => {
            const errors = screen.getAllByText(/must be at least 2 characters/);
            expect(errors).toHaveLength(4);
        });
    });

    it('adds and removes nested items correctly', async () => {
        renderNestedFieldArray();

        // Add a new department
        const addDepartmentButton = screen.getByRole('button', { name: 'Add Department' });
        await userEvent.click(addDepartmentButton);

        await waitFor(() => {
            expect(screen.getByTestId('departments.1.name')).toBeInTheDocument();
        });

        // Add an employee to the first department
        const addEmployeeButton = screen.getByRole('button', { name: 'Add Employee' });
        await userEvent.click(addEmployeeButton);

        await waitFor(() => {
            expect(screen.getByTestId('departments.0.employees.1.name')).toBeInTheDocument();
            expect(screen.getByTestId('departments.0.employees.1.role')).toBeInTheDocument();
        });

        // Remove the second employee
        const removeDepartmentButton = screen.getAllByRole('button', { name: /Remove Item/i })[2];
        await userEvent.click(removeDepartmentButton);

        await waitFor(() => {
            expect(screen.queryByTestId('departments.0.employees.1.name')).not.toBeInTheDocument();
            expect(screen.queryByTestId('departments.0.employees.1.role')).not.toBeInTheDocument();
        });
    });

    it('maintains correct field paths after adding/removing items', async () => {
        renderNestedFieldArray();

        // Add two more departments
        const addDepartmentButton = screen.getByRole('button', { name: 'Add Department' });
        await userEvent.click(addDepartmentButton);
        await userEvent.click(addDepartmentButton);

        await waitFor(() => {
            expect(screen.getAllByTestId(/departments\.\d+\.name/)).toHaveLength(3);
        });

        // Add employees to first and second departments
        const employeeButtons = screen.getAllByRole('button', { name: 'Add Employee' });
        await userEvent.click(employeeButtons[0]); // First department
        await userEvent.click(employeeButtons[1]); // Second department

        await waitFor(() => {
            const employeeInputs = screen.getAllByTestId(/departments\.\d+\.employees\.\d+\.name/);
            expect(employeeInputs).toHaveLength(4); // 2 employees in first dept + 2 in second dept
        });

        // Remove first department
        const removeButtons = screen.getAllByRole('button', { name: 'Remove Department' });
        await userEvent.click(removeButtons[0]);

        await waitFor(() => {
            const remainingDepts = screen.getAllByTestId(/departments\.\d+\.name/);
            expect(remainingDepts).toHaveLength(2);
        });
    });
});
