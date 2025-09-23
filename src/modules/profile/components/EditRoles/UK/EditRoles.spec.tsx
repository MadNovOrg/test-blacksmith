import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  RoleName,
  TrainerAgreementTypeName,
  TrainerRoleTypeName,
} from '@app/types'
import { capitalize } from '@app/util'

import { _render, screen, userEvent, waitFor } from '@test/index'

import { EditRoles, RolesFields } from '.'

describe('component: EditRoles', () => {
  type FormValues = {
    roles: RolesFields
  }

  const FormWrapper: React.FC<
    React.PropsWithChildren<{
      children: React.ReactNode
      mockRoles: FormValues
    }>
  > = ({ children, mockRoles }) => {
    const formMethods = useForm<FormValues>({
      defaultValues: mockRoles,
    })

    return <FormProvider {...formMethods}>{children}</FormProvider>
  }

  it('displays employee roles', () => {
    const mockRoles: FormValues = {
      roles: [
        {
          userRole: 'tt-employee',
          employeeRoles: [RoleName.TT_OPS, RoleName.FINANCE, 'sales'],
          salesRoles: [RoleName.SALES_ADMIN],
          trainerRoles: {
            trainerRole: [],
            BILDRole: '',
          },
        },
      ],
    }
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'TT Employee',
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
          trainerRoles: {
            trainerRole: [],
            BILDRole: '',
          },
        },
      ],
    }
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'Administrator',
    )
  })

  it('displays user role', () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [],
            BILDRole: '',
          },
        },
      ],
    }
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'Individual',
    )
  })

  it('displays trainer role', () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TRAINER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [TrainerRoleTypeName.PRINCIPAL],
            BILDRole: TrainerRoleTypeName.BILD_SENIOR,
            agreementTypes: [TrainerAgreementTypeName.AOL],
          },
        },
      ],
    }
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )

    expect(screen.getByTestId('user-role-select')).toHaveTextContent('Trainer')
    expect(
      screen.getByRole('button', {
        name: 'Principal',
      }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('bild-role-select')).toHaveTextContent(
      'BILD senior',
    )
    expect(screen.getByTestId('agreement-type-select')).toHaveTextContent('AOL')
  })
  it('autoselects roles if available', async () => {
    // Arrange
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TRAINER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [TrainerRoleTypeName.PRINCIPAL],
            BILDRole: '',
            agreementTypes: [],
          },
        },
      ],
    }
    // Act
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )
    await userEvent.click(
      screen.getByRole('button', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    )
    // Assert
    expect(
      screen.getByRole('option', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    ).toHaveAttribute('aria-selected', 'true')
  })

  it('autoselects agreement type if available', async () => {
    // Arrange
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TRAINER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [TrainerRoleTypeName.PRINCIPAL],
            BILDRole: '',
            agreementTypes: [TrainerAgreementTypeName.AOL],
          },
        },
      ],
    }
    // Act
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )
    // Assert

    await userEvent.click(
      screen.getByRole('button', {
        name: TrainerAgreementTypeName.AOL,
      }),
    )
    const checkboxAOL = screen.getByTestId('checkbox-AOL')
    expect(checkboxAOL).toBeInTheDocument()
    expect(checkboxAOL).toBeVisible()
    expect(checkboxAOL).toHaveAttribute('aria-selected', 'true')
  })

  it('can select or deselect options from the agreement type dropdown', async () => {
    // Arrange
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TRAINER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [TrainerRoleTypeName.PRINCIPAL],
            BILDRole: '',
            agreementTypes: [TrainerAgreementTypeName.AOL],
          },
        },
      ],
    }
    // Act
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )
    // Assert
    await userEvent.click(
      screen.getByRole('button', {
        name: capitalize(TrainerAgreementTypeName.AOL).toLocaleUpperCase(),
      }),
    )
    await userEvent.click(
      screen.getByRole('option', {
        name: capitalize(TrainerAgreementTypeName.AOL).toLocaleUpperCase(),
      }),
    )
    expect(
      screen.getByRole('option', {
        name: capitalize(TrainerAgreementTypeName.AOL).toLocaleUpperCase(),
      }),
    ).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(
      screen.getByRole('option', {
        name: capitalize(TrainerAgreementTypeName.AOL).toLocaleUpperCase(),
      }),
    )
    expect(
      screen.getByRole('option', {
        name: capitalize(TrainerAgreementTypeName.AOL).toLocaleUpperCase(),
      }),
    ).toHaveAttribute('aria-selected', 'true')
  })
  it('can select or deselect options from the dropdown', async () => {
    // Arrange
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.TRAINER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [TrainerRoleTypeName.PRINCIPAL],
            BILDRole: '',
            agreementTypes: [],
          },
        },
      ],
    }
    // Act
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )
    // Assert
    await userEvent.click(
      screen.getByRole('button', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    )
    await userEvent.click(
      screen.getByRole('option', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    )
    expect(
      screen.getByRole('option', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    ).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(
      screen.getByRole('option', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    )
    expect(
      screen.getByRole('option', {
        name: capitalize(TrainerRoleTypeName.PRINCIPAL),
      }),
    ).toHaveAttribute('aria-selected', 'true')
  })
  it('allows deleting roles', async () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [],
            BILDRole: '',
          },
        },
        {
          userRole: RoleName.TT_ADMIN,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [],
            BILDRole: '',
          },
        },
      ],
    }
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )
    expect(screen.getAllByTestId('user-role-select')).toHaveLength(2)
    expect(screen.getAllByTestId('user-role-select')[0]).toHaveTextContent(
      'Individual',
    )

    await userEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])

    await waitFor(() => {
      expect(screen.getAllByTestId('user-role-select')).toHaveLength(1)
      expect(screen.getAllByTestId('user-role-select')[0]).toHaveTextContent(
        'Administrator',
      )
    })
  })

  it('allows adding roles', async () => {
    const mockRoles = {
      roles: [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: {
            trainerRole: [],
            BILDRole: '',
          },
        },
      ],
    }
    _render(
      <FormWrapper mockRoles={mockRoles}>
        <EditRoles />
      </FormWrapper>,
    )

    expect(screen.getAllByTestId('user-role-select')).toHaveLength(1)

    await userEvent.click(
      screen.getByRole('button', { name: 'Additional role' }),
    )

    await waitFor(() =>
      expect(screen.getAllByTestId('user-role-select')).toHaveLength(2),
    )
  })
})
