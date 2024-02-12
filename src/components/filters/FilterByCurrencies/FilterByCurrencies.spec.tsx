import { useTranslation } from 'react-i18next'

import { render, screen, waitFor, userEvent, renderHook } from '@test/index'

import { FilterByCurrencies } from './index'

describe(FilterByCurrencies.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('triggers onChange when currency = GBP is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByCurrencies onChange={onChange} />)

    await userEvent.click(screen.getByText('Currency'))
    await userEvent.click(screen.getByText(t('filters.GBP')))
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ currencies: ['GBP'] })
    })
  })
})
