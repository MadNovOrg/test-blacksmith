import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterPromoCodeType } from './index'

describe('component: FilterPromoCodeType', () => {
  it('triggers onChange when promo code type =  Percentage is selected', async () => {
    const onChange = jest.fn()
    render(<FilterPromoCodeType onChange={onChange} />)

    await userEvent.click(screen.getByText('Type'))
    await userEvent.click(screen.getByText('Percentage'))

    expect(onChange).toHaveBeenCalledWith(['PERCENT'])
  })
})
