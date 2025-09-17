import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  GetAnzDistinctCourseResidingCountriesQuery,
  GetAnzDistinctCourseVenueCountriesQuery,
  GetDistinctCourseResidingCountriesQuery,
  GetDistinctCourseVenueCountriesQuery,
} from '@app/generated/graphql'
import { AwsRegions } from '@app/types'

import { _render, screen, userEvent, waitFor } from '@test/index'

import {
  GET_ANZ_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
  GET_ANZ_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
  GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
  GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
} from './queries/get-distinct-course-countries'

import { FilterByCourseResidingCountry } from './index'

const executeQueryMock = vi.fn(({ query }: { query: TypedDocumentNode }) => {
  if (query === GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY) {
    return fromValue<{ data: GetDistinctCourseResidingCountriesQuery }>({
      data: {
        course: [
          { residingCountry: 'GB-ENG' },
          { residingCountry: 'RO' },
          { residingCountry: 'MD' },
        ],
      },
    })
  } else if (query === GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY) {
    return fromValue<{ data: GetDistinctCourseVenueCountriesQuery }>({
      data: {
        venue: [
          { countryCode: 'GB-ENG' },
          { countryCode: 'US' },
          { countryCode: 'GB-NIR' },
        ],
      },
    })
  } else if (query === GET_ANZ_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY) {
    return fromValue<{ data: GetAnzDistinctCourseResidingCountriesQuery }>({
      data: {
        course: [
          { residingCountry: 'AU' },
          { residingCountry: 'FJ' },
          { residingCountry: 'NZ' },
        ],
      },
    })
  } else if (query === GET_ANZ_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY) {
    return fromValue<{ data: GetAnzDistinctCourseVenueCountriesQuery }>({
      data: {
        venue: [
          { countryCode: 'AU' },
          { countryCode: 'FJ' },
          { countryCode: 'NZ' },
        ],
      },
    })
  }
})

const urqlMockClient = {
  executeQuery: executeQueryMock,
  executeMutation: () => vi.fn(),
  executeSubscription: () => vi.fn(),
} as unknown as Client

describe(FilterByCourseResidingCountry.name, () => {
  afterEach(() => {
    expect(executeQueryMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        query: expect.objectContaining({
          definitions: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                value: 'GetDistinctCourseResidingCountries',
              }),
            }),
          ]),
        }),
      }),
      expect.any(Object),
    )

    expect(executeQueryMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: expect.objectContaining({
          definitions: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                value: 'GetDistinctCourseVenueCountries',
              }),
            }),
          ]),
        }),
      }),
      expect.any(Object),
    )
  })
  it('Triggers onChange when residing country = England is selected', async () => {
    const onChange = vi.fn()
    _render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Residing Country')).toBeVisible()
    })

    await userEvent.click(screen.getByText('Residing Country'))
    await userEvent.click(screen.getByText('England'))

    expect(onChange).toHaveBeenCalledWith(['GB-ENG'])
  })

  it('Does not display duplicate countries', async () => {
    const onChange = vi.fn()
    _render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Residing Country')).toBeVisible()
    })
    await userEvent.click(screen.getByText('Residing Country'))

    expect(screen.getAllByText('England')).toHaveLength(1)
  })

  it('All countries should be visible in dropdown', async () => {
    const onChange = vi.fn()
    const countries = [
      'England',
      'Northern Ireland',
      'Romania',
      'Moldova, Republic of',
      'United States',
    ]
    _render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Residing Country')).toBeVisible()
    })
    await userEvent.click(screen.getByText('Residing Country'))

    countries.forEach(country => {
      expect(screen.getByText(country)).toBeInTheDocument()
    })
  })
})

describe(FilterByCourseResidingCountry.name, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })

  afterEach(() => {
    expect(executeQueryMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        query: expect.objectContaining({
          definitions: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                value: 'GetANZDistinctCourseResidingCountries',
              }),
            }),
          ]),
        }),
      }),
      expect.any(Object),
    )

    expect(executeQueryMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: expect.objectContaining({
          definitions: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                value: 'GetANZDistinctCourseVenueCountries',
              }),
            }),
          ]),
        }),
      }),
      expect.any(Object),
    )
  })

  it('All countries should be visible in dropdown', async () => {
    const onChange = vi.fn()
    const countries = ['Australia', 'Fiji', 'New Zealand']
    _render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Residing Country')).toBeVisible()
    })
    await userEvent.click(screen.getByText('Residing Country'))

    countries.forEach(country => {
      expect(screen.getByText(country)).toBeInTheDocument()
    })
  })
})
