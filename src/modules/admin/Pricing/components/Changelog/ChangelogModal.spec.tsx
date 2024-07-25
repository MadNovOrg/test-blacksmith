import { addDays } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import { Course_Pricing, PricingChangelogQuery } from '@app/generated/graphql'

import {
  chance,
  render,
  renderHook,
  screen,
  userEvent,
  within,
} from '@test/index'
import { buildSchedulePriceChangelog } from '@test/mock-data-utils'

import { GET_PRICING_CHANGELOG } from '../../queries'
import { formatChangelogDate } from '../../utils'

import { ChangelogModal } from './ChangelogModal'

describe(ChangelogModal.name, () => {
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

  it('should close modal on Close button click', async () => {
    setup()
    await userEvent.click(
      screen.getByRole('button', { name: t('common.close-modal') }),
    )
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('display change price changelog', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PRICING_CHANGELOG) {
          return fromValue<{ data: PricingChangelogQuery }>({
            data: {
              course_pricing_changelog: [
                buildSchedulePriceChangelog({
                  author,
                  courseSchedulePrice: {
                    effectiveFrom: addDays(Date.now(), 1),
                    effectiveTo: addDays(Date.now(), 2),
                  },
                  oldPrice: 100,
                  newPrice: 101,
                }),
              ],
              course_pricing_changelog_aggregate: { aggregate: { count: 1 } },
            },
          })
        }
      },
    } as unknown as Client

    setup(client, { id: chance.guid() } as Course_Pricing)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(4)

    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody.children).toHaveLength(1)

    expect(
      within(tableBody).getByText(
        t('pages.course-pricing.modal-changelog-update-price-event', {
          oldPrice: t('currency', {
            amount: 100,
            currency: 'GBP',
          }),
          newPrice: t('currency', {
            amount: 101,
            currency: 'GBP',
          }),
        }),
      ),
    ).toBeInTheDocument()

    expect(within(tableBody).getByText(author.fullName)).toBeInTheDocument()
  })

  it('display change effective to changelog', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PRICING_CHANGELOG) {
          return fromValue<{ data: PricingChangelogQuery }>({
            data: {
              course_pricing_changelog: [
                buildSchedulePriceChangelog({
                  author,
                  courseSchedulePrice: {
                    effectiveFrom: addDays(Date.now(), 1),
                    effectiveTo: addDays(Date.now(), 2),
                  },
                  oldEffectiveTo: addDays(Date.now(), 1),
                  newEffectiveTo: addDays(Date.now(), 2),
                }),
              ],
              course_pricing_changelog_aggregate: { aggregate: { count: 1 } },
            },
          })
        }
      },
    } as unknown as Client

    setup(client, { id: chance.guid() } as Course_Pricing)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(4)

    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody.children).toHaveLength(1)

    expect(
      within(tableBody).getByText(
        t('pages.course-pricing.modal-changelog-update-effective-to-event', {
          newDate: formatChangelogDate(addDays(Date.now(), 2)),
          oldDate: formatChangelogDate(addDays(Date.now(), 1)),
        }),
      ),
    ).toBeInTheDocument()

    expect(within(tableBody).getByText(author.fullName)).toBeInTheDocument()
  })

  it('display change effective from changelog', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: PricingChangelogQuery }>({
          data: {
            course_pricing_changelog: [
              buildSchedulePriceChangelog({
                author,
                courseSchedulePrice: {
                  effectiveFrom: addDays(Date.now(), 1),
                  effectiveTo: addDays(Date.now(), 2),
                },
                oldEffectiveTo: addDays(Date.now(), 1),
                newEffectiveTo: addDays(Date.now(), 2),
              }),
            ],
            course_pricing_changelog_aggregate: { aggregate: { count: 1 } },
          },
        }),
    } as unknown as Client

    setup(client, { id: chance.guid() } as Course_Pricing)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(4)

    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody.children).toHaveLength(1)

    expect(
      within(tableBody).getByText(
        t('pages.course-pricing.modal-changelog-update-effective-to-event', {
          newDate: formatChangelogDate(addDays(Date.now(), 2)),
          oldDate: formatChangelogDate(addDays(Date.now(), 1)),
        }),
      ),
    ).toBeInTheDocument()
  })

  it('display multiple changelogs', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PRICING_CHANGELOG) {
          return fromValue<{ data: PricingChangelogQuery }>({
            data: {
              course_pricing_changelog: [
                buildSchedulePriceChangelog({
                  author,
                  courseSchedulePrice: {
                    effectiveFrom: addDays(Date.now(), 1),
                    effectiveTo: addDays(Date.now(), 2),
                  },
                  oldEffectiveTo: addDays(Date.now(), 1),
                  newEffectiveTo: addDays(Date.now(), 2),
                  oldPrice: 100,
                  newPrice: 101,
                }),
              ],
              course_pricing_changelog_aggregate: { aggregate: { count: 1 } },
            },
          })
        }
      },
    } as unknown as Client

    setup(client, { id: chance.guid() } as Course_Pricing)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(4)

    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody.children).toHaveLength(1)

    const tableBodyFirstRow = tableBody.firstChild
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-to-event', {
        newDate: formatChangelogDate(addDays(Date.now(), 2)),
        oldDate: formatChangelogDate(addDays(Date.now(), 1)),
      }),
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-price-event', {
        oldPrice: t('currency', {
          amount: 100,
          currency: 'GBP',
        }),
        newPrice: t('currency', {
          amount: 101,
          currency: 'GBP',
        }),
      }),
    )
  })
})
