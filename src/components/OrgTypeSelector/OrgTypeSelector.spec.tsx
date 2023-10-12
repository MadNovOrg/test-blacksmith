import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrgTypesQuery } from '@app/generated/graphql'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildOrgType } from '@test/mock-data-utils'

import { OrgTypeSelector } from './OrgTypeSelector'

const orgType = buildOrgType()

const urqlMockClient = {
  executeQuery: () => fromValue<{ data: GetOrgTypesQuery }>({ data: orgType }),
  executeMutation: () => vi.fn(),
  executeSubscription: () => vi.fn(),
} as unknown as Client

describe(OrgTypeSelector.name, () => {
  it("doesn't display options initially", async () => {
    render(
      <Provider value={urqlMockClient}>
        <OrgTypeSelector value={''} disabled={false} sector="edu" />
      </Provider>
    )

    await waitFor(() => {
      userEvent.click(screen.getByRole('button'))
    })

    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('loads options', async () => {
    render(
      <Provider value={urqlMockClient}>
        <OrgTypeSelector value={''} disabled={false} sector="edu" />
      </Provider>
    )
    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByRole('option')).toBeInTheDocument()
    orgType.organization_type.map(org =>
      expect(screen.getByText(org.name)).toBeInTheDocument()
    )
  })
})
