import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Course_Expenses_Insert_Input,
  Course_Status_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ResponseType,
  ParamsType,
  MUTATION,
} from '@app/queries/courses/insert-course'
import {
  CourseDeliveryType,
  CourseExpenseType,
  CourseType,
  ExpensesInput,
  TrainerInput,
  TransportMethod,
} from '@app/types'
import { generateCourseName, LoadingStatus } from '@app/util'

import { useCreateCourse } from './components/CreateCourseProvider'

const prepareExpensesData = (
  expenses: Record<string, ExpensesInput>
): Array<Course_Expenses_Insert_Input> => {
  const courseExpenses: Array<Course_Expenses_Insert_Input> = []

  for (const trainerId of Object.keys(expenses)) {
    const { transport, miscellaneous } = expenses[trainerId]

    let accommodationNightsTotal = 0

    transport
      .filter(t => t.method !== TransportMethod.NONE)
      .forEach(({ method, value, accommodationNights, flightDays }) => {
        if (accommodationNights && accommodationNights > 0) {
          accommodationNightsTotal += accommodationNights
        }

        const expense: Course_Expenses_Insert_Input = {
          trainerId,
          data: {
            type: CourseExpenseType.Transport,
            method,
          },
        }

        if (method === TransportMethod.CAR) {
          expense.data.mileage = value
        } else {
          expense.data.cost = value

          if (method === TransportMethod.FLIGHTS) {
            expense.data.flightDays = flightDays
          }
        }

        courseExpenses.push(expense)
      })

    if (accommodationNightsTotal > 0) {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Accommodation,
          accommodationNights: accommodationNightsTotal,
        },
      })
    }

    miscellaneous?.forEach(({ name, value }) => {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Miscellaneous,
          description: name as string,
          cost: value as number,
        },
      })
    })
  }

  return courseExpenses
}

export type SaveCourse = () => Promise<string | undefined>

export function useSaveCourse(): {
  savingStatus: LoadingStatus
  saveCourse: SaveCourse
} {
  const { courseData, expenses, trainers } = useCreateCourse()
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const fetcher = useFetcher()
  const { t } = useTranslation()

  const saveCourse = useCallback(async () => {
    try {
      if (courseData) {
        setSavingStatus(LoadingStatus.FETCHING)

        const status =
          courseData.type === CourseType.INDIRECT
            ? Course_Status_Enum.ApprovalPending
            : Course_Status_Enum.TrainerPending

        const response = await fetcher<ResponseType, ParamsType>(MUTATION, {
          course: {
            name: generateCourseName(
              {
                level: courseData.courseLevel,
                reaccreditation: courseData.reaccreditation,
              },
              t
            ),
            deliveryType: courseData.deliveryType,
            level: courseData.courseLevel,
            reaccreditation: courseData.reaccreditation,
            go1Integration: courseData.blendedLearning,
            status,
            ...(courseData.minParticipants
              ? { min_participants: courseData.minParticipants }
              : null),
            max_participants: courseData.maxParticipants,
            type: courseData.type,
            ...(courseData.organization
              ? { organization_id: courseData.organization.id }
              : null),
            ...(courseData.contactProfile
              ? { contactProfileId: courseData.contactProfile.id }
              : null),
            ...(courseData.usesAOL
              ? {
                  aolCostOfCourse: courseData.courseCost,
                  aolCountry: courseData.aolCountry,
                  aolRegion: courseData.aolRegion,
                }
              : null),
            trainers: {
              data: trainers.map((t: TrainerInput) => ({
                profile_id: t.profile_id,
                type: t.type,
                status: t.status,
              })),
            },
            schedule: {
              data: [
                {
                  start: courseData.startDateTime,
                  end: courseData.endDateTime,
                  virtualLink: [
                    CourseDeliveryType.VIRTUAL,
                    CourseDeliveryType.MIXED,
                  ].includes(courseData.deliveryType)
                    ? courseData.zoomMeetingUrl
                    : undefined,
                  venue_id: courseData.venue?.id,
                },
              ],
            },
            ...(courseData.type !== CourseType.INDIRECT
              ? {
                  accountCode: courseData.accountCode,
                  freeSpaces: courseData.freeSpaces,
                  salesRepresentativeId: courseData.salesRepresentative?.id,
                }
              : null),
            ...(courseData.type === CourseType.CLOSED
              ? {
                  expenses: {
                    data: prepareExpensesData(expenses),
                  },
                }
              : null),
          },
        })

        if (response.insertCourse.inserted.length === 1) {
          setSavingStatus(LoadingStatus.SUCCESS)

          const insertedId = response.insertCourse.inserted[0].id

          return insertedId
        }
      } else {
        setSavingStatus(LoadingStatus.ERROR)
      }
    } catch (err) {
      setSavingStatus(LoadingStatus.ERROR)
    }
  }, [courseData, expenses, fetcher, t, trainers])

  return {
    savingStatus,
    saveCourse,
  }
}
