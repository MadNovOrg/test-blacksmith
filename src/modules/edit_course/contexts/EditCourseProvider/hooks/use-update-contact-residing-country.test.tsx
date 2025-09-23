import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'
import { Maybe } from 'yup'

import { Course, CourseInput } from '@app/types'

import { chance, renderHook } from '@test/index'

import { useUpdateContactResidingCountry } from './use-update-contact-residing-country'

describe('useUpdateContactResidingCountry', () => {
  const mockClient = {
    executeMutation: vi.fn(() =>
      fromValue({
        data: {
          updateProfile: { success: true },
        },
      }),
    ),
  } as unknown as Client

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider value={mockClient}>{children}</Provider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not call executeMutation when courseData is null', async () => {
    const { result } = renderHook(
      () =>
        useUpdateContactResidingCountry({
          courseData: null,
          initialCourseData: undefined,
        }),
      { wrapper },
    )

    await result.current.editContactResidingCountry()
    expect(mockClient.executeMutation).not.toHaveBeenCalled()
  })

  it('should call executeMutation for bookingContact when conditions are met', async () => {
    const courseData = {
      bookingContact: {
        profileId: chance.guid(),
        residingCountryCode: chance.string({ length: 2 }),
        residingCountry: chance.country(),
      },
    }
    const initialCourseData = {
      bookingContact: { countryCode: null },
    }

    const { result } = renderHook(
      () =>
        useUpdateContactResidingCountry({
          courseData: courseData as unknown as Pick<
            CourseInput,
            'bookingContact' | 'organizationKeyContact'
          > | null,
          initialCourseData: initialCourseData as unknown as Maybe<Course>,
        }),
      { wrapper },
    )

    await result.current.editContactResidingCountry()
    expect(mockClient.executeMutation).toHaveBeenCalledTimes(1)
    expect(mockClient.executeMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            profileId: courseData.bookingContact?.profileId,
            country: courseData.bookingContact?.residingCountry,
            countryCode: courseData.bookingContact?.residingCountryCode,
          },
        },
      }),
      expect.anything(),
    )
  })

  it('should call executeMutation for organizationKeyContact when conditions are met', async () => {
    const courseData = {
      organizationKeyContact: {
        profileId: chance.guid(),
        residingCountryCode: chance.string({ length: 2 }),
        residingCountry: chance.country(),
      },
    }
    const initialCourseData = {
      organizationKeyContact: { countryCode: null },
    }

    const { result } = renderHook(
      () =>
        useUpdateContactResidingCountry({
          courseData: courseData as unknown as Pick<
            CourseInput,
            'bookingContact' | 'organizationKeyContact'
          > | null,
          initialCourseData: initialCourseData as unknown as Maybe<Course>,
        }),
      { wrapper },
    )

    await result.current.editContactResidingCountry()
    expect(mockClient.executeMutation).toHaveBeenCalledTimes(1)
    expect(mockClient.executeMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            profileId: courseData.organizationKeyContact?.profileId,
            country: courseData.organizationKeyContact?.residingCountry,
            countryCode: courseData.organizationKeyContact?.residingCountryCode,
          },
        },
      }),
      expect.anything(),
    )
  })

  it('should not call executeMutation when countryCode already exists', async () => {
    const courseData = {
      bookingContact: {
        profileId: chance.guid(),
        residingCountryCode: chance.string({ length: 2 }),
        residingCountry: chance.country(),
      },
    }
    const initialCourseData = {
      bookingContact: { countryCode: chance.string({ length: 2 }) },
    }

    const { result } = renderHook(
      () =>
        useUpdateContactResidingCountry({
          courseData: courseData as unknown as Pick<
            CourseInput,
            'bookingContact' | 'organizationKeyContact'
          > | null,
          initialCourseData: initialCourseData as unknown as Maybe<Course>,
        }),
      { wrapper },
    )

    await result.current.editContactResidingCountry()
    expect(mockClient.executeMutation).not.toHaveBeenCalled()
  })

  it('should call executeMutation for both contacts when conditions are met', async () => {
    const courseData = {
      bookingContact: {
        profileId: chance.guid(),
        residingCountryCode: chance.string({ length: 2 }),
        residingCountry: chance.country(),
      },
      organizationKeyContact: {
        profileId: chance.guid(),
        residingCountryCode: chance.string({ length: 2 }),
        residingCountry: chance.country(),
      },
    }
    const initialCourseData = {
      bookingContact: { countryCode: null },
      organizationKeyContact: { countryCode: null },
    }

    const { result } = renderHook(
      () =>
        useUpdateContactResidingCountry({
          courseData: courseData as unknown as Pick<
            CourseInput,
            'bookingContact' | 'organizationKeyContact'
          > | null,
          initialCourseData: initialCourseData as unknown as Maybe<Course>,
        }),
      { wrapper },
    )

    await result.current.editContactResidingCountry()
    expect(mockClient.executeMutation).toHaveBeenCalledTimes(2)
  })
})
