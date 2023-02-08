import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterCurrencies } from './index'

describe('component: FilterCurrencies', () => {
  it('triggers onChange when currency = GBP is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCurrencies onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Currency'))
      userEvent.click(screen.getByText('GBP'))
    })

    expect(onChange).toHaveBeenCalledWith({ currencies: ['GBP'] })
  })
})
