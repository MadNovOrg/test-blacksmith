import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import useProfile from '@app/hooks/useProfile'
import useRoles from '@app/hooks/useRoles'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, renderHook, screen } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { EditProfilePage } from './EditProfile'

const useProfileMock = vi.mocked(useProfile)
vi.mock('@app/hooks/useProfile')

const useRolesMock = vi.mocked(useRoles)
vi.mock('@app/hooks/useRoles')

describe(EditProfilePage.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('should show profile roles with admins', async () => {
    useProfileMock.mockReturnValue({
      profile: {
        ...buildProfile(),
        courses: [],
        archived: false,
      },
      certifications: [],
      status: LoadingStatus.SUCCESS,
    } as unknown as ReturnType<typeof useProfile>)

    useRolesMock.mockReturnValue({
      roles: [],
      status: LoadingStatus.SUCCESS,
      error: undefined,
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <EditProfilePage />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    expect(screen.queryByText('Hub access')).toBeInTheDocument()
  })

  it('should not show profile roles with users', async () => {
    useProfileMock.mockReturnValue({
      profile: {
        ...buildProfile(),
        courses: [],
        archived: false,
      },
      certifications: [],
      status: LoadingStatus.SUCCESS,
    } as unknown as ReturnType<typeof useProfile>)

    useRolesMock.mockReturnValue({
      roles: [],
      status: LoadingStatus.SUCCESS,
      error: undefined,
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <EditProfilePage />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      }
    )

    expect(screen.queryByText('Hub access')).not.toBeInTheDocument()
  })
  it.each([t('first-name'), t('surname'), t('dob')])(
    'should disable %s field',
    field => {
      const client = {
        executeQuery: () => never,
      } as unknown as Client
      render(
        <Provider value={client}>
          <EditProfilePage />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.USER,
          },
        }
      )
      expect(screen.getByLabelText(field)).toHaveAttribute('disabled')
    }
  )
})
