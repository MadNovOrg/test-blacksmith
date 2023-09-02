import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterByCurrencies } from './index'

describe(FilterByCurrencies.name, () => {
  it('triggers onChange when currency = GBP is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByCurrencies onChange={onChange} />)

    await userEvent.click(screen.getByText('Currency'))
    await userEvent.click(screen.getByText('GBP'))
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ currencies: ['GBP'] })
    })
  })
})
