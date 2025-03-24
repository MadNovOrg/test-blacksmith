import { deepmerge } from 'deepmerge-ts'
import { useMemo, useRef } from 'react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Bool_Exp,
  Course_Delivery_Type_Enum,
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Order_By,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Order_Bool_Exp,
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'
import { GET_TRAINER_COURSES } from '@app/modules/trainer_courses/queries/get-trainer-courses'
import {
  AdminOnlyCourseStatus,
  AttendeeOnlyCourseStatus,
  CourseState,
  RoleName,
} from '@app/types'
import { ALL_ORGS, getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type OrgAdminCourseStatuses =
  | AdminOnlyCourseStatus.CancellationRequested
  | AttendeeOnlyCourseStatus.AwaitingGrade
  | Course_Status_Enum.Cancelled
  | Course_Status_Enum.Completed
  | Course_Status_Enum.Scheduled

export type CoursesFilters = {
  keyword?: string
  levels?: Course_Level_Enum[]
  courseResidingCountries?: string[]
  courseTrainerTypes?: Course_Trainer_Type_Enum[]
  types?: Course_Type_Enum[]
  statuses?: string[]
  states?: CourseState[]
  excludedCourses?: number[]
  excludedStatuses?: Course_Status_Enum[]
  go1Integration?: boolean
  reaccreditation?: boolean
  creation?: {
    start?: Date
    end?: Date
  }
  schedule?: {
    start?: Date
    end?: Date
  }
  accreditedBy?: Accreditors_Enum[]
  deliveryTypes?: Course_Delivery_Type_Enum[]
}

type Props = {
  sorting: Sorting
  filters?: CoursesFilters
  pagination?: { perPage: number; currentPage: number }
  orgId?: string
}

export const getIndividualsCourseStatusesConditions = (
  currentDate: string,
  forOpenCourseBookingContact?: { profileId?: string },
): Record<OrgAdminCourseStatuses, Course_Bool_Exp> => {
  const cancelledStatuses = [
    Course_Status_Enum.Cancelled,
    Course_Status_Enum.Declined,
  ]

  const notCancelRequestedCond = {
    _not: { cancellationRequest: { id: { _is_null: false } } },
  }

  const notCancelledOrDeclinedCond = {
    status: {
      _nin: cancelledStatuses,
    },
  }

  return {
    [AttendeeOnlyCourseStatus.AwaitingGrade]: {
      _or: [
        {
          _or: [
            {
              participants: {
                grade: { _is_null: true },
                ...(forOpenCourseBookingContact?.profileId
                  ? {
                      order: {
                        bookingContactProfileId: {
                          _eq: forOpenCourseBookingContact.profileId,
                        },
                      } as Order_Bool_Exp,
                    }
                  : null),
              },
            },
            {
              _and: [
                {
                  _not: { participants: { grade: { _is_null: true } } },
                },
                { _not: { participants: { grade: { _is_null: false } } } },
              ],
            },
          ],

          schedule: {
            end: { _lt: currentDate },
          },
          status: {
            _nin: [
              ...cancelledStatuses,
              Course_Status_Enum.Completed,
              Course_Status_Enum.EvaluationMissing,
            ],
          },
          ...notCancelRequestedCond,
        },
      ],
    },
    [AdminOnlyCourseStatus.CancellationRequested]: {
      _or: [
        {
          ...notCancelledOrDeclinedCond,
          cancellationRequest: { id: { _is_null: false } },
        },
      ],
    },
    [Course_Status_Enum.Cancelled]: {
      _or: [
        {
          status: {
            _in: [Course_Status_Enum.Cancelled, Course_Status_Enum.Declined],
          },
        },
      ],
    },
    [Course_Status_Enum.Completed]: {
      _or: [
        {
          ...notCancelledOrDeclinedCond,
          ...notCancelRequestedCond,
          _and: [
            {
              _not: {
                participants: {
                  grade: { _is_null: true },
                  ...(forOpenCourseBookingContact?.profileId
                    ? {
                        order: {
                          bookingContactProfileId: {
                            _eq: forOpenCourseBookingContact.profileId,
                          },
                        } as Order_Bool_Exp,
                      }
                    : null),
                },
              },
            },
            { gradingStarted: { _eq: true } },
          ],
          schedule: {
            end: { _lt: currentDate },
          },
        },
        {
          ...notCancelRequestedCond,
          status: {
            _in: [
              Course_Status_Enum.Completed,
              Course_Status_Enum.EvaluationMissing,
            ],
          },
        },
      ],
    },
    [Course_Status_Enum.Scheduled]: {
      _or: [
        {
          ...notCancelRequestedCond,
          schedule: {
            end: { _gt: currentDate },
          },
          status: {
            _nin: [
              ...cancelledStatuses,
              Course_Status_Enum.Completed,
              Course_Status_Enum.EvaluationMissing,
            ],
          },
        },
      ],
    },
  }
}

export const filtersToWhereClause = (
  where: Course_Bool_Exp,
  isInternalUser: boolean,
  filters?: CoursesFilters,
) => {
  if (filters?.levels?.length) {
    where.level = { _in: filters.levels }
  }

  if (filters?.courseResidingCountries?.length) {
    where._or = [
      ...(where._or ?? []),
      { residingCountry: { _in: filters.courseResidingCountries } },
      {
        _and: [
          { residingCountry: { _is_null: true } },
          {
            schedule: {
              venue: {
                countryCode: { _in: filters.courseResidingCountries },
              },
            },
          },
        ],
      },
    ]
  }

  if (filters?.types?.length) {
    where.type = { _in: filters.types }
  }

  if (filters?.excludedCourses?.length) {
    where.id = {
      _nin: filters.excludedCourses,
    }
  }

  if (filters?.go1Integration) {
    where.go1Integration = { _eq: filters?.go1Integration }
  }

  if (filters?.reaccreditation) {
    where.reaccreditation = { _eq: filters?.reaccreditation }
  }

  if (filters?.creation?.start) {
    where.createdAt = {
      _gte: filters.creation.start,
    }
  }

  if (filters?.creation?.end) {
    where.createdAt = {
      ...where.createdAt,
      _lte: filters.creation.end,
    }
  }

  if (filters?.schedule?.start || filters?.schedule?.end) {
    where.schedule = {
      _and: [],
    }
    if (filters?.schedule?.start) {
      where.schedule._and?.push({ start: { _gte: filters.schedule.start } })
    }
    if (filters?.schedule?.end) {
      where.schedule._and?.push({ end: { _lte: filters.schedule.end } })
    }
  }

  if (filters?.accreditedBy?.length) {
    where.accreditedBy = { _in: filters.accreditedBy }
  }

  if (filters?.deliveryTypes?.length) {
    where.deliveryType = { _in: filters.deliveryTypes }
  }

  if (filters?.states?.length) {
    where.state = { _in: filters.states }
  }

  const query = filters?.keyword?.trim()

  const keywords = query?.split(' ').filter(word => Boolean(word))

  if (query?.length) {
    const orClauses = [
      keywords && keywords?.length > 1
        ? {
            _and: keywords.map(w => ({ search_fields: { _ilike: `%${w}%` } })),
          }
        : { search_fields: { _ilike: `%${query}%` } },
    ]

    if (where._or) {
      where._and = [{ _or: where._or }, { _or: orClauses.filter(Boolean) }]
    } else {
      where._or = orClauses.filter(Boolean)
    }
  }

  if (
    filters?.courseTrainerTypes?.length &&
    (!isInternalUser || (isInternalUser && query?.length))
  ) {
    where.trainers = {
      _and: [
        ...(isInternalUser
          ? keywords && keywords?.length > 1
            ? [
                {
                  _and: keywords.map(w => ({
                    profile: { fullName: { _ilike: `%${w}%` } },
                  })),
                },
              ]
            : [
                {
                  profile: { fullName: { _ilike: `%${query}%` } },
                },
              ]
          : []),
        {
          type: { _in: filters.courseTrainerTypes },
        },
      ],
    }
  }

  return where
}

export const useCourses = (
  role: RoleName,
  { sorting, filters, pagination, orgId }: Props,
) => {
  const { acl, organizationIds, profile } = useAuth()
  const dateRef = useRef(new Date().toISOString())
  const orderBy = getOrderBy(sorting)

  const orgAdminCourseStatusConditionsMap: Record<
    OrgAdminCourseStatuses,
    Course_Bool_Exp
  > = useMemo(() => getIndividualsCourseStatusesConditions(dateRef.current), [])

  const where = useMemo(() => {
    let obj: Course_Bool_Exp = {}
    if (orgId) {
      const allAvailableOrgs = {}
      const onlyUserOrgs: Course_Bool_Exp = {
        _or: [
          {
            organization: {
              _or: [
                { id: { _in: organizationIds } },
                {
                  main_organisation: {
                    members: {
                      isAdmin: { _eq: true },
                      profile_id: { _eq: profile?.id },
                    },
                  },
                },
              ],
            },
            type: { _in: [Course_Type_Enum.Closed, Course_Type_Enum.Indirect] },
          },
          {
            type: { _eq: Course_Type_Enum.Open },
            participants: {
              profile: {
                organizations: {
                  organization: {
                    _or: [
                      {
                        id: { _in: organizationIds },
                        members: {
                          isAdmin: { _eq: true },
                          profile_id: { _eq: profile?.id },
                        },
                      },
                      {
                        main_organisation: {
                          members: {
                            isAdmin: { _eq: true },
                            profile_id: { _eq: profile?.id },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      }
      const specificOrg: Course_Bool_Exp = {
        _or: [
          {
            organization: { id: { _eq: orgId } },
            type: { _in: [Course_Type_Enum.Closed, Course_Type_Enum.Indirect] },
          },
          {
            type: { _eq: Course_Type_Enum.Open },
            participants: {
              profile: {
                organizations: {
                  organization: {
                    id: { _eq: orgId },
                    members: {
                      isAdmin: { _eq: true },
                      profile_id: { _eq: profile?.id },
                    },
                  },
                },
              },
            },
          },
        ],
      }
      if (orgId === ALL_ORGS) {
        obj = acl.canViewAllOrganizations() ? allAvailableOrgs : onlyUserOrgs
      } else {
        obj = specificOrg
      }
    }

    obj = filtersToWhereClause(obj, acl.isInternalUser(), filters)

    let orgAdminStatusCondition: Course_Bool_Exp = {}

    if (acl.isOrgAdmin()) {
      if (filters?.statuses?.includes(Course_Status_Enum.Scheduled)) {
        orgAdminStatusCondition = deepmerge(
          orgAdminStatusCondition,
          orgAdminCourseStatusConditionsMap.SCHEDULED,
        )
      }

      if (filters?.statuses?.includes(Course_Status_Enum.Completed)) {
        orgAdminStatusCondition = deepmerge(
          orgAdminStatusCondition,
          orgAdminCourseStatusConditionsMap.COMPLETED,
        )
      }

      if (filters?.statuses?.includes(AttendeeOnlyCourseStatus.AwaitingGrade)) {
        orgAdminStatusCondition = deepmerge(
          orgAdminStatusCondition,
          orgAdminCourseStatusConditionsMap.AWAITING_GRADE,
        )
      }

      if (
        filters?.statuses?.includes(AdminOnlyCourseStatus.CancellationRequested)
      ) {
        orgAdminStatusCondition = deepmerge(
          orgAdminStatusCondition,
          orgAdminCourseStatusConditionsMap.CANCELLATION_REQUESTED,
        )
      }

      if (filters?.statuses?.includes(Course_Status_Enum.Cancelled)) {
        orgAdminStatusCondition = deepmerge(
          orgAdminStatusCondition,
          orgAdminCourseStatusConditionsMap.CANCELLED,
        )
      }

      if (Object.keys(orgAdminStatusCondition).length > 0) {
        if (obj._and) obj._and.push(orgAdminStatusCondition)
        else obj = { _and: [{ ...obj }, orgAdminStatusCondition] }
      }
    } else {
      const regularStatuses = filters?.statuses?.filter(s =>
        Object.values(Course_Status_Enum).includes(s as Course_Status_Enum),
      )
      if (regularStatuses?.length) {
        obj.status = {
          _in: regularStatuses as Course_Status_Enum[],
        }
      }

      if (
        filters?.statuses?.includes(AdminOnlyCourseStatus.CancellationRequested)
      ) {
        obj.cancellationRequest = { id: { _is_null: false } }
      }
    }

    if (role === RoleName.TRAINER) {
      if (obj.trainers?._and) {
        obj.trainers._and = [
          ...obj.trainers._and,
          { status: { _eq: Course_Invite_Status_Enum.Accepted } },
          { profile_id: { _eq: profile?.id } },
        ]
      } else {
        obj.trainers = {
          status: { _eq: Course_Invite_Status_Enum.Accepted },
          profile_id: { _eq: profile?.id },
        }
      }
    }

    return obj
  }, [
    acl,
    filters,
    orgAdminCourseStatusConditionsMap.AWAITING_GRADE,
    orgAdminCourseStatusConditionsMap.CANCELLATION_REQUESTED,
    orgAdminCourseStatusConditionsMap.CANCELLED,
    orgAdminCourseStatusConditionsMap.COMPLETED,
    orgAdminCourseStatusConditionsMap.SCHEDULED,
    orgId,
    organizationIds,
    profile?.id,
    role,
  ])

  const [{ data, error }, refetch] = useQuery<
    TrainerCoursesQuery,
    TrainerCoursesQueryVariables
  >({
    requestPolicy: 'cache-and-network',
    query: GET_TRAINER_COURSES,
    variables: {
      where,
      orderBy,
      ...(pagination
        ? {
            limit: pagination.perPage,
            offset: pagination.perPage * (pagination?.currentPage - 1),
          }
        : null),
      withArloRefId: acl.isInternalUser(),
      withParticipants: acl.isOrgAdmin(),
    },
  })

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      courses: data?.courses ?? [],
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate: () => refetch({ requestPolicy: 'network-only' }),
      total: data?.course_aggregate.aggregate?.count,
    }),
    [data, error, status, refetch],
  )
}

export function getOrderBy({
  by,
  dir,
}: Pick<Sorting, 'by' | 'dir'>): Course_Order_By {
  switch (by) {
    case 'name':
    case 'type':
    case 'createdAt':
      return { [by]: dir }
    case 'start':
      return { start_date: dir as Order_By }
    case 'end':
      return { end_date: dir as Order_By }
    default: {
      return { name: Order_By.Asc }
    }
  }
}
