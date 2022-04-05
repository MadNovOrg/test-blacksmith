import React from 'react'
import { getI18n } from 'react-i18next'

import { RoleName } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { RoleSwitcher } from './RoleSwitcher'

const { t } = getI18n()
const RoleUserLabel = t(`components.role-switcher.${RoleName.USER}`)
const RoleTrainerLabel = t(`components.role-switcher.${RoleName.TRAINER}`)

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('component: RoleSwitcher', () => {
  it('renders as expected', async () => {
    const activeRole = RoleName.TRAINER
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    render(<RoleSwitcher />, { auth: { allowedRoles, activeRole } })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')

    expect(roleSwitcherBtn).toHaveTextContent(RoleTrainerLabel)
  })

  it('shows list when clicked', async () => {
    const activeRole = RoleName.TRAINER
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    render(<RoleSwitcher />, { auth: { allowedRoles, activeRole } })

    expect(screen.queryByTestId('RoleSwitcher-list')).toBeNull() // list not shown

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    userEvent.click(roleSwitcherBtn)

    const roleSwitcherRoles = screen.getAllByTestId('RoleSwitcher-otherRole')
    expect(roleSwitcherRoles).toHaveLength(1)
    expect(roleSwitcherRoles[0]).toHaveTextContent(RoleUserLabel)
  })

  it('changes role when click another role', async () => {
    const activeRole = RoleName.TRAINER
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    const { context } = render(<RoleSwitcher />, {
      auth: { allowedRoles, activeRole },
    })
    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    userEvent.click(roleSwitcherBtn)

    const roleSwitcherRoles = screen.getAllByTestId('RoleSwitcher-otherRole')
    userEvent.click(roleSwitcherRoles[0])

    expect(context.auth.changeRole).toBeCalledWith(RoleName.USER)
    expect(mockNavigate).toBeCalledWith('/')

    await waitFor(() => {
      expect(screen.queryByTestId('RoleSwitcher-list')).not.toBeInTheDocument()
    })
  })

  it('returns null if user has only one role', async () => {
    const activeRole = RoleName.USER
    const allowedRoles = new Set([RoleName.USER])

    render(<RoleSwitcher />, { auth: { allowedRoles, activeRole } })

    expect(screen.queryByTestId('RoleSwitcher-btn')).not.toBeInTheDocument()
  })
})
