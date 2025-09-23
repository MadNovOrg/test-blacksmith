import React from 'react'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import useProfile from '@app/modules/profile/hooks/useProfile/useProfile'
import { ViewProfilePage } from '@app/modules/profile/pages/ViewProfile/ANZ'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { _render, screen } from '@test/index'
import { buildCertificate, buildProfile } from '@test/mock-data-utils'

vi.mock('@app/modules/profile/hooks/useProfile/useProfile')

const useProfileMock = vi.mocked(useProfile)
describe('page: ViewProfile', () => {
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

      _render(
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

      _render(
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

      _render(
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

      _render(
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
