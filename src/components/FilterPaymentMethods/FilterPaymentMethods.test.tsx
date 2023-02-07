import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterPaymentMethods } from './index'

describe('component: FilterPaymentMethods', () => {
  it('triggers onChange when payment method = credit card is selected', async () => {
    const onChange = jest.fn()
    render(<FilterPaymentMethods onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Payment Method'))
      userEvent.click(screen.getByText('Credit card'))
    })

    expect(onChange).toHaveBeenCalledWith({ paymentMethods: ['CC'] })
  })
})
