import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { RoleName } from '@app/types'

import { chance, render, screen, userEvent } from '@test/index'

import { AppBar } from './AppBar'

describe('component: AppBar', () => {
  it('renders logo as expected', async () => {
    render(<AppBar />)

    const logo = screen.getByTestId('app-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '230')
    expect(logo).toHaveAttribute('height', '48')
  })

  it('renders user name in profile button', async () => {
    const profile = { fullName: `${chance.first()} ${chance.last()}` }

    render(<AppBar />, { auth: { profile } })

    const btn = screen.getByTestId('user-menu-btn')
    expect(btn).toHaveTextContent(`${profile.fullName}`)
  })

  it('renders membership link if user can access membership area', async () => {
    render(
      <>
        <AppBar />
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route path="/membership" element={<p>Membership page</p>} />
        </Routes>
      </>,
      { auth: { verified: true, activeRole: RoleName.TRAINER } }
    )

    userEvent.click(screen.getByText('Membership'))
    expect(screen.getByText('Membership page')).toBeInTheDocument()
  })
})
