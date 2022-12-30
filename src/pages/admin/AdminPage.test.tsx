import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { render, screen } from '@test/index'

import { AdminPage } from './AdminPage'

describe('page: adminPage', () => {
  it('displays settings list', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Hub settings')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links[0]).toHaveTextContent('Users')
    expect(links[1]).toHaveTextContent('Organisations')
    expect(links[2]).toHaveTextContent('Discounts')
    expect(links[3]).toHaveTextContent('Waitlist notifications')
    expect(links[4]).toHaveTextContent('Course renewals')
    expect(links[5]).toHaveTextContent(
      'Cancellations, Transfers & Replacements'
    )
  })
})
