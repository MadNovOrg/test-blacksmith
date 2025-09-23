import { useTranslation } from 'react-i18next'

import { AwsRegions } from '@app/types'

import { _render, screen, waitFor, userEvent, renderHook } from '@test/index'

import { FilterByCurrencies } from './index'

describe(FilterByCurrencies.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('triggers onChange when currency = GBP is selected', async () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
    const onChange = vi.fn()
    _render(<FilterByCurrencies onChange={onChange} />)

    await userEvent.click(screen.getByText('Currency'))
    await userEvent.click(screen.getByText(t('filters.GBP')))
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ currencies: ['GBP'] })
    })
  })
})
