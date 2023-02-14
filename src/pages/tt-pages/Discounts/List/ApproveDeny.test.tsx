import React from 'react'

import { render, screen } from '@test/index'

import { buildPromo } from '../../OrderDetails/mock-utils'

import { ApproveDeny } from './ApproveDeny'

describe('ApproveDeny component', () => {
  it('renders ApproveDeny', async () => {
    const promoCode = buildPromo({
      overrides: {
        amount: 5,
        code: 'CODE_5%_ALL',
      },
    })
    render(<ApproveDeny promoCode={promoCode} />)
    expect(screen.getByText('Approve')).toBeInTheDocument()
    expect(screen.getByText('Deny')).toBeInTheDocument()
  })
})
