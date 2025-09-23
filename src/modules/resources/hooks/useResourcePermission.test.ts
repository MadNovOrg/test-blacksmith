import { addDays } from 'date-fns'
import { Mock } from 'vitest'

import { useAuth } from '@app/context/auth'
import { TrainerRoleTypeName } from '@app/types'

import { renderHook } from '@test/index'

import { useResourcePermission } from './useResourcePermission'

const defaultMockedUseAuthValue = {
  certificates: [],
  trainerRoles: [],
  acl: {
    isInternalUser: vi.fn(() => true),
    isTrainer: vi.fn(() => false),
  },
  profile: {
    courses: [],
  },
}

vi.mock('@app/context/auth', () => ({
  useAuth: vi.fn(() => defaultMockedUseAuthValue),
}))

describe('useResourcePermission hook', () => {
  it('should grant access to internal users', () => {
    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: false,
      seniorTrainer: false,
      etaTrainer: false,
      courseInProgress: false,
    })

    expect(canAccess).toBe(true)
  })

  it('should grant access to principal trainer if principal trainer permission is true', () => {
    ;(useAuth as Mock).mockReturnValueOnce({
      ...defaultMockedUseAuthValue,
      trainerRoles: [TrainerRoleTypeName.PRINCIPAL],
      acl: { isTrainer: vi.fn(() => true), isInternalUser: vi.fn(() => false) },
    })

    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: true,
      seniorTrainer: false,
      etaTrainer: false,
      courseInProgress: false,
    })

    expect(canAccess).toBe(true)
  })

  it('should grant access to senior trainer if senior trainer permission is true', () => {
    ;(useAuth as Mock).mockReturnValueOnce({
      ...defaultMockedUseAuthValue,
      trainerRoles: [TrainerRoleTypeName.SENIOR],
      acl: { isTrainer: vi.fn(() => true), isInternalUser: vi.fn(() => false) },
    })

    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: false,
      seniorTrainer: true,
      etaTrainer: false,
      courseInProgress: false,
    })

    expect(canAccess).toBe(true)
  })

  it('should grant access to eta trainer if eta trainer permission is true', () => {
    ;(useAuth as Mock).mockReturnValueOnce({
      ...defaultMockedUseAuthValue,
      trainerRoles: [TrainerRoleTypeName.TRAINER_ETA],
      acl: { isTrainer: vi.fn(() => true), isInternalUser: vi.fn(() => false) },
    })

    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: false,
      seniorTrainer: false,
      etaTrainer: true,
      courseInProgress: false,
    })

    expect(canAccess).toBe(true)
  })

  it("shouldn't grant access if user has no trainer role and neither required certificates", () => {
    ;(useAuth as Mock).mockReturnValueOnce({
      ...defaultMockedUseAuthValue,
      trainerRoles: [],
      acl: { isTrainer: vi.fn(() => true), isInternalUser: vi.fn(() => false) },
    })

    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: true,
      seniorTrainer: true,
      etaTrainer: true,
      courseInProgress: false,
    })

    expect(canAccess).toBe(false)
  })

  it('should grant access if user has course in progress if course in progress permission is true', () => {
    ;(useAuth as Mock).mockReturnValueOnce({
      ...defaultMockedUseAuthValue,
      trainerRoles: [],
      acl: {
        isTrainer: vi.fn(() => false),
        isInternalUser: vi.fn(() => false),
      },
      profile: {
        courses: [
          {
            course: {
              start: {
                aggregate: {
                  date: {
                    start: addDays(new Date(Date.now()), -1).toISOString(),
                  },
                },
              },
              end: {
                aggregate: {
                  date: { end: addDays(new Date(Date.now()), 1).toISOString() },
                },
              },
            },
          },
        ],
      },
    })

    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: false,
      seniorTrainer: false,
      etaTrainer: false,
      courseInProgress: true,
    })

    expect(canAccess).toBe(true)
  })

  it("shouldn't grant access if user has no course in progress if course in progress permission is true", () => {
    ;(useAuth as Mock).mockReturnValueOnce({
      ...defaultMockedUseAuthValue,
      trainerRoles: [],
      acl: {
        isTrainer: vi.fn(() => false),
        isInternalUser: vi.fn(() => false),
      },
      profile: {
        courses: [
          {
            course: {
              start: {
                aggregate: {
                  date: {
                    start: addDays(new Date(Date.now()), -1).toISOString(),
                  },
                },
              },
              end: {
                aggregate: {
                  date: {
                    end: addDays(new Date(Date.now()), -1).toISOString(),
                  },
                },
              },
            },
          },
        ],
      },
    })

    const { result } = renderHook(() => useResourcePermission())

    const canAccess = result.current({
      certificateLevels: [],
      principalTrainer: false,
      seniorTrainer: false,
      etaTrainer: false,
      courseInProgress: true,
    })

    expect(canAccess).toBe(false)
  })
})
