import React from 'react'

import { buildPromo } from '@app/modules/order_details/pages/OrderDetails/mock-utils'
import { asyncNoop } from '@app/util'

import { render, screen } from '@test/index'

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
