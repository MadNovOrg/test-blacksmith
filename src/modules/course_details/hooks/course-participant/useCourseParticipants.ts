import { useMemo } from 'react'
import { OperationContext, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Participant_Bool_Exp,
  Course_Type_Enum,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import {
  ParamsType,
  GET_COURSE_PARTICIPANTS,
  ResponseType,
} from '@app/modules/course_details/hooks/course-participant/get-course-participants'
import { SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useCourseParticipants(
  courseId?: number,
  options?: {
    alwaysShowArchived?: boolean
    order?: SortOrder
    pagination?: { limit: number; offset: number }
    sortBy?: string
    where?: Course_Participant_Bool_Exp
  },
): {
  data?: ResponseType['courseParticipants']
  error?: Error
  total?: number
  status: LoadingStatus
  mutate: (opts?: Partial<OperationContext> | undefined) => void
} {
  const { acl, profile } = useAuth()
  const sortBy = options?.sortBy ?? 'name'
  const order = options?.order ?? 'asc'

  const { data: course } = useCourse(String(courseId))

  let orderBy: ParamsType['orderBy'] = {
    profile: { fullName: order },
  }
  if (sortBy === 'contact') {
    orderBy = { profile: { email: order } }
  }
  if (sortBy === 'bl-status') {
    orderBy = { go1EnrolmentStatus: order }
  }

  const queryConditions: Course_Participant_Bool_Exp[] = []
  if (!options?.alwaysShowArchived && !acl.canViewArchivedProfileData()) {
    queryConditions.push({ profile: { archived: { _eq: false } } })
  }
  if (courseId) {
    queryConditions.push({ course_id: { _eq: courseId } })
  }
  if (options?.where) {
    queryConditions.push(options.where)
  }

  const orgsAsAdmin = useMemo(
    () =>
      profile?.organizations
        .filter(org => org.isAdmin)
        .map(org => org.organization.id),
    [profile?.organizations],
  )

  const [{ data, error }, mutate] = useQuery<ResponseType, ParamsType>({
    query: GET_COURSE_PARTICIPANTS,
    variables: {
      limit: options?.pagination?.limit,
      offset: options?.pagination?.offset,
      where: {
        _and: [
          ...queryConditions,
          ...(acl.isOrgAdmin() && course?.course?.type === Course_Type_Enum.Open
            ? ([
                {
                  profile: {
                    organizations: {
                      _or: [
                        {
                          organization_id: {
                            _in: orgsAsAdmin,
                          },
                        },
                        {
                          organization: {
                            main_organisation_id: {
                              _in: orgsAsAdmin,
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ] as Course_Participant_Bool_Exp[])
            : []),
        ],
      },
      withOrder: acl.canViewOrders(),
      orderBy,
      courseId: courseId ?? 0,
    },
    requestPolicy: 'cache-and-network',
  })

  return {
    data: data?.courseParticipants,
    error,
    total: data?.courseParticipantsAggregation?.aggregate?.count,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
