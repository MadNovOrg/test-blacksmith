import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import { GetUserKnowledgeHubAccessQuery } from '@app/generated/graphql'
import useProfile from '@app/modules/profile/hooks/useProfile/useProfile'
import useRoles from '@app/modules/profile/hooks/useRoles'
import { GET_USER_KNOWLEDGE_HUB_ACCESS } from '@app/modules/profile/queries/get-user-knowledge-hub-access'
import { RoleName } from '@app/types'

import { _render, renderHook, screen } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { EditProfilePage } from './EditProfile'

const useProfileMock = vi.mocked(useProfile)
vi.mock('@app/modules/profile/hooks/useProfile/useProfile')

const useRolesMock = vi.mocked(useRoles)
vi.mock('@app/modules/profile/hooks/useRoles')

describe(EditProfilePage.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it.each([RoleName.TT_ADMIN, RoleName.TT_OPS])(
    'should display switch for access to Knowledge Hub for %s role',
    async role => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: false,
        },
        certifications: [],
      } as unknown as ReturnType<typeof useProfile>)

      useRolesMock.mockReturnValue({
        roles: [],
        fetching: false,
        error: undefined,
      })

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

      _render(
        <Provider value={client}>
          <EditProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: role,
          },
        },
      )

      expect(
        screen.queryByTestId('knowledge-hub-access-switch'),
      ).toBeInTheDocument()
    },
  )

  it.each([
    RoleName.BOOKING_CONTACT,
    RoleName.ORGANIZATION_KEY_CONTACT,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
    RoleName.TRAINER,
    RoleName.USER,
  ])(
    'should not display switch for access to Knowledge Hub for %s role',
    async role => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: false,
        },
        certifications: [],
      } as unknown as ReturnType<typeof useProfile>)

      useRolesMock.mockReturnValue({
        roles: [],
        fetching: false,
        error: undefined,
      })

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

      _render(
        <Provider value={client}>
          <EditProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: role,
          },
        },
      )

      expect(
        screen.queryByTestId('knowledge-hub-access-switch'),
      ).not.toBeInTheDocument()
    },
  )
  it('should show profile roles with admins', async () => {
    useProfileMock.mockReturnValue({
      profile: {
        ...buildProfile(),
        courses: [],
        archived: false,
      },
      certifications: [],
    } as unknown as ReturnType<typeof useProfile>)

    useRolesMock.mockReturnValue({
      roles: [],
      fetching: false,
      error: undefined,
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <EditProfilePage />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )

    expect(screen.queryByText('Connect access')).toBeInTheDocument()
  })

  it('should not show profile roles with users', async () => {
    useProfileMock.mockReturnValue({
      profile: {
        ...buildProfile(),
        courses: [],
        archived: false,
      },
      certifications: [],
    } as unknown as ReturnType<typeof useProfile>)

    useRolesMock.mockReturnValue({
      roles: [],
      error: undefined,
      fetching: false,
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <EditProfilePage />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      },
    )

    expect(screen.queryByText('Connect access')).not.toBeInTheDocument()
  })
  it.each([t('first-name'), t('surname'), t('dob')])(
    'should disable %s field',
    field => {
      const client = {
        executeQuery: () => never,
      } as unknown as Client
      _render(
        <Provider value={client}>
          <EditProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.USER,
          },
        },
      )
      expect(screen.getByLabelText(field)).toHaveAttribute('disabled')
    },
  )
  it.each([RoleName.SALES_ADMIN, RoleName.TT_OPS])(
    'should allow %s to remove user from organisation',
    activeRole => {
      const client = {
        executeQuery: () => never,
      } as unknown as Client
      _render(
        <Provider value={client}>
          <EditProfilePage />
        </Provider>,
        {
          auth: {
            activeRole,
          },
        },
      )
      const removeUserFromOrgButton = screen.getByText(t('common.leave'))
      expect(removeUserFromOrgButton).toBeInTheDocument()
      expect(removeUserFromOrgButton).not.toHaveAttribute('disabled')
    },
  )
})
