import React from 'react'

import { RoleName } from '@app/types'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import {
  topRolesNames,
  employeeRolesNames,
  salesRolesNames,
  employeeRole,
  salesRole,
} from '../../EditProfile'

import { EditRoles } from '.'

describe('component: EditRoles', () => {
  it('displays employee roles', () => {
    const mockRoles = [
      { id: 'a', name: RoleName.FINANCE },
      { id: 'b', name: RoleName.TT_OPS },
      { id: 'c', name: RoleName.SALES_ADMIN },
      { id: 'd', name: RoleName.SALES_REPRESENTATIVE },
      { id: 'e', name: RoleName['L&D'] },
    ]
    const props = {
      systemRoles: mockRoles,
      roles: [
        [
          RoleName.FINANCE,
          RoleName.TT_OPS,
          RoleName.SALES_ADMIN,
          employeeRole.name,
          salesRole.name,
        ],
      ],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

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
    const mockRoles = [{ id: 'a', name: RoleName.TT_ADMIN }]
    const props = {
      systemRoles: mockRoles,
      roles: [[RoleName.TT_ADMIN]],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'Administrator'
    )
  })

  it('displays user role', () => {
    const mockRoles = [{ id: 'a', name: RoleName.USER }]
    const props = {
      systemRoles: mockRoles,
      roles: [[RoleName.USER]],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

    expect(screen.getByTestId('user-role-select')).toHaveTextContent(
      'Individual'
    )
  })

  it('displays trainer role', () => {
    const mockRoles = [{ id: 'a', name: RoleName.TRAINER }]
    const props = {
      systemRoles: mockRoles,
      roles: [[RoleName.TRAINER]],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

    expect(screen.getByTestId('user-role-select')).toHaveTextContent('Trainer')
  })

  it('allows editing roles', async () => {
    const mockRoles = [
      { id: 'a', name: RoleName.TT_ADMIN },
      { id: 'b', name: RoleName.TRAINER },
    ]
    const props = {
      systemRoles: mockRoles,
      roles: [[RoleName.TT_ADMIN]],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

    await waitFor(() =>
      userEvent.click(
        within(screen.getByTestId('user-role-select')).getByText(
          'Administrator'
        )
      )
    )
    userEvent.click(screen.getByText('Trainer'))
    expect(props.setRoles).toHaveBeenCalledTimes(1)
    expect(props.setRoles).toHaveBeenCalledWith([[RoleName.TRAINER]])
  })

  it('allows deleting roles', async () => {
    const mockRoles = [
      { id: 'a', name: RoleName.TT_ADMIN },
      { id: 'b', name: RoleName.TRAINER },
    ]
    const props = {
      systemRoles: mockRoles,
      roles: [[RoleName.TT_ADMIN], [RoleName.TRAINER]],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

    await waitFor(() =>
      userEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    )
    expect(props.setRoles).toHaveBeenCalledTimes(1)
    expect(props.setRoles).toHaveBeenCalledWith([[RoleName.TRAINER]])
  })

  it('allows adding roles', async () => {
    const mockRoles = [
      { id: 'a', name: RoleName.TT_ADMIN },
      { id: 'b', name: RoleName.TRAINER },
    ]
    const props = {
      systemRoles: mockRoles,
      roles: [[RoleName.TT_ADMIN]],
      setRoles: jest.fn(),
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    }
    render(<EditRoles {...props} />)

    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Additional role' }))
    )
    expect(props.setRoles).toHaveBeenCalledTimes(1)
    expect(props.setRoles).toHaveBeenCalledWith([[RoleName.TT_ADMIN], ['']])
  })
})
