import { useQuery } from 'urql'

import { Course_Delivery_Type_Enum } from '@app/generated/graphql'

import { renderHook } from '@test/index'

import { useCourseWaitlist, WAITLIST_COURSE } from './useCourseWaitlist'

vi.mock('urql', () => ({
  useQuery: vi.fn(),
  gql: vi.fn(),
}))

const mockUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>

describe(useCourseWaitlist.name, () => {
  it('should fetch course waitlist data', () => {
    const courseId = 123

    const mockData = {
      courses: [
        {
          id: 1,
          name: 'Course 1',
          deliveryType: Course_Delivery_Type_Enum.F2F,
          schedule: {
            start: '2022-01-01',
            end: '2022-01-02',
            venue: {
              name: 'Venue 1',
              addressLineOne: 'Address Line 1',
              addressLineTwo: 'Address Line 2',
              city: 'City',
              postCode: '12345',
            },
          },
        },
      ],
    }

    mockUseQuery.mockReturnValue([
      {
        data: { courses: mockData.courses },
        fetching: false,
        error: undefined,
      },
    ])
    const { result } = renderHook(() => useCourseWaitlist({ courseId }))

    expect(mockUseQuery).toHaveBeenCalledWith({
      query: WAITLIST_COURSE,
      variables: { id: courseId },
    })

    expect(result.current).toEqual([
      {
        data: { courses: mockData.courses },
        fetching: false,
        error: undefined,
      },
    ])
  })
})
