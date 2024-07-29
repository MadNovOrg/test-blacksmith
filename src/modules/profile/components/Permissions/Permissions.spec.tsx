import { renderHook } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import { GetUserKnowledgeHubAccessQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen } from '@test/index'

import { useUpdateProfileAccess } from '../../hooks/useUpdateProfileAccess'
import { GET_USER_KNOWLEDGE_HUB_ACCESS } from '../../queries/get-user-knowledge-hub-access'

import { ProfilePermissions } from './Permissions'

vi.mock('../../hooks/useUpdateProfileAccess')

const updateProfileAccessMock = vi.fn()

vi.mocked(useUpdateProfileAccess).mockReturnValue([
  { fetching: false, stale: false },
  updateProfileAccessMock,
])

describe(ProfilePermissions.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('disable access to Knowledge Hub switch if user has no organizations with access', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_USER_KNOWLEDGE_HUB_ACCESS) {
          return fromValue<{ data: GetUserKnowledgeHubAccessQuery }>({
            data: {
              organization_member_aggregate: {
                aggregate: {
                  count: 0,
                },
              },
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ProfilePermissions
          checked={false}
          onChange={vi.fn()}
          profileId={chance.guid()}
        />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    const accessSwitch = screen
      .getByTestId('knowledge-hub-access-switch')
      .querySelector('input')

    expect(accessSwitch).toBeDisabled()
    expect(
      screen.getByText(t('pages.my-profile.knowledge-hub-access-warning')),
    ).toBeInTheDocument()
  })

  it('enable switch access to Knowledge Hub switch if user at least one organization with access', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_USER_KNOWLEDGE_HUB_ACCESS) {
          return fromValue<{ data: GetUserKnowledgeHubAccessQuery }>({
            data: {
              organization_member_aggregate: {
                aggregate: {
                  count: 1,
                },
              },
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ProfilePermissions
          checked={false}
          onChange={vi.fn()}
          profileId={chance.guid()}
        />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    const accessSwitch = screen
      .getByTestId('knowledge-hub-access-switch')
      .querySelector('input')

    expect(accessSwitch).toBeEnabled()
    expect(
      screen.queryByText(t('pages.my-profile.knowledge-hub-access-warning')),
    ).not.toBeInTheDocument()
  })
})
