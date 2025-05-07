import { renderHook } from '@testing-library/react'
import { useSearchParams } from 'react-router-dom'

import { GetProfileDetailsQuery } from '@app/generated/graphql'
import { TrainerAgreementTypeName, TrainerRoleTypeName } from '@app/types'

import { buildProfile } from '@test/mock-data-utils'

import { EditProfileInputs } from '../../../pages/EditProfile/utils'
import { useFormSubmit } from '../useFormSubmit'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
  useSearchParams: vi.fn(),
}))

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      isTTAdmin: vi.fn().mockReturnValue(true),
      canManageKnowledgeHubAccess: vi.fn().mockReturnValue(true),
    },
    reloadCurrentProfile: vi.fn(),
  }),
}))

const mockUseSearchParams = vi.mocked(useSearchParams)

describe(useFormSubmit.name, () => {
  mockUseSearchParams.mockReturnValue([
    new URLSearchParams({ orgId: '123' }),
    vi.fn(),
  ])
  it('should return an object with the expected properties', () => {
    const { result } = renderHook(() => useFormSubmit())

    expect(result.current).toEqual(
      expect.objectContaining({
        onSubmit: expect.any(Function),
      }),
    )
  })
  it('should navigate back if update was done succesfully', async () => {
    const { result } = renderHook(() => useFormSubmit())
    const { onSubmit } = result.current

    await onSubmit({
      data: {
        firstName: 'John',
        disabilities: '',
        organization: {
          id: '123',
        },
        roles: [
          {
            userRole: 'tt-employee',
            employeeRoles: [{}],
            salesRoles: [{}],
          },
        ],
      } as EditProfileInputs,
      isManualFormError: false,
      profile: {
        id: '123',
      } as GetProfileDetailsQuery['profile'],
      values: {} as EditProfileInputs,
    })
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  it('should navigate back if update was done succesfully and trainer role was assigned', async () => {
    const { result } = renderHook(() => useFormSubmit())
    const { onSubmit } = result.current

    await onSubmit({
      data: {
        firstName: 'John',
        disabilities: '',
        organization: {
          id: '123',
        },
        roles: [
          {
            userRole: 'trainer',
            employeeRoles: [{}],
            salesRoles: [{}],
            trainerRoles: {
              trainerRole: [TrainerRoleTypeName.PRINCIPAL],
              agreementTypes: [TrainerAgreementTypeName.AOL],
            },
          },
        ],
      } as EditProfileInputs,
      isManualFormError: false,
      profile: {
        id: '123',
      } as GetProfileDetailsQuery['profile'],
      values: {} as EditProfileInputs,
    })
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
  it('should not submit if profile is not defined', () => {
    const { result } = renderHook(() => useFormSubmit())
    const { onSubmit } = result.current

    onSubmit({
      data: {
        firstName: 'John',
        disabilities: '',
        organization: {
          id: '123',
        },
        roles: [
          {
            userRole: 'tt-employee',
            employeeRoles: [{}],
            salesRoles: [{}],
          },
        ],
      } as EditProfileInputs,
      isManualFormError: false,
      profile: null as GetProfileDetailsQuery['profile'],
      values: {} as EditProfileInputs,
    })
    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })
  it('should not submit if isManualFormError prop is true', () => {
    const { result } = renderHook(() => useFormSubmit())
    const { onSubmit } = result.current

    onSubmit({
      data: {} as EditProfileInputs,
      isManualFormError: true,
      profile: buildProfile() as unknown as GetProfileDetailsQuery['profile'],
      values: {} as EditProfileInputs,
    })
    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })
})
