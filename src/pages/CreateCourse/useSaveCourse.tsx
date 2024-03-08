import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { hasRenewalCycle } from '@app/components/CourseForm/helpers'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Expenses_Insert_Input,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  InsertCourseMutation,
  InsertCourseMutationVariables,
  Payment_Methods_Enum,
  RemoveCourseDraftMutation,
  RemoveCourseDraftMutationVariables,
  Course_Trainer_Insert_Input,
} from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'
import { shouldGoIntoExceptionApproval } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { MUTATION as INSERT_COURSE_MUTATION } from '@app/queries/courses/insert-course'
import { QUERY as REMOVE_COURSE_DRAFT } from '@app/queries/courses/remove-course-draft'
import { isModeratorNeeded } from '@app/rules/trainers'
import {
  BildStrategies,
  CourseExpenseType,
  Currency,
  ExpensesInput,
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

export type SaveCourse = () => Promise<
  | {
      id: string
      hasExceptions?: boolean
      courseCode?: string
      orderId?: string
    }
  | undefined
>

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
  const { setDateTimeTimeZone } = useTimeZones()

  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const { profile, acl } = useAuth()
  const { id: draftId } = useParams()
  const [{ error: insertError }, insertCourse] = useMutation<
    InsertCourseMutation,
    InsertCourseMutationVariables
  >(INSERT_COURSE_MUTATION)
  const [{ error: draftError }, removeCourseDraft] = useMutation<
    RemoveCourseDraftMutation,
    RemoveCourseDraftMutationVariables
  >(REMOVE_COURSE_DRAFT)

  const saveCourse = useCallback<SaveCourse>(async () => {
    const isBild = courseData?.accreditedBy === Accreditors_Enum.Bild
    const isOpenCourse = courseData?.type === Course_Type_Enum.Open
    const isClosedCourse = courseData?.type === Course_Type_Enum.Closed

    if (courseData) {
      setSavingStatus(LoadingStatus.FETCHING)

      const needsModerator = isModeratorNeeded({
        courseLevel: courseData.courseLevel,
        courseType: courseData.type,
        isReaccreditation: courseData.reaccreditation,
      })

      const hasModerator = trainers.find(
        t => t.type === Course_Trainer_Type_Enum.Moderator
      )

      const leadTrainerMissing =
        trainers.filter(t => t.type === Course_Trainer_Type_Enum.Leader)
          .length === 0
      const approveExceptions =
        !(isBild && courseData.type === Course_Type_Enum.Indirect) &&
        exceptions.length > 0 &&
        shouldGoIntoExceptionApproval(acl, courseData.type)

      const status = approveExceptions
        ? Course_Status_Enum.ExceptionsApprovalPending
        : leadTrainerMissing || (needsModerator && !hasModerator)
        ? Course_Status_Enum.TrainerMissing
        : Course_Status_Enum.TrainerPending

      const shouldInsertOrder =
        (courseData.type === Course_Type_Enum.Indirect &&
          courseData.blendedLearning) ||
        courseData.type === Course_Type_Enum.Closed

      const invoiceData =
        courseData.type === Course_Type_Enum.Indirect
          ? go1Licensing?.invoiceDetails
          : invoiceDetails

      const scheduleDateTime: (Date | string)[] = [
        courseData.startDateTime,
        courseData.endDateTime,
      ]

      if (courseData.timeZone) {
        const scheduleStarDateTime = setDateTimeTimeZone(
          courseData.startDateTime,
          courseData.timeZone
        )
        if (scheduleStarDateTime) scheduleDateTime[0] = scheduleStarDateTime

        const scheduleEndDateTime = setDateTimeTimeZone(
          courseData.endDateTime,
          courseData.timeZone
        )
        if (scheduleEndDateTime) scheduleDateTime[1] = scheduleEndDateTime
      }
      const orderToBeCreated = {
        registrants: [],
        billingEmail: invoiceData?.email,
        billingGivenName: invoiceData?.firstName,
        billingFamilyName: invoiceData?.surname,
        billingPhone: invoiceData?.phone,
        organizationId: invoiceData?.orgId,
        billingAddress: invoiceData?.billingAddress,
        clientPurchaseOrder: invoiceData?.purchaseOrder,
        paymentMethod: Payment_Methods_Enum.Invoice,
        attendeesQuantity:
          courseData.type === Course_Type_Enum.Closed
            ? courseData.maxParticipants
            : 0,
        currency: Currency.GBP,
        user: {
          fullName: profile?.fullName,
          email: profile?.email,
          phone: profile?.phone,
        },
        ...(courseData.source ? { source: courseData.source } : null),
        ...(courseData.salesRepresentative?.id
          ? {
              salesRepresentativeId: courseData.salesRepresentative?.id,
            }
          : null),
      }
      const { data: response } = await insertCourse({
        course: {
          /// TODO: Delete this after Arlo migration
          arloReferenceId: courseData.arloReferenceId,
          name: courseName,
          deliveryType: courseData.deliveryType,
          accreditedBy: courseData.accreditedBy,
          ...(courseData.type === Course_Type_Enum.Open
            ? { displayOnWebsite: courseData.displayOnWebsite }
            : null),
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
          ...([Course_Type_Enum.Closed, Course_Type_Enum.Open].includes(
            courseData.type
          )
            ? { price: courseData.price, conversion: courseData.conversion }
            : null),
          status,
          exceptionsPending:
            status === Course_Status_Enum.ExceptionsApprovalPending,
          ...(courseData.minParticipants
            ? { min_participants: courseData.minParticipants }
            : null),
          max_participants: courseData.maxParticipants,
          type: courseData.type,
          special_instructions: courseData.specialInstructions,
          parking_instructions: courseData.parkingInstructions,
          residingCountry: courseData.residingCountry ?? '',
          ...(courseData.organization
            ? { organization_id: courseData.organization.id }
            : null),
          ...(courseData.bookingContact?.profileId
            ? {
                bookingContactProfileId: courseData.bookingContact.profileId,
              }
            : null),
          ...(courseData.bookingContact?.email
            ? { bookingContactInviteData: courseData.bookingContact }
            : null),

          ...(courseData.organizationKeyContact?.profileId
            ? {
                organizationKeyContactProfileId:
                  courseData.organizationKeyContact.profileId,
              }
            : null),
          ...(courseData.organizationKeyContact?.email
            ? {
                organizationKeyContactInviteData:
                  courseData.organizationKeyContact,
              }
            : null),
          ...(hasRenewalCycle({
            courseType: courseData.type,
            startDate: courseData.startDate,
            courseLevel: courseData.courseLevel,
          })
            ? {
                renewalCycle: courseData.renewalCycle,
              }
            : null),
          ...(courseData.usesAOL
            ? {
                aolCostOfCourse: courseData.courseCost,
                aolCountry: courseData.aolCountry,
                aolRegion: courseData.aolRegion,
              }
            : null),
          trainers: {
            data: trainers.map(t => ({
              profile_id: t.profile_id,
              type: t.type,
              status: t.status,
            })) as Course_Trainer_Insert_Input[],
          },
          schedule: {
            data: [
              {
                start: scheduleDateTime[0] ?? courseData.startDateTime,
                end: scheduleDateTime[1] ?? courseData.endDateTime,
                virtualLink: [
                  Course_Delivery_Type_Enum.Virtual,
                  Course_Delivery_Type_Enum.Mixed,
                ].includes(courseData.deliveryType)
                  ? courseData.zoomMeetingUrl
                  : undefined,
                venue_id: courseData.venue?.id,
                virtualAccountId: courseData.zoomProfileId,
                timeZone: courseData.timeZone?.timeZoneId,
              },
            ],
          },
          ...(courseData.type !== Course_Type_Enum.Indirect
            ? {
                accountCode: courseData.accountCode,
                freeSpaces: courseData.freeSpaces,
              }
            : null),
          ...(courseData.type === Course_Type_Enum.Closed
            ? {
                expenses: { data: prepareExpensesData(expenses) },
              }
            : null),
          ...(shouldInsertOrder && invoiceData
            ? {
                [exceptions?.length && !acl.isAdmin()
                  ? 'tempOrders'
                  : 'orders']: {
                  data: [
                    {
                      ...(exceptions.length && !acl.isAdmin()
                        ? {
                            ...orderToBeCreated,
                          }
                        : {
                            order: {
                              data: { ...orderToBeCreated },
                            },
                            quantity: orderToBeCreated.attendeesQuantity,
                          }),
                    },
                  ],
                },
              }
            : null),
          ...(isOpenCourse || isClosedCourse
            ? {
                includeVAT: courseData.includeVAT,
                priceCurrency: courseData.priceCurrency,
              }
            : {}),
          ...(approveExceptions
            ? {
                courseExceptions: {
                  data: exceptions.map(exception => ({
                    exception,
                  })),
                },
              }
            : null),
        },
      })
      if (response?.insertCourse?.id) {
        setSavingStatus(LoadingStatus.SUCCESS)

        if (draftId) {
          const { error } = await removeCourseDraft({ draftId })
          if (error) {
            console.log({
              message: 'Error removing course draft',
              error,
            })
          }
        }

        const insertedCourse = response.insertCourse
        return {
          id: String(insertedCourse.id),
          courseCode: String(insertedCourse.course_code),
          hasExceptions: exceptions.length > 0 ?? false,
          orderId: insertedCourse.orders?.length
            ? insertedCourse.orders[0].order?.id
            : undefined,
        }
      }
    } else {
      setSavingStatus(LoadingStatus.ERROR)
    }
    if (draftError || insertError) {
      setSavingStatus(LoadingStatus.ERROR)
    }
  }, [
    courseData,
    draftError,
    insertError,
    trainers,
    exceptions,
    acl,
    go1Licensing?.invoiceDetails,
    invoiceDetails,
    insertCourse,
    courseName,
    expenses,
    profile?.fullName,
    profile?.email,
    profile?.phone,
    setDateTimeTimeZone,
    draftId,
    removeCourseDraft,
  ])

  return {
    savingStatus,
    saveCourse,
  }
}
