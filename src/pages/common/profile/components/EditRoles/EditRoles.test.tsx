import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RoleName, TrainerRoleType } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { EmployeeRoleName } from '../../EditProfile'

import { EditRoles, RolesFields } from '.'

describe('component: EditRoles', () => {
  type FormValues = {
    roles: RolesFields
  }

  const FormWrapper: React.FC<{
    children: React.ReactNode
    mockRoles: FormValues
  }> = ({ children, mockRoles }) => {
    const formMethods = useForm<FormValues>({
      defaultValues: mockRoles,
    })

    return <FormProvider {...formMethods}>{children}</FormProvider>
  }

  it('displays employee roles', () => {
    const mockRoles = {
      roles: [
        {
          userRole: 'tt-employee',
          employeeRoles: [
            RoleName.TT_OPS,
            RoleName.FINANCE,
            'sales',
          ] as EmployeeRoleName[],
          salesRoles: [RoleName.SALES_ADMIN],
          trainerRoleTypes: {
            trainerRole: '',
            AOLRole: '',
            BILDRole: '',
          },
        },
      ],
    }
    render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'TT Employee'
    )

    const opsCheckbox = screen.getByLabelText('Operations')
    expect(opsCheckbox).toBeChecked()
    const financeCheckbox = screen.getByLabelText('Finance')
    expect(financeCheckbox).toBeChecked()
    const landdCheckbox = screen.getByLabelText('L&D')
    expect(landdCheckbox).not.toBeChecked()
    const salesCheckbox = screen.getByLabelText('Sales')
    expect(salesCheckbox).toBeChecked()
    const salesAdminCheckbox = screen.getByLabelText('Sales administrator')
    expect(salesAdminCheckbox).toBeChecked()
    const salesRepCheckbox = screen.getByLabelText('Sales representative')
    expect(salesRepCheckbox).not.toBeChecked()
  })

  it('displays admin role', () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TT_ADMIN,
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: {
            trainerRole: '',
            AOLRole: '',
            BILDRole: '',
          },
        },
      ],
    }
    render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'Administrator'
    )
  })

  it('displays user role', () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: {
            trainerRole: '',
            AOLRole: '',
            BILDRole: '',
          },
        },
      ],
    }
    render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'Individual'
    )
  })

  it('displays trainer role', () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TRAINER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: {
            trainerRole: TrainerRoleType.PRINCIPAL,
            AOLRole: TrainerRoleType.EMPLOYER_AOL,
            BILDRole: TrainerRoleType.BILD_SENIOR,
          },
        },
      ],
    }
    render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent('Trainer')
    expect(screen.getByTestId('trainer-role-select')).toHaveTextContent(
      'Principal'
    )
    expect(screen.getByTestId('aol-role-select')).toHaveTextContent(
      'Employer AOL'
    )
    expect(screen.getByTestId('bild-role-select')).toHaveTextContent(
      'BILD senior'
    )
  })

  it('allows deleting roles', async () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: {
            trainerRole: '',
            AOLRole: '',
            BILDRole: '',
          },
        },
        {
          userRole: RoleName.TT_ADMIN,
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: {
            trainerRole: '',
            AOLRole: '',
            BILDRole: '',
          },
        },
      ],
    }
    render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>
    )
    expect(screen.getAllByTestId('user-role-select')).toHaveLength(2)
    expect(screen.getAllByTestId('user-role-select')[0]).toHaveTextContent(
      'Individual'
    )
    await waitFor(() =>
      userEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    )
    expect(screen.getAllByTestId('user-role-select')).toHaveLength(1)
    expect(screen.getAllByTestId('user-role-select')[0]).toHaveTextContent(
      'Administrator'
    )
  })

  it('allows adding roles', async () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: {
            trainerRole: '',
            AOLRole: '',
            BILDRole: '',
          },
        },
      ],
    }
    render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>
    )

    expect(screen.getAllByTestId('user-role-select')).toHaveLength(1)
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Additional role' }))
    )
    expect(screen.getAllByTestId('user-role-select')).toHaveLength(2)
  })
})
