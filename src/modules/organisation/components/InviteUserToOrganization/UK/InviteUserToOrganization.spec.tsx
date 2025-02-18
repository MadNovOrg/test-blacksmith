import { matches } from 'lodash-es'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { never, fromValue } from 'wonka'

import {
  GetOrganisationDetailsQuery,
  SaveOrganisationInvitesMutation,
  SaveOrganisationInvitesMutationVariables,
  SaveOrgInviteError,
} from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
import { OrgDashboardTabs } from '@app/modules/organisation/pages/OrganisationDashboard/components/Tabs'
import { SAVE_ORGANISATION_INVITES_MUTATION } from '@app/modules/organisation/queries/save-org-invites'
import { OrgIndividualsSubtabs } from '@app/modules/organisation/tabs/OrgIndividualsTab'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { InviteUserToOrganization } from './InviteUserToOrganization'

vi.mock('@app/modules/organisation/hooks/UK/useOrgV2')

const useOrganisationMock = vi.mocked(useOrgV2)

it('validates that at least one email has been entered', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  useOrganisationMock.mockReturnValue({
    fetching: false,
    data: { orgs: [], orgsCount: { aggregate: { count: 0 } }, specificOrg: [] },
    reexecute: vi.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <InviteUserToOrganization />
    </Provider>,
  )

  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByText(/work email is required/i)).toBeInTheDocument()
})

it('validates that entered email is valid', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  useOrganisationMock.mockReturnValue({
    fetching: false,
    data: { orgs: [], orgsCount: { aggregate: { count: 1 } }, specificOrg: [] },
    reexecute: vi.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <InviteUserToOrganization />
    </Provider>,
  )

  await userEvent.type(
    screen.getByLabelText(/work email/i),
    '@email@email.com ',
  )

  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(
    screen.getByText(/please enter a valid email address/i),
  ).toBeInTheDocument()
})

it('displays an error message that user already exist within organization', async () => {
  const orgId = chance.guid()

  const client = {
    executeMutation: () =>
      fromValue({
        error: new CombinedError({
          graphQLErrors: [new Error(SaveOrgInviteError.OrgMemberAlreadyExists)],
        }),
      }),
  } as unknown as Client

  useOrganisationMock.mockReturnValue({
    fetching: false,
    data: {
      orgs: [
        buildOrganization({ overrides: { id: orgId } }),
      ] as unknown as GetOrganisationDetailsQuery['orgs'],
      orgsCount: { aggregate: { count: 1 } },
      specificOrg: [],
    },
    reexecute: vi.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <Routes>
        <Route
          path="organisations/:id/invite"
          element={<InviteUserToOrganization />}
        />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/organisations/${orgId}/invite`] },
  )

  await userEvent.type(screen.getByLabelText(/work email/i), 'email@email.com')
  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByTestId('error-alert').textContent).toMatchInlineSnapshot(
    '"A user with this email address already exists within this organisation."',
  )
})

it('saves org invites and redirects back to the organization individuals tab', async () => {
  const orgId = chance.guid()
  const userEmail = chance.email()

  const client = {
    executeMutation: ({
      query,
      variables,
    }: {
      query: TypedDocumentNode
      variables: SaveOrganisationInvitesMutationVariables
    }) => {
      const mutationMatches = matches({
        query: SAVE_ORGANISATION_INVITES_MUTATION,
        variables: {
          invites: [
            {
              profileEmail: userEmail,
              orgId,
              isAdmin: true,
            },
          ],
        },
      })

      if (mutationMatches({ query, variables })) {
        return fromValue<{ data: SaveOrganisationInvitesMutation }>({
          data: {
            saveOrgInvites: { success: true },
          },
        })
      }

      return never
    },
  } as unknown as Client

  useOrganisationMock.mockReturnValue({
    fetching: false,
    data: {
      orgs: [
        buildOrganization({ overrides: { id: orgId } }),
      ] as unknown as GetOrganisationDetailsQuery['orgs'],
      orgsCount: { aggregate: { count: 1 } },
      specificOrg: [],
    },
    reexecute: vi.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <Routes>
        <Route path="organisations/:id">
          <Route index element={<IndividualsTabMock />} />
          <Route path="invite" element={<InviteUserToOrganization />} />
        </Route>
      </Routes>
    </Provider>,
    { auth: { activeRole: RoleName.TT_ADMIN } },
    { initialEntries: [`/organisations/${orgId}/invite`] },
  )

  await userEvent.type(screen.getByLabelText(/work email/i), userEmail)
  await userEvent.click(
    screen.getByLabelText(/organisation admin/i, { exact: false }),
  )
  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByText(/org individuals/i)).toBeInTheDocument()
})

it('allows an org admin to invite another org admin', async () => {
  const orgId = chance.guid()

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  useOrganisationMock.mockReturnValue({
    fetching: false,
    data: {
      orgs: [
        buildOrganization({
          overrides: { id: orgId },
        }),
      ] as unknown as GetOrganisationDetailsQuery['orgs'],
      orgsCount: { aggregate: { count: 1 } },
      specificOrg: [],
    },
    reexecute: vi.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <Routes>
        <Route path="organisations/:id">
          <Route path="invite" element={<InviteUserToOrganization />} />
        </Route>
      </Routes>
    </Provider>,
    {
      auth: {
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [orgId],
      },
    },
    { initialEntries: [`/organisations/${orgId}/invite`] },
  )

  expect(
    screen.getByLabelText(/organisation admin/i, { exact: false }),
  ).toBeInTheDocument()
})

function IndividualsTabMock() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const subtab = searchParams.get('subtab')

  return tab === OrgDashboardTabs.INDIVIDUALS &&
    subtab === OrgIndividualsSubtabs.INVITES ? (
    <p>org individuals</p>
  ) : null
}
