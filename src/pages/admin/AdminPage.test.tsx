import React from 'react'

import { render, screen } from '@test/index'

import { AdminPage } from './AdminPage'

describe('page: adminPage', () => {
  it('displays settings list', async () => {
    render(<AdminPage />)
    expect(screen.getByText('Hub settings')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
    expect(links[0]).toHaveTextContent('Users')
    expect(links[1]).toHaveTextContent('Organisations')
    expect(links[2]).toHaveTextContent('Discounts')
    expect(links[3]).toHaveTextContent(
      'Cancellations, Transfers & Replacements'
    )
  })
})
