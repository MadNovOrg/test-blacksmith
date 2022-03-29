import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { AppBar } from './AppBar'

import { chance, render, screen, within } from '@test/index'
import { RoleName } from '@app/types'

describe('component: AppBar', () => {
  it('renders logo as expected', async () => {
    render(
      <MemoryRouter>
        <AppBar />
      </MemoryRouter>
    )

    const logo = screen.getByTestId('app-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '40')
    expect(logo).toHaveAttribute('height', '40')
  })

  it('renders user name in profile button', async () => {
    const profile = { fullName: `${chance.first()} ${chance.last()}` }

    render(
      <MemoryRouter>
        <AppBar />
      </MemoryRouter>,
      { auth: { profile } }
    )

    const btn = screen.getByTestId('user-menu-btn')
    expect(btn).toHaveTextContent(`${profile.fullName}`)
  })

  describe('Trainer Base tab', () => {
    it('hides tab if user does not have proper role', async () => {
      const activeRole = RoleName.USER

      render(
        <MemoryRouter>
          <AppBar />
        </MemoryRouter>,
        { auth: { activeRole } }
      )

      const nav = screen.getByTestId('main-nav')
      const trainerBase = within(nav).queryByText('Trainer Base')
      expect(trainerBase).toBeNull()
    })

    it('shows tab if user has proper role', async () => {
      const activeRole = RoleName.TRAINER
      const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

      render(
        <MemoryRouter>
          <AppBar />
        </MemoryRouter>,
        { auth: { allowedRoles, activeRole } }
      )

      const nav = screen.getByTestId('main-nav')
      const trainerBase = within(nav).queryByText('Trainer Base')
      expect(trainerBase).toBeInTheDocument()
      expect(trainerBase).toHaveAttribute('href', '/trainer-base')
    })
  })

  describe('Admin tab', () => {
    it('hides tab if user does not have proper role', async () => {
      const activeRole = RoleName.USER

      render(
        <MemoryRouter>
          <AppBar />
        </MemoryRouter>,
        { auth: { activeRole } }
      )

      const nav = screen.getByTestId('main-nav')
      const admin = within(nav).queryByText('Admin')
      expect(admin).toBeNull()
    })

    it('shows tab if user has proper role', async () => {
      const activeRole = RoleName.TT_ADMIN
      const allowedRoles = new Set([RoleName.USER, RoleName.TT_ADMIN])

      render(
        <MemoryRouter>
          <AppBar />
        </MemoryRouter>,
        { auth: { allowedRoles, activeRole } }
      )

      const nav = screen.getByTestId('main-nav')
      const admin = within(nav).queryByText('Admin')
      expect(admin).toBeInTheDocument()
      expect(admin).toHaveAttribute('href', '/admin')
    })
  })
})
