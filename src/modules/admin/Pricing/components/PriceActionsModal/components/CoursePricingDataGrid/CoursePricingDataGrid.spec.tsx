// TODO: more relevant tests to be addeed
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { Course_Pricing } from '@app/generated/graphql'

import { render, renderHook, screen } from '@test/index'
import { buildCoursePricing } from '@test/mock-data-utils'

import { CoursePricingDataGrid } from './CoursePricingDataGrid'

describe(CoursePricingDataGrid.name, () => {
  const onSaveMock = vi.fn()
  const defaultPricingMock = null
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const urqlClientMock = {
    executeQuery: () => vi.fn(() => never),
    executeMutation: () => vi.fn(() => never),
  } as unknown as Client

  const setup = ({
    client = urqlClientMock,
    pricingMock,
  }: {
    client?: Client
    pricingMock?: Course_Pricing | null
  }) => {
    return render(
      <Provider value={client}>
        <CoursePricingDataGrid
          onSave={onSaveMock}
          pricing={pricingMock ?? defaultPricingMock}
        />
      </Provider>,
    )
  }

  it('renders the grid component', () => {
    setup({})
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })
  it.each([
    t('pages.course-pricing.modal-cols-effective-from'),
    t('pages.course-pricing.modal-cols-effective-to'),
    t('pages.course-pricing.cols-price'),
  ])('renders %s grid column', column => {
    setup({})
    expect(screen.getByText(column)).toBeInTheDocument()
  })
  it('renders pricing details', async () => {
    const pricing = buildCoursePricing()
    setup({ pricingMock: pricing })
    const effectiveFromDate = format(
      new Date(pricing.pricingSchedules[0].effectiveFrom),
      'M/d/yyyy',
    )
    const effectiveTo = format(
      new Date(pricing.pricingSchedules[0].effectiveTo),
      'M/d/yyyy',
    )
    const priceWithCurrency = `${t('currency', {
      amount: pricing.priceAmount.toFixed(2),
    })}`
    expect(await screen.findByTitle(effectiveFromDate)).toBeInTheDocument()
    expect(await screen.findByTitle(effectiveTo)).toBeInTheDocument()
    expect(await screen.findByTitle(priceWithCurrency)).toBeInTheDocument()
  })
})
