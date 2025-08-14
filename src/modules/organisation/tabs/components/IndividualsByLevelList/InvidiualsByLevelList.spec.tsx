import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  GetProfilesWithUpcomingEnrollmentsQuery,
} from '@app/generated/graphql'
import { buildCourse } from '@app/modules/course/pages/CourseBuilder/test-utils'
import { useOrganisationProfilesByCertificateLevel } from '@app/modules/organisation/hooks/useOrganisationProfielsByCertificateLevel/useOrganisationProfielsByCertificateLevel'
import { useProfilesWithOrganisations } from '@app/modules/organisation/hooks/useProfilesWithOrganisations/useProfilesWithOrganisations'
import { GET_PROFILES_WITH_UPCOMING_ENROLLMENTS } from '@app/modules/organisation/hooks/useProfilesWithUpcomingEnrollments/useProfilesWithUpcomingEnrollments'

import { chance, render, renderHook, screen } from '@test/index'

import { IndividualsByLevelList } from './IndividualsByLevelList'

vi.mock(
  '@app/modules/organisation/hooks/useOrganisationProfielsByCertificateLevel/useOrganisationProfielsByCertificateLevel',
  () => ({
    useOrganisationProfilesByCertificateLevel: vi.fn().mockReturnValue({
      profilesByLevel: new Map(),
      fetching: false,
    }),
  }),
)

vi.mock(
  '@app/modules/organisation/hooks/useProfilesWithOrganisations/useProfilesWithOrganisations',
  () => ({
    useProfilesWithOrganisations: vi.fn().mockReturnValue({
      profileWithOrganisations: new Map(),
      fetching: false,
    }),
  }),
)

const useOrganisationProfilesByCertificateLevelMock = vi.mocked(
  useOrganisationProfilesByCertificateLevel,
)
const useOrganisationsForProfilesMock = vi.mocked(useProfilesWithOrganisations)

describe(IndividualsByLevelList.name, () => {
  it('should render', () => {
    const { container } = render(
      <IndividualsByLevelList orgId={''} courseLevel={null} />,
    )
    expect(container).toBeInTheDocument()
  })
  it('should render profiles in table', () => {
    const {
      result: {
        current: { t },
      },
    } = renderHook(() => useTranslation())
    const userFullName = chance.name()
    const date = '2021-12-12'
    useOrganisationProfilesByCertificateLevelMock.mockReturnValue({
      profilesByLevel: new Map([
        [
          Course_Level_Enum.Advanced,
          [
            {
              id: '1',
              fullName: userFullName,
              certificates: [
                {
                  id: chance.guid(),
                  courseLevel: Course_Level_Enum.Advanced,
                  expiryDate: date,
                },
              ],
            },
          ],
        ],
      ]),
      fetching: false,
    })

    render(
      <IndividualsByLevelList
        orgId={''}
        courseLevel={Course_Level_Enum.Advanced}
      />,
    )

    expect(screen.getByText(userFullName)).toBeInTheDocument()
    expect(
      screen.getByText(
        t('dates.default', {
          date,
        }),
      ),
    ).toBeInTheDocument()
  })
  it("should render profile's organisations", () => {
    const userFullName = chance.name()
    const date = '2021-12-12'
    const orgName1 = chance.name()
    const orgName2 = chance.name()
    const profileId = chance.guid()
    useOrganisationProfilesByCertificateLevelMock.mockReturnValue({
      profilesByLevel: new Map([
        [
          Course_Level_Enum.Advanced,
          [
            {
              id: profileId,
              fullName: userFullName,
              certificates: [
                {
                  id: chance.guid(),
                  courseLevel: Course_Level_Enum.Advanced,
                  expiryDate: date,
                },
              ],
            },
          ],
        ],
      ]),
      fetching: false,
    })

    useOrganisationsForProfilesMock.mockReturnValue({
      profileWithOrganisations: new Map([
        [
          profileId,
          {
            __typename: 'profile',
            id: chance.guid(),
            organizations: [
              {
                __typename: 'organization_member',
                id: chance.guid(),
                position: 'Position 1',
                organization: {
                  __typename: 'organization',
                  id: chance.guid(),
                  name: orgName1,
                },
              },
              {
                __typename: 'organization_member',
                id: chance.guid(),
                position: 'Position 1',
                organization: {
                  __typename: 'organization',
                  id: chance.guid(),
                  name: orgName2,
                },
              },
            ],
          },
        ],
      ]),
      fetching: false,
    })

    render(
      <IndividualsByLevelList
        orgId={''}
        courseLevel={Course_Level_Enum.Advanced}
      />,
    )
    ;[orgName1, orgName2].forEach(orgName => {
      expect(screen.getByText(orgName)).toBeInTheDocument()
    })
  })
  it("should render profile's enrollments", () => {
    const {
      result: {
        current: { t },
      },
    } = renderHook(() => useTranslation())
    const course = buildCourse({
      course_code: chance.word(),
    })

    const profileId = chance.guid()
    const upcomingEnrollment = buildCourse({
      course_code: chance.word(),
    })

    useOrganisationProfilesByCertificateLevelMock.mockReturnValue({
      profilesByLevel: new Map([
        [
          Course_Level_Enum.Advanced,
          [
            {
              id: profileId,
              fullName: 'John Doe',
              certificates: [
                {
                  id: chance.guid(),
                  courseLevel: Course_Level_Enum.Advanced,
                  expiryDate: '',
                },
              ],
            },
          ],
        ],
      ]),
      fetching: false,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PROFILES_WITH_UPCOMING_ENROLLMENTS) {
          return fromValue<{ data: GetProfilesWithUpcomingEnrollmentsQuery }>({
            data: {
              profile: [
                {
                  id: profileId,
                  courses: [
                    {
                      course: {
                        name: course.name,
                        courseLevel: course.level,
                        id: course.id,
                        course_code: course.course_code,
                        type: course.type,
                      },
                    },
                  ],
                  upcomingEnrollments: [
                    {
                      course: {
                        courseLevel: upcomingEnrollment.level,
                        id: upcomingEnrollment.id,
                        name: upcomingEnrollment.name,
                        course_code: upcomingEnrollment.course_code,
                        type: upcomingEnrollment.type,
                      },
                    },
                  ],
                },
              ],
            },
          })
        }
      },
    } as unknown as Client
    render(
      <Provider value={client}>
        <IndividualsByLevelList
          orgId={''}
          courseLevel={Course_Level_Enum.Advanced}
        />
      </Provider>,
    )

    const courseText = `${t(
      `common.certificates.${course.level?.toLowerCase()}`,
    )} ${course?.course_code}`

    const upcomingEnrollmentText = `${t(
      `common.certificates.${upcomingEnrollment.level?.toLowerCase()}`,
    )} ${upcomingEnrollment?.course_code}`

    ;[courseText, upcomingEnrollmentText].forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
