import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterByPaymentMethods } from './index'

describe(FilterByPaymentMethods.name, () => {
  it('triggers onChange when payment method = credit card is selected', async () => {
    const onChange = jest.fn()
    render(<FilterByPaymentMethods onChange={onChange} />)

    await userEvent.click(screen.getByText('Payment Method'))
    await userEvent.click(screen.getByText('Credit card'))

    expect(onChange).toHaveBeenCalledWith({ paymentMethods: ['CC'] })
  })
})
