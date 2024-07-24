import { Client, TypedDocumentNode, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrganisationPermissionsQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent } from '@test/index'

import { GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB } from '../../hooks/useOrganisationPermissions'

import { OrgPermissionsTab } from './OrgPermissionsTab'

const useUpdateOrganisationPermissionsMock = vi.fn()

vi.mock('../../hooks/useOrganisationPermissions', async () => ({
  ...(await vi.importActual('../../hooks/useOrganisationPermissions')),
  useUpdateOrganisationPermissions: () => [
    { fetching: false, stale: false },
    useUpdateOrganisationPermissionsMock,
  ],
}))

describe(OrgPermissionsTab.name, () => {
  it("Knowledge Hub access switch must be unchecked if organization doesn't has access", () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB) {
          return fromValue<{ data: GetOrganisationPermissionsQuery }>({
            data: {
              organization_by_pk: {
                canAccessKnowledgeHub: false,
              },
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgPermissionsTab orgId={chance.guid()} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    const accessSwitch = screen
      .getByTestId('org-knowledge-hub-access-switch')
      .querySelector('input')

    expect(accessSwitch).not.toBeChecked()
  })

  it('Knowledge Hub access switch must be checked if organization has access', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB) {
          return fromValue<{ data: GetOrganisationPermissionsQuery }>({
            data: {
              organization_by_pk: {
                canAccessKnowledgeHub: true,
              },
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgPermissionsTab orgId={chance.guid()} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    const accessSwitch = screen
      .getByTestId('org-knowledge-hub-access-switch')
      .querySelector('input')

    expect(accessSwitch).toBeChecked()
  })

  it('updates access value to false on switch click if organization has access to Knowledge Hub', async () => {
    const orgId = chance.guid()

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB) {
          return fromValue<{ data: GetOrganisationPermissionsQuery }>({
            data: {
              organization_by_pk: {
                canAccessKnowledgeHub: true,
              },
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgPermissionsTab orgId={orgId} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    const accessSwitch = screen.getByTestId('org-knowledge-hub-access-switch')

    await userEvent.click(accessSwitch)

    expect(useUpdateOrganisationPermissionsMock).toHaveBeenCalledTimes(1)
    expect(useUpdateOrganisationPermissionsMock).toHaveBeenCalledWith({
      canAccessKnowledgeHub: false,
      orgId,
    })
  })

  it('updates access value to true on switch click if organization has no access to Knowledge Hub', async () => {
    const orgId = chance.guid()

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB) {
          return fromValue<{ data: GetOrganisationPermissionsQuery }>({
            data: {
              organization_by_pk: {
                canAccessKnowledgeHub: false,
              },
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgPermissionsTab orgId={orgId} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    const accessSwitch = screen.getByTestId('org-knowledge-hub-access-switch')

    await userEvent.click(accessSwitch)

    expect(useUpdateOrganisationPermissionsMock).toHaveBeenCalledTimes(1)
    expect(useUpdateOrganisationPermissionsMock).toHaveBeenCalledWith({
      canAccessKnowledgeHub: true,
      orgId,
    })
  })
})
