import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterByPromoCodeType } from './index'

describe(FilterByPromoCodeType.name, () => {
  it('triggers onChange when promo code type =  Percentage is selected', async () => {
    const onChange = jest.fn()
    render(<FilterByPromoCodeType onChange={onChange} />)

    await userEvent.click(screen.getByText('Type'))
    await userEvent.click(screen.getByText('Percentage'))

    expect(onChange).toHaveBeenCalledWith(['PERCENT'])
  })
})
