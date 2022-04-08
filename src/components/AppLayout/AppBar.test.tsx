import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { chance, render, screen } from '@test/index'

import { AppBar } from './AppBar'

describe('component: AppBar', () => {
  it('renders logo as expected', async () => {
    render(
      <MemoryRouter>
        <AppBar />
      </MemoryRouter>
    )

    const logo = screen.getByTestId('app-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '230')
    expect(logo).toHaveAttribute('height', '48')
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
})
