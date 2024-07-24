import React from 'react'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import { GetUserKnowledgeHubAccessQuery } from '@app/generated/graphql'
import useProfile from '@app/modules/profile/hooks/useProfile'
import { ViewProfilePage } from '@app/modules/profile/pages/ViewProfile'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCertificate, buildProfile } from '@test/mock-data-utils'

import { GET_USER_KNOWLEDGE_HUB_ACCESS } from '../../queries/get-user-knowledge-hub-access'

vi.mock('@app/modules/profile/hooks/useProfile')
const useProfileMock = vi.mocked(useProfile)
describe('page: ViewProfile', () => {
  it.each([RoleName.FINANCE, RoleName.TT_ADMIN, RoleName.TT_OPS])(
    'should display switch for access to Knowledge Hub for %s role',
    async role => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: false,
        },
        certifications: [],
        status: LoadingStatus.SUCCESS,
      } as unknown as ReturnType<typeof useProfile>)

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
          <ViewProfilePage />
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
        status: LoadingStatus.SUCCESS,
      } as unknown as ReturnType<typeof useProfile>)

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
          <ViewProfilePage />
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

  describe('delete profile', () => {
    it('should show delete button when profile is not archived', async () => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: false,
        },
        certifications: [],
        status: LoadingStatus.SUCCESS,
      } as unknown as ReturnType<typeof useProfile>)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <ViewProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
          },
        },
      )

      expect(screen.queryByTestId('delete-profile-button')).toBeInTheDocument()
    })

    it('should not show delete button when profile is archived', async () => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: true,
        },
        certifications: [],
        status: LoadingStatus.SUCCESS,
      } as unknown as ReturnType<typeof useProfile>)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <ViewProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
          },
        },
      )

      expect(screen.queryByTestId('delete-profile-button')).toBeNull()
    })

    it('should not show delete button when role not allowed', async () => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: false,
        },
        certifications: [],
        status: LoadingStatus.SUCCESS,
      } as unknown as ReturnType<typeof useProfile>)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <ViewProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TRAINER,
          },
        },
      )

      expect(screen.queryByTestId('delete-profile-button')).toBeNull()
    })

    it('should not show delete button when user has at least one certificate', async () => {
      useProfileMock.mockReturnValue({
        profile: {
          ...buildProfile(),
          courses: [],
          archived: false,
        },
        certifications: [buildCertificate()],
        status: LoadingStatus.SUCCESS,
      } as unknown as ReturnType<typeof useProfile>)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <ViewProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TRAINER,
          },
        },
      )

      expect(screen.queryByTestId('delete-profile-button')).toBeNull()
    })
  })
})
