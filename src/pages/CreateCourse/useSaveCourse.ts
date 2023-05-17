import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Accreditors_Enum,
  Course_Expenses_Insert_Input,
  Course_Status_Enum,
  Payment_Methods_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import { shouldGoIntoExceptionApproval } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/insert-course'
import {
  BildStrategies,
  CourseDeliveryType,
  CourseExpenseType,
  CourseTrainerType,
  CourseType,
  Currency,
  ExpensesInput,
  TrainerInput,
  TransportMethod,
} from '@app/types'
import { LoadingStatus } from '@app/util'

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
  const {
    courseData,
    expenses,
    trainers,
    go1Licensing,
    exceptions,
    courseName,
    invoiceDetails,
  } = useCreateCourse()
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const fetcher = useFetcher()
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const { removeDraft } = useCourseDraft(
    profile?.id ?? '',
    courseData?.type ?? CourseType.OPEN
  )

  const { addSnackbarMessage } = useSnackbar()

  const saveCourse = useCallback<SaveCourse>(async () => {
    const isBild = courseData?.accreditedBy === Accreditors_Enum.Bild

    try {
      if (courseData) {
        setSavingStatus(LoadingStatus.FETCHING)

        const leadTrainerMissing =
          trainers.filter(t => t.type === CourseTrainerType.Leader).length === 0
        const approveExceptions =
          !isBild &&
          exceptions.length > 0 &&
          shouldGoIntoExceptionApproval(acl, courseData.type)

        const status = approveExceptions
          ? Course_Status_Enum.ExceptionsApprovalPending
          : courseData.type === CourseType.INDIRECT
          ? Course_Status_Enum.ApprovalPending
          : leadTrainerMissing
          ? Course_Status_Enum.TrainerMissing
          : Course_Status_Enum.TrainerPending

        const shouldInsertOrder =
          (courseData.type === CourseType.INDIRECT &&
            courseData.blendedLearning) ||
          courseData.type === CourseType.CLOSED

        const invoiceData =
          courseData.type === CourseType.INDIRECT
            ? go1Licensing?.invoiceDetails
            : invoiceDetails

        const response = await fetcher<ResponseType, ParamsType>(MUTATION, {
          course: {
            name: courseName,
            deliveryType: courseData.deliveryType,
            accreditedBy: courseData.accreditedBy,
            bildStrategies: isBild
              ? {
                  data: Object.keys(courseData.bildStrategies).flatMap(s => {
                    const strategy = s as BildStrategies
                    if (courseData.bildStrategies[strategy]) {
                      return [{ strategyName: strategy }]
                    }
                    return []
                  }),
                }
              : undefined,
            level: courseData.courseLevel,
            reaccreditation: courseData.reaccreditation,
            go1Integration: courseData.blendedLearning,
            ...(isBild &&
            [CourseType.CLOSED, CourseType.OPEN].includes(courseData.type)
              ? { price: courseData.price, conversion: courseData.conversion }
              : null),
            status,
            ...(courseData.minParticipants
              ? { min_participants: courseData.minParticipants }
              : null),
            max_participants: courseData.maxParticipants,
            type: courseData.type,
            notes: courseData.notes,
            special_instructions: courseData.specialInstructions,
            parking_instructions: courseData.parkingInstructions,
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
                }
              : null),
            ...(courseData.type === CourseType.CLOSED
              ? {
                  expenses: { data: prepareExpensesData(expenses) },
                  source: courseData.source,
                  salesRepresentativeId: courseData.salesRepresentative?.id,
                }
              : null),
            ...(shouldInsertOrder && invoiceData
              ? {
                  [exceptions?.length && !acl.isAdmin()
                    ? 'tempOrders'
                    : 'orders']: {
                    data: [
                      {
                        registrants: [],
                        billingEmail: invoiceData.email,
                        billingGivenName: invoiceData.firstName,
                        billingFamilyName: invoiceData.surname,
                        billingPhone: invoiceData.phone,
                        organizationId: invoiceData.orgId,
                        billingAddress: invoiceData.billingAddress,
                        clientPurchaseOrder: invoiceData.purchaseOrder,
                        paymentMethod: Payment_Methods_Enum.Invoice,
                        quantity:
                          courseData.type === CourseType.CLOSED
                            ? courseData.maxParticipants
                            : 0,
                        currency: Currency.GBP,
                        user: {
                          fullName: profile?.fullName,
                          email: profile?.email,
                          phone: profile?.phone,
                        },
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
    trainers,
    exceptions.length,
    acl,
    go1Licensing?.invoiceDetails,
    invoiceDetails,
    fetcher,
    courseName,
    expenses,
    profile?.fullName,
    profile?.email,
    profile?.phone,
    addSnackbarMessage,
    t,
    removeDraft,
  ])

  return {
    savingStatus,
    saveCourse,
  }
}
