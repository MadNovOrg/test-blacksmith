import React from 'react'

import { RoleName } from '@app/types'

import { render, screen } from '@test/index'

import { AdminPage } from './AdminPage'

describe('page: adminPage', () => {
  it('displays settings list', async () => {
    render(<AdminPage />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })
    expect(screen.getByText('Hub settings')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    expect(links[0]).toHaveTextContent('Users')
    expect(links[1]).toHaveTextContent('Organisations')
    expect(links[2]).toHaveTextContent('Course pricing')
    expect(links[3]).toHaveTextContent('Discounts')
    expect(links[4]).toHaveTextContent(
      'Cancellations, Transfers & Replacements'
    )
  })

  it(`displays Users and Organisations settings only for ${RoleName.LD}`, async () => {
    render(<AdminPage />, {
      auth: {
        activeRole: RoleName.LD,
      },
    })
    expect(screen.getByText('Hub settings')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent('Users')
    expect(links[1]).toHaveTextContent('Organisations')
  })
})
