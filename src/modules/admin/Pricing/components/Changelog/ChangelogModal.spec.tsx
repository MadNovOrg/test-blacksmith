import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { Course_Pricing, PricingChangelogQuery } from '@app/generated/graphql'
import { Currency } from '@app/types'

import { chance, render, renderHook, screen, userEvent } from '@test/index'
import { buildPricing } from '@test/mock-data-utils'

import { ChangelogModal } from './ChangelogModal'

describe(ChangelogModal.name, () => {
  const pricingChangelog = {
    course_pricing_changelog: [buildPricing()],
    course_pricing_changelog_aggregate: { aggregate: { count: 1 } },
  }
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const onCloseMock = vi.fn()
  const coursePricingMock = {} as Course_Pricing
  const clientMock = {
    executeQuery: vi.fn(() => never),
  } as unknown as Client
  const setup = (client = clientMock, coursePricing = coursePricingMock) => {
    return render(
      <Provider value={client}>
        <ChangelogModal onClose={onCloseMock} coursePricing={coursePricing} />
      </Provider>,
    )
  }
  it('should render the component', () => {
    setup()
    expect(
      screen.getByText(t('pages.course-pricing.modal-changelog-title')),
    ).toBeInTheDocument()
  })
  it('should render history results', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: PricingChangelogQuery }>({
          data: pricingChangelog,
        }),
    } as unknown as Client

    setup(client, { id: chance.guid() } as Course_Pricing)

    expect(
      screen.queryByText(
        String(pricingChangelog.course_pricing_changelog[0].author?.fullName),
      ),
    ).toBeInTheDocument()
  })

  it('should show relevant history data', () => {
    const changelog = pricingChangelog.course_pricing_changelog[0]
    const priceCurrency = Currency.GBP
    const client = {
      executeQuery: () =>
        fromValue<{ data: PricingChangelogQuery }>({
          data: pricingChangelog,
        }),
    } as unknown as Client

    setup(client, { id: chance.guid(), priceCurrency } as Course_Pricing)

    expect(
      screen.queryByText(
        t('pages.course-pricing.modal-changelog-event', {
          oldPrice: t('currency', {
            amount: changelog.oldPrice,
            currency: priceCurrency,
          }),
          newPrice: t('currency', {
            amount: changelog.newPrice,
            currency: priceCurrency,
          }),
        }),
      ),
    ).toBeInTheDocument()
  })
  it('should close modal on Close button click', async () => {
    setup()
    await userEvent.click(
      screen.getByRole('button', { name: t('common.close-modal') }),
    )
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
