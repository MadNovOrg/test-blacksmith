import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Expenses_Insert_Input,
  Course_Status_Enum,
  Payment_Methods_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/insert-course'
import {
  CourseDeliveryType,
  CourseExpenseType,
  CourseTrainerType,
  CourseType,
  Currency,
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
    let accommodationCostTotal = 0

    transport
      .filter(t => t.method !== TransportMethod.NONE)
      .forEach(
        ({
          method,
          value,
          accommodationCost,
          accommodationNights,
          flightDays,
        }) => {
          if (accommodationNights && accommodationNights > 0) {
            accommodationNightsTotal += accommodationNights ?? 0
            accommodationCostTotal += accommodationCost ?? 0
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
        }
      )

    if (accommodationNightsTotal > 0) {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Accommodation,
          accommodationCost: accommodationCostTotal,
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
  const { courseData, expenses, trainers, go1Licensing } = useCreateCourse()
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const fetcher = useFetcher()
  const { t } = useTranslation()
  const { profile } = useAuth()
  const { removeDraft } = useCourseDraft(
    profile?.id ?? '',
    courseData?.type ?? CourseType.OPEN
  )

  const { addSnackbarMessage } = useSnackbar()

  const saveCourse = useCallback(async () => {
    try {
      if (courseData) {
        setSavingStatus(LoadingStatus.FETCHING)

        const leadTrainerMissing =
          trainers.filter(t => t.type === CourseTrainerType.Leader).length === 0

        const status =
          courseData.type === CourseType.INDIRECT
            ? Course_Status_Enum.ApprovalPending
            : leadTrainerMissing
            ? Course_Status_Enum.TrainerMissing
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
            notes: courseData.notes,
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
              ? { expenses: { data: prepareExpensesData(expenses) } }
              : null),
            ...(courseData.type === CourseType.INDIRECT &&
            go1Licensing?.prices.amountDue
              ? {
                  orders: {
                    data: [
                      {
                        registrants: [], // we are buying Go1 licenses, not registering participants
                        billingEmail: go1Licensing.invoiceDetails.email,
                        billingGivenName: go1Licensing.invoiceDetails.firstName,
                        billingFamilyName: go1Licensing.invoiceDetails.surname,
                        billingPhone: go1Licensing.invoiceDetails.phone,
                        organizationId: go1Licensing.invoiceDetails.orgId,
                        billingAddress:
                          go1Licensing.invoiceDetails.billingAddress,
                        clientPurchaseOrder:
                          go1Licensing.invoiceDetails.purchaseOrder,
                        paymentMethod: Payment_Methods_Enum.Invoice,
                        quantity: 0, // it will be updated on the backend with the correct number of licenses depending on the org's allowance
                        currency: Currency.GBP,
                      },
                    ],
                  },
                }
              : null),
          },
        })

        if (response.insertCourse.inserted.length === 1) {
          setSavingStatus(LoadingStatus.SUCCESS)

          try {
            await removeDraft()
          } catch (error) {
            console.log({
              message: 'Error removing course draft',
              error,
            })
          }

          const insertedCourse = response.insertCourse.inserted[0]

          addSnackbarMessage('course-created', {
            label: t('pages.create-course.submitted-course', {
              code: insertedCourse.course_code,
            }),
          })

          return insertedCourse.id
        }
      } else {
        setSavingStatus(LoadingStatus.ERROR)
      }
    } catch (err) {
      setSavingStatus(LoadingStatus.ERROR)
    }
  }, [
    courseData,
    expenses,
    fetcher,
    go1Licensing,
    removeDraft,
    t,
    trainers,
    addSnackbarMessage,
  ])

  return {
    savingStatus,
    saveCourse,
  }
}
