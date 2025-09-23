import { gql, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetProfilesWithUpcomingEnrollmentsQuery,
  GetProfilesWithUpcomingEnrollmentsQueryVariables,
} from '@app/generated/graphql'

const today = new Date().toISOString().split('T')[0]

export const GET_PROFILES_WITH_UPCOMING_ENROLLMENTS = gql`
  query GetProfilesWithUpcomingEnrollments(
    $ids: [uuid!]!
    $enrollmentsCondition: upcoming_enrollments_bool_exp = {}
  ) {
    profile: profile(where: { id: { _in: $ids } }) {
      id
      courses(where: { course: { _and: [{ type: { _eq: OPEN } }, {start_date:{_gte: "${today}"}}] } }) {
        course {
          name
          courseLevel: level
          id
          course_code
          type
        }
      }
      upcomingEnrollments(where: $enrollmentsCondition) {
        course {
          name
          courseLevel: level
          id
          course_code
          type
        }
      }
    }
  }
`

export const useProfilesWithUpcomingEnrollments = ({
  ids,
  orgId,
}: {
  ids: string[]
  orgId: string
}) => {
  const {
    profile,
    acl: { isInternalUser, isOrgAdmin },
  } = useAuth()

  const profileId = profile?.id

  const enrollmentsCondition =
    profileId && isOrgAdmin() && !isInternalUser()
      ? {
          _or: [
            { orgId: { _eq: orgId } },
            {
              course: {
                participants: {
                  profile: {
                    organizations: {
                      organization: {
                        _or: [
                          {
                            members: {
                              _and: [
                                { profile_id: { _eq: profileId } },
                                { isAdmin: { _eq: true } },
                              ],
                            },
                          },
                          {
                            main_organisation: {
                              members: {
                                _and: [
                                  { profile_id: { _eq: profileId } },
                                  { isAdmin: { _eq: true } },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
        }
      : {}

  return useQuery<
    GetProfilesWithUpcomingEnrollmentsQuery,
    GetProfilesWithUpcomingEnrollmentsQueryVariables
  >({
    query: GET_PROFILES_WITH_UPCOMING_ENROLLMENTS,
    variables: {
      ids,
      enrollmentsCondition,
    },
  })
}
