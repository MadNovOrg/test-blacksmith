import { useTranslation } from 'react-i18next'

import { fireEvent, render, renderHook, screen } from '@test/index'

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
  ])('should render %s filter', filter => {
    render(<PricingFilters onChange={onChangeMock} />)
    expect(screen.getByText(filter)).toBeInTheDocument()
  })
  it.each([
    t('common.blended-learning'),
    t('common.reaccreditation'),
    t('course-level'),
    t('course-type'),
  ])('should filter by %s filter', filter => {
    render(<PricingFilters onChange={onChangeMock} />)
    fireEvent.click(screen.getByText(filter))
    expect(onChangeMock).toHaveBeenCalled()
  })
})
