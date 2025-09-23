import { useTranslation } from 'react-i18next'

import { fireEvent, _render, renderHook, screen } from '@test/index'

import { PricingFilters } from './PricingFilters'

describe(PricingFilters.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const onChangeMock = vi.fn()
  it.each([
    t('course-level'),
    t('course-type'),
    t('common.blended-learning'),
    t('common.reaccreditation'),
  ])('should _render %s filter', filter => {
    _render(<PricingFilters onChange={onChangeMock} />)
    expect(screen.getByText(filter)).toBeInTheDocument()
  })
  it.each([
    t('common.blended-learning'),
    t('common.reaccreditation'),
    t('course-level'),
    t('course-type'),
  ])('should filter by %s filter', filter => {
    _render(<PricingFilters onChange={onChangeMock} />)
    fireEvent.click(screen.getByText(filter))
    expect(onChangeMock).toHaveBeenCalled()
  })
})
