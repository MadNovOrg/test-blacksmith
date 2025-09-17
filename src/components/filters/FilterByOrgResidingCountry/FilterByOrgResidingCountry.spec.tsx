import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import { GetDistinctOrgResidingCountriesQuery } from '@app/generated/graphql'

import { _render, screen, userEvent, waitFor } from '@test/index'

import { GET_DISTINCT_ORG_RESIDING_COUNTRIES_QUERY } from './queries/get-distinct-org-countries'

import { FilterByOrgResidingCountry } from './index'

const urqlMockClient = {
  executeQuery: ({ query }: { query: TypedDocumentNode }) => {
    if (query === GET_DISTINCT_ORG_RESIDING_COUNTRIES_QUERY) {
      return fromValue<{ data: GetDistinctOrgResidingCountriesQuery }>({
        data: {
          org_distinct_country_codes: [
            { countrycode: 'GB-ENG' },
            { countrycode: 'RO' },
            { countrycode: 'MD' },
          ],
        },
      })
    }
  },

  executeMutation: () => vi.fn(),
  executeSubscription: () => vi.fn(),
} as unknown as Client

describe(FilterByOrgResidingCountry.name, () => {
  it('Triggers onChange when residing country = England is selected', async () => {
    const onChange = vi.fn()
    _render(
      <Provider value={urqlMockClient}>
        <FilterByOrgResidingCountry onChange={onChange} />
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
        <FilterByOrgResidingCountry onChange={onChange} />
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
    const countries = ['England', 'Romania', 'Moldova, Republic of']
    _render(
      <Provider value={urqlMockClient}>
        <FilterByOrgResidingCountry onChange={onChange} />
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
