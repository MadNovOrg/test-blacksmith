import { addDays, format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Pricing,
  Currency,
  PricingChangelogQuery,
} from '@app/generated/graphql'

import {
  chance,
  _render,
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
    return _render(
      <Provider value={client}>
        <ChangelogModal onClose={onCloseMock} coursePricing={coursePricing} />
      </Provider>,
    )
  }
  it('should _render the component', () => {
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

  it('display change effective to date to indefinite changelogs', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const oldEffectiveFrom = addDays(Date.now(), 1)
    const oldEffectiveTo = addDays(Date.now(), 2)

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
                  oldEffectiveFrom: oldEffectiveFrom,
                  oldEffectiveTo: oldEffectiveTo,
                  newEffectiveTo: null,
                  indefiniteEffectiveTo: true,
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
      `${format(new Date(oldEffectiveFrom), 'dd MMMM yyyy')} - ${format(
        oldEffectiveTo,
        'dd MMMM yyyy',
      )}`,
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-to-event', {
        newDate: t('pages.course-pricing.indefinite'),
        oldDate: formatChangelogDate(oldEffectiveTo),
      }),
    )
  })

  it('display change effective to date from indefinite changelogs', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const oldEffectiveFrom = addDays(Date.now(), 1)

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
                  oldEffectiveFrom: oldEffectiveFrom,
                  oldEffectiveTo: null,
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

    const tableBodyFirstRow = tableBody.firstChild
    expect(tableBodyFirstRow).toContainHTML(
      `${format(new Date(oldEffectiveFrom), 'dd MMMM yyyy')} - ${t(
        'pages.course-pricing.indefinite',
      )}`,
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-to-event', {
        newDate: formatChangelogDate(addDays(Date.now(), 2)),
        oldDate: t('pages.course-pricing.indefinite'),
      }),
    )
  })

  it('display all possible changelogs at once with indefinite effective to date', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const oldEffectiveFrom = addDays(Date.now(), 1)
    const newEffectiveFrom = addDays(Date.now(), 2)
    const oldEffectiveTo = addDays(Date.now(), 3)

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
                  oldEffectiveFrom,
                  newEffectiveFrom,
                  oldEffectiveTo,
                  newEffectiveTo: null,
                  indefiniteEffectiveTo: true,
                  oldPrice: 100,
                  newPrice: 101,
                }),
              ],
              course_pricing_changelog_aggregate: { aggregate: { count: 3 } },
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
      `${format(new Date(oldEffectiveFrom), 'dd MMMM yyyy')} - ${format(
        oldEffectiveTo,
        'dd MMMM yyyy',
      )}`,
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-from-event', {
        newDate: formatChangelogDate(newEffectiveFrom),
        oldDate: formatChangelogDate(oldEffectiveFrom),
      }),
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-to-event', {
        newDate: t('pages.course-pricing.indefinite'),
        oldDate: formatChangelogDate(oldEffectiveTo),
      }),
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-price-event', {
        newPrice: t('currency', {
          amount: 101,
          currency: 'GBP',
        }),
        oldPrice: t('currency', {
          amount: 100,
          currency: 'GBP',
        }),
      }),
    )
  })

  it('display all possible changelogs at once with indefinite effective to old date', () => {
    const author = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    const oldEffectiveFrom = addDays(Date.now(), 1)
    const newEffectiveFrom = addDays(Date.now(), 2)
    const newEffectiveTo = addDays(Date.now(), 3)

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
                  oldEffectiveFrom,
                  newEffectiveFrom,
                  oldEffectiveTo: null,
                  newEffectiveTo,
                  oldPrice: 100,
                  newPrice: 101,
                }),
              ],
              course_pricing_changelog_aggregate: { aggregate: { count: 3 } },
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
      `${format(new Date(oldEffectiveFrom), 'dd MMMM yyyy')} - ${t(
        'pages.course-pricing.indefinite',
      )}`,
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-from-event', {
        newDate: formatChangelogDate(newEffectiveFrom),
        oldDate: formatChangelogDate(oldEffectiveFrom),
      }),
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-effective-to-event', {
        newDate: formatChangelogDate(newEffectiveTo),
        oldDate: t('pages.course-pricing.indefinite'),
      }),
    )
    expect(tableBodyFirstRow).toContainHTML(
      t('pages.course-pricing.modal-changelog-update-price-event', {
        newPrice: t('currency', {
          amount: 101,
          currency: 'GBP',
        }),
        oldPrice: t('currency', {
          amount: 100,
          currency: 'GBP',
        }),
      }),
    )
  })

  it('display no dates for historical logs with no schedule price linked', () => {
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
                  courseSchedulePrice: null,
                  oldEffectiveFrom: null,
                  newEffectiveFrom: null,
                  oldEffectiveTo: null,
                  newEffectiveTo: null,
                  oldPrice: 100,
                  newPrice: 101,
                }),
              ],
              course_pricing_changelog_aggregate: { aggregate: { count: 3 } },
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

    expect(tableBodyFirstRow).toContainHTML('-')
  })
})

describe(`${ChangelogModal.name} Australia`, () => {
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
    return _render(
      <Provider value={client}>
        <ChangelogModal onClose={onCloseMock} coursePricing={coursePricing} />
      </Provider>,
    )
  }

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
                  coursePricing: {
                    priceCurrency: Currency.Aud,
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
          oldPrice: 'A$100.00',
          newPrice: 'A$101.00',
        }),
      ),
    ).toBeInTheDocument()

    expect(within(tableBody).getByText(author.fullName)).toBeInTheDocument()
  })
})
