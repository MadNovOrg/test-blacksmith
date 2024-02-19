import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  GetDistinctCourseResidingCountriesQuery,
  GetDistinctCourseVenueCountriesQuery,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor } from '@test/index'

import {
  GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
  GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
} from './queries/get-distinct-course-countries'

import { FilterByCourseResidingCountry } from './index'

const urqlMockClient = {
  executeQuery: ({ query }: { query: TypedDocumentNode }) => {
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
    }
  },

  executeMutation: () => vi.fn(),
  executeSubscription: () => vi.fn(),
} as unknown as Client

describe(FilterByCourseResidingCountry.name, () => {
  it('Triggers onChange when residing country = England is selected', async () => {
    const onChange = vi.fn()
    render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>
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
    render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>
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
    render(
      <Provider value={urqlMockClient}>
        <FilterByCourseResidingCountry onChange={onChange} />
      </Provider>
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
