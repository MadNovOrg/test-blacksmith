import { useFeatureFlagEnabled } from 'posthog-js/react'

import {
  Course_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'
import { CourseInput } from '@app/types'
import { LoadingStatus } from '@app/util'

import { act, renderHook } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { useReserveResourcePacks } from '../../queries/update-course'

import { EditCourseProvider, useEditCourse } from './EditCourseProvider'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

vi.mock('@app/hooks/useCourse')
vi.mock('@app/modules/course/hooks/useOrgResourcePacks')
vi.mock('../../queries/update-course')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

const useCourseMock = vi.mocked(useCourse)
const useOrgResourcePacksMock = vi.mocked(useOrgResourcePacks)
const useReserveResourcePacksMock = vi.mocked(useReserveResourcePacks)

describe('EditCourseProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <EditCourseProvider>{children}</EditCourseProvider>
  )

  describe('Managing Resource Packs for Indirect Learning', () => {
    it('should accurately calculate the required number of resource packs to buy', async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      vi.mock('@app/context/auth', async () => ({
        ...(await vi.importActual('@app/context/auth')),
        useAuth: vi.fn().mockReturnValue({
          loadProfile: vi.fn(),
          acl: {
            canCreateCourse: () => true,
            canEditIndirectBLCourses: vi.fn().mockReturnValue(true),
            isAustralia: vi.fn().mockReturnValue(true),
            isUK: vi.fn().mockReturnValue(false),
          },
        }),
      }))

      const mockPreEditedCourse = buildCourse({
        overrides: {
          max_participants: 12,
          reservedResourcePacks: 12,
          resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
          type: Course_Type_Enum.Indirect,
        },
      })

      const reserveResourcePacksMock = vi.fn()

      useCourseMock.mockReturnValue({
        data: { course: mockPreEditedCourse },
        mutate: vi.fn(),
        status: LoadingStatus.SUCCESS,
      })

      useOrgResourcePacksMock.mockReturnValue({
        refetch: vi.fn(),
        resourcePacks: {
          balance: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
          reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        },
      })

      useReserveResourcePacksMock.mockReturnValue([
        { fetching: false, stale: false },
        reserveResourcePacksMock,
      ])

      const { result } = renderHook(() => useEditCourse(), { wrapper })

      await act(async () => {
        result.current.setTrainersData({
          assist: [],
          lead: [],
          moderator: [],
        })
      })

      await act(async () => {
        result.current.setCourseData({
          ...mockPreEditedCourse,
          maxParticipants: 14,
        } as unknown as CourseInput)
      })

      expect(result.current.additionalRequiredResourcePacks).toEqual(2)
      expect(result.current.additionalResourcePacksToPurchase).toEqual(2)
    })

    it("should not require purchasing any resource packs if the organization's balance is sufficient", async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      vi.mock('@app/context/auth', async () => ({
        ...(await vi.importActual('@app/context/auth')),
        useAuth: vi.fn().mockReturnValue({
          loadProfile: vi.fn(),
          acl: {
            canCreateCourse: () => true,
            canEditIndirectBLCourses: vi.fn().mockReturnValue(true),
            isAustralia: vi.fn().mockReturnValue(true),
            isUK: vi.fn().mockReturnValue(false),
          },
        }),
      }))

      const mockPreEditedCourse = buildCourse({
        overrides: {
          max_participants: 12,
          reservedResourcePacks: 12,
          resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
          type: Course_Type_Enum.Indirect,
        },
      })

      const reserveResourcePacksMock = vi.fn()

      useCourseMock.mockReturnValue({
        data: { course: mockPreEditedCourse },
        mutate: vi.fn(),
        status: LoadingStatus.SUCCESS,
      })

      useOrgResourcePacksMock.mockReturnValue({
        refetch: vi.fn(),
        resourcePacks: {
          balance: { DIGITAL_WORKBOOK: 2, PRINT_WORKBOOK: 0 },
          reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        },
      })

      useReserveResourcePacksMock.mockReturnValue([
        { fetching: false, stale: false },
        reserveResourcePacksMock,
      ])

      const { result } = renderHook(() => useEditCourse(), { wrapper })

      result.current.setTrainersData({
        assist: [],
        lead: [],
        moderator: [],
      })

      await act(async () => {
        result.current.setCourseData({
          ...mockPreEditedCourse,
          maxParticipants: 14,
        } as unknown as CourseInput)
      })

      expect(result.current.additionalRequiredResourcePacks).toEqual(2)
      expect(result.current.additionalResourcePacksToPurchase).toEqual(0)
    })

    it('should not require any additional resource packs if enough are already reserved for the course', async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      vi.mock('@app/context/auth', async () => ({
        ...(await vi.importActual('@app/context/auth')),
        useAuth: vi.fn().mockReturnValue({
          loadProfile: vi.fn(),
          acl: {
            canCreateCourse: () => true,
            canEditIndirectBLCourses: vi.fn().mockReturnValue(true),
            isAustralia: vi.fn().mockReturnValue(true),
            isUK: vi.fn().mockReturnValue(false),
          },
        }),
      }))

      const mockPreEditedCourse = buildCourse({
        overrides: {
          max_participants: 12,
          reservedResourcePacks: 14,
          resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
          type: Course_Type_Enum.Indirect,
        },
      })

      const reserveResourcePacksMock = vi.fn()

      useCourseMock.mockReturnValue({
        data: { course: mockPreEditedCourse },
        mutate: vi.fn(),
        status: LoadingStatus.SUCCESS,
      })

      useOrgResourcePacksMock.mockReturnValue({
        refetch: vi.fn(),
        resourcePacks: {
          balance: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
          reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        },
      })

      useReserveResourcePacksMock.mockReturnValue([
        { fetching: false, stale: false },
        reserveResourcePacksMock,
      ])

      const { result } = renderHook(() => useEditCourse(), { wrapper })

      result.current.setTrainersData({
        assist: [],
        lead: [],
        moderator: [],
      })

      await act(async () => {
        result.current.setCourseData({
          ...mockPreEditedCourse,
          maxParticipants: 14,
        } as unknown as CourseInput)
      })

      expect(result.current.additionalRequiredResourcePacks).toEqual(0)
      expect(result.current.additionalResourcePacksToPurchase).toEqual(0)
    })
  })
})
