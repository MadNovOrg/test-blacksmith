import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterCurrencies } from './index'

describe('component: FilterCurrencies', () => {
  it('triggers onChange when currency = GBP is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCurrencies onChange={onChange} />)

    await userEvent.click(screen.getByText('Currency'))
    await userEvent.click(screen.getByText('GBP'))
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ currencies: ['GBP'] })
    })
  })
})
