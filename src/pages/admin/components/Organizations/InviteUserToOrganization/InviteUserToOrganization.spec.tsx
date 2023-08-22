import { matches } from 'lodash-es'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { never, fromValue } from 'wonka'

import {
  SaveOrgInvitesMutation,
  SaveOrgInvitesMutationVariables,
} from '@app/generated/graphql'
import { useOrganizations } from '@app/hooks/useOrganizations'
import { SAVE_ORG_INVITES_MUTATION } from '@app/queries/invites/save-org-invites'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { OrgDashboardTabs } from '../OrgDashboard'
import { OrgIndividualsSubtabs } from '../tabs/OrgIndividualsTab'

import { InviteUserToOrganization } from './InviteUserToOrganization'

jest.mock('@app/hooks/useOrganizations', () => ({
  useOrganizations: jest.fn(),
}))

const useOrganizationsMock = jest.mocked(useOrganizations)

it('validates that at least one email has been entered', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  useOrganizationsMock.mockReturnValue({
    loading: false,
    orgs: [],
    status: LoadingStatus.SUCCESS,
    mutate: jest.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <InviteUserToOrganization />
    </Provider>
  )

  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByText(/work email is required/i)).toBeInTheDocument()
})

it('validates that entered email is valid', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  useOrganizationsMock.mockReturnValue({
    loading: false,
    orgs: [],
    status: LoadingStatus.SUCCESS,
    mutate: jest.fn(),
    error: undefined,
  })

  render(
    <Provider value={client}>
      <InviteUserToOrganization />
    </Provider>
  )

  await userEvent.type(screen.getByLabelText(/work email/i), 'email@email.com ')

  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(
    screen.getByText(/please enter a valid email address/i)
  ).toBeInTheDocument()
})

it('displays an error message that user already exist within organization', async () => {
  const orgId = chance.guid()

  const client = {
    executeMutation: () =>
      fromValue({
        error: new CombinedError({
          graphQLErrors: [new Error('organization_invites_org_id_email_key')],
        }),
      }),
  } as unknown as Client

  useOrganizationsMock.mockReturnValue({
    loading: false,
    orgs: [buildOrganization({ overrides: { id: orgId } })],
    status: LoadingStatus.SUCCESS,
    mutate: jest.fn(),
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
    { initialEntries: [`/organisations/${orgId}/invite`] }
  )

  await userEvent.type(screen.getByLabelText(/work email/i), 'email@email.com')
  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByTestId('error-alert').textContent).toMatchInlineSnapshot(
    `"User with provided email address has already been invited to this organisation."`
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
      variables: SaveOrgInvitesMutationVariables
    }) => {
      const mutationMatches = matches({
        query: SAVE_ORG_INVITES_MUTATION,
        variables: {
          invites: [
            {
              email: userEmail,
              orgId,
              isAdmin: true,
            },
          ],
        },
      })

      if (mutationMatches({ query, variables })) {
        return fromValue<{ data: SaveOrgInvitesMutation }>({
          data: {
            insert_organization_invites: {
              returning: [{ id: chance.guid() }],
            },
          },
        })
      }

      return never
    },
  } as unknown as Client

  useOrganizationsMock.mockReturnValue({
    loading: false,
    orgs: [buildOrganization({ overrides: { id: orgId } })],
    status: LoadingStatus.SUCCESS,
    mutate: jest.fn(),
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
    { initialEntries: [`/organisations/${orgId}/invite`] }
  )

  await userEvent.type(screen.getByLabelText(/work email/i), userEmail)
  await userEvent.click(
    screen.getByLabelText(/organisation admin/i, { exact: false })
  )
  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByText(/org individuals/i)).toBeInTheDocument()
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
