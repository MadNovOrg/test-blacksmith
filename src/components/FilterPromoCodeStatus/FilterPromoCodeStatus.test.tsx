import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterPromoCodeStatus } from './index'

describe('component: FilterPromoCodeStatus', () => {
  it('triggers onChange when promo code status =  Approval pending is selected', async () => {
    const onChange = jest.fn()
    render(<FilterPromoCodeStatus onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Status'))
      userEvent.click(screen.getByText('Approval pending'))
    })

    expect(onChange).toHaveBeenCalledWith(['APPROVAL_PENDING'])
  })
})
