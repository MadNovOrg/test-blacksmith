import React from 'react'

import { asyncNoop } from '@app/util'

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
    render(<ApproveDeny promoCode={promoCode} onAction={asyncNoop} />)
    expect(screen.getByText('Approve')).toBeInTheDocument()
    expect(screen.getByText('Deny')).toBeInTheDocument()
  })
})
