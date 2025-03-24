import { useFeatureFlagEnabled, useFeatureFlagPayload } from 'posthog-js/react'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  InsertCourseMutation,
  InsertCourseMutationVariables,
  Payment_Methods_Enum,
  RemoveCourseDraftMutation,
  RemoveCourseDraftMutationVariables,
  Course_Trainer_Insert_Input,
  Course_Level_Enum,
  Currency,
} from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'
import { ResourcePacksOptions } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/types'
import { COURSE_FORM_RESOURCE_PACKS_OPTION_TO_COURSE_FIELDS } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/utils'
import { hasRenewalCycle } from '@app/modules/course/components/CourseForm/helpers'
import { shouldGoIntoExceptionApproval } from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import {
  courseWithManualPrice,
  isCourseWithNoPrice,
} from '@app/modules/course/pages/CreateCourse/utils'
import { INSERT_COURSE_MUTATION } from '@app/modules/course/queries/insert-course'
import { REMOVE_COURSE_DRAFT } from '@app/modules/course/queries/remove-course-draft'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { isModeratorNeeded } from '@app/rules/trainers'
import { BildStrategies } from '@app/types'
import { LoadingStatus } from '@app/util'

import { transformBILDModules } from '../../CourseBuilder/components/BILDCourseBuilder/utils'
import { useCreateCourse } from '../components/CreateCourseProvider'

import { prepareExpensesDataANZ, prepareExpensesDataUK } from './utils'

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
  allowCreateCourse: boolean
  saveCourse: SaveCourse
} {
  const {
    bildModules,
    bildStrategyModules,
    courseData,
    courseName,
    curriculum,
    exceptions,
    expenses,
    invoiceDetails,
    workbookDeliveryAddress,
    trainers,
  } = useCreateCourse()
  const { setDateTimeTimeZone } = useTimeZones()
  const { isUKCountry, isAustraliaCountry } = useWorldCountries()
  const hideMCM = useFeatureFlagEnabled('hide-mcm')

  // ------------ Can Be Removed after 30/04/2025 ------------
  const waRenewalCyclesEnabled = useFeatureFlagEnabled(
    'wa-specific-renewal-cycles',
  )

  const waFlagPayload = useFeatureFlagPayload('wa-specific-renewal-cycles') as {
    wa_id: string
  }
  // ---------------------------------------------------------

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

  const { data: resourcePackCost } = useResourcePackPricing({
    course_type: courseData?.type as Course_Type_Enum,
    course_level: courseData?.courseLevel as Course_Level_Enum,
    course_delivery_type: courseData?.deliveryType as Course_Delivery_Type_Enum,
    reaccreditation: courseData?.reaccreditation ?? false,
    currency: courseData?.priceCurrency as string,
    pause: acl.isUK() || hideMCM,
  })
  const isBILDcourse = courseData?.accreditedBy === Accreditors_Enum.Bild
  const isOpenCourse = courseData?.type === Course_Type_Enum.Open
  const isClosedCourse = courseData?.type === Course_Type_Enum.Closed
  const isIndirectCourse = courseData?.type === Course_Type_Enum.Indirect

  const courseHasManualPrice = acl.isAustralia()
    ? !isAustraliaCountry(courseData?.residingCountry) || isIndirectCourse
    : courseWithManualPrice({
        accreditedBy: courseData?.accreditedBy as Accreditors_Enum,
        courseType: courseData?.type as Course_Type_Enum,
        courseLevel: courseData?.courseLevel as Course_Level_Enum,
        blendedLearning: Boolean(courseData?.blendedLearning),
        maxParticipants: courseData?.maxParticipants ?? 0,
        residingCountry: courseData?.residingCountry as WorldCountriesCodes,
      })

  const courseWithNoPrice = useMemo(() => {
    return isCourseWithNoPrice({
      courseType: courseData?.type as Course_Type_Enum,
      blendedLearning: Boolean(courseData?.blendedLearning),
    })
  }, [courseData?.blendedLearning, courseData?.type])

  const allowCreateCourse = useMemo(
    () =>
      courseHasManualPrice || Boolean(courseData?.price) || courseWithNoPrice,
    [courseHasManualPrice, courseData?.price, courseWithNoPrice],
  )

  const calculateVATrate = useMemo(() => {
    if (
      (isClosedCourse || isOpenCourse) &&
      !isUKCountry(courseData.residingCountry) &&
      !courseData.includeVAT
    ) {
      return 0
    }

    return 20
  }, [
    isClosedCourse,
    isOpenCourse,
    isUKCountry,
    courseData?.residingCountry,
    courseData?.includeVAT,
  ])

  // ------------ Can Be Removed after 30/04/2025 ------------
  const shouldSetWARenewalCycles = useMemo(() => {
    if (
      courseData?.type !== Course_Type_Enum.Indirect ||
      !waRenewalCyclesEnabled ||
      !courseData.organization
    )
      return false

    return (
      courseData?.organization.id === waFlagPayload?.wa_id ||
      courseData?.organization.main_organisation?.id === waFlagPayload?.wa_id
    )
  }, [
    courseData?.organization,
    courseData?.type,
    waFlagPayload?.wa_id,
    waRenewalCyclesEnabled,
  ])
  // ---------------------------------------------------------
  // 17.12.2024 - 112 cognitive complexity - tread with caution 😱
  const expensesCurrency = acl.isAustralia() ? Currency.Aud : Currency.Gbp
  const saveCourse = useCallback<SaveCourse>(async () => {
    if (courseData) {
      setSavingStatus(LoadingStatus.FETCHING)

      const needsModerator = isModeratorNeeded({
        courseLevel: courseData.courseLevel,
        courseType: courseData.type,
      })

      const hasModerator = trainers.find(
        t => t.type === Course_Trainer_Type_Enum.Moderator,
      )

      const leadTrainerMissing =
        trainers.filter(t => t.type === Course_Trainer_Type_Enum.Leader)
          .length === 0
      const approveExceptions =
        !(isBILDcourse && isIndirectCourse) &&
        exceptions.length > 0 &&
        shouldGoIntoExceptionApproval(acl, courseData.type)

      const status = () => {
        if (approveExceptions)
          return Course_Status_Enum.ExceptionsApprovalPending
        if (leadTrainerMissing || (needsModerator && !hasModerator))
          return Course_Status_Enum.TrainerMissing
        return Course_Status_Enum.TrainerPending
      }

      const shouldInsertOrder =
        (isIndirectCourse &&
          (courseData.blendedLearning || courseData.resourcePacksType)) ||
        isClosedCourse

      const shouldInsertTemporaryOrder =
        exceptions?.length &&
        ((isClosedCourse && !acl.isAdmin()) ||
          (isIndirectCourse && !acl.isTTAdmin()))

      const scheduleDateTime: (Date | string)[] = [
        courseData.startDateTime,
        courseData.endDateTime,
      ]

      if (courseData.timeZone) {
        const scheduleStarDateTime = setDateTimeTimeZone(
          courseData.startDateTime,
          courseData.timeZone.timeZoneId,
        )
        if (scheduleStarDateTime) scheduleDateTime[0] = scheduleStarDateTime

        const scheduleEndDateTime = setDateTimeTimeZone(
          courseData.endDateTime,
          courseData.timeZone.timeZoneId,
        )
        if (scheduleEndDateTime) scheduleDateTime[1] = scheduleEndDateTime
      }
      const orderToBeCreated = {
        registrants: [],
        billingEmail: invoiceDetails?.email,
        billingGivenName: invoiceDetails?.firstName,
        billingFamilyName: invoiceDetails?.surname,
        billingPhone: invoiceDetails?.phone,
        organizationId: invoiceDetails?.orgId,
        billingAddress: invoiceDetails?.billingAddress,
        clientPurchaseOrder: invoiceDetails?.purchaseOrder,
        paymentMethod: Payment_Methods_Enum.Invoice,
        workbookDeliveryAddress: workbookDeliveryAddress,

        attendeesQuantity:
          courseData.type === Course_Type_Enum.Closed
            ? courseData.maxParticipants
            : 0,
        currency:
          courseData.priceCurrency ??
          (acl.isAustralia() ? Currency.Aud : Currency.Gbp),
        vat: calculateVATrate,
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

      const requireResourcePacks =
        acl.isAustralia() && isIndirectCourse && courseData.resourcePacksType

      const { data: response } = await insertCourse({
        course: {
          /// TODO: Delete this after Arlo migration
          arloReferenceId: courseData.arloReferenceId,

          bildModules:
            courseData.accreditedBy === Accreditors_Enum.Bild &&
            (bildStrategyModules || bildModules)
              ? {
                  data: [
                    {
                      modules: transformBILDModules({
                        strategyModules: bildStrategyModules?.modules ?? {},
                        modules: bildModules ?? [],
                      }),
                    },
                  ],
                }
              : undefined,

          curriculum: curriculum?.curriculum ?? undefined,
          modulesDuration:
            courseData.accreditedBy === Accreditors_Enum.Icm
              ? curriculum?.modulesDuration ?? 0
              : bildStrategyModules?.modulesDuration ?? 0,

          name: courseName,
          deliveryType: courseData.deliveryType,
          accreditedBy: courseData.accreditedBy,
          ...(isOpenCourse
            ? { displayOnWebsite: courseData.displayOnWebsite }
            : null),
          bildStrategies: isBILDcourse
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
          is_tender: courseData.tenderCourse,
          go1Integration: courseData.blendedLearning,
          ...([Course_Type_Enum.Closed, Course_Type_Enum.Open].includes(
            courseData.type,
          )
            ? { conversion: courseData.conversion }
            : null),
          ...(requireResourcePacks
            ? COURSE_FORM_RESOURCE_PACKS_OPTION_TO_COURSE_FIELDS[
                courseData.resourcePacksType as ResourcePacksOptions
              ]
            : {}),
          status: status(),
          exceptionsPending:
            status() === Course_Status_Enum.ExceptionsApprovalPending,
          ...(courseData.minParticipants
            ? { min_participants: courseData.minParticipants }
            : null),
          max_participants: courseData.maxParticipants,
          ...(isClosedCourse && (acl.isUK() || !hideMCM)
            ? {
                free_course_materials: courseData.freeCourseMaterials,
              }
            : null),
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
            isAustralia: acl.isAustralia(),
          }) ||
          // ------------ shouldSetWARenewalCycles Can Be Removed after 30/04/2025 ------------
          shouldSetWARenewalCycles
            ? // ---------------------------------------------------------
              {
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
          ...(!isIndirectCourse
            ? {
                accountCode: courseData.accountCode,
                freeSpaces: courseData.freeSpaces,
              }
            : null),
          ...(isClosedCourse
            ? {
                expenses: {
                  data: acl.isUK()
                    ? prepareExpensesDataUK(
                        expenses,
                        true,
                        courseData.freeCourseMaterials ?? 0,
                        courseData.maxParticipants ?? 0,
                        (courseData.priceCurrency as Currency) ??
                          expensesCurrency,
                      )
                    : prepareExpensesDataANZ(
                        expenses,
                        !hideMCM,
                        courseData.freeCourseMaterials ?? 0,
                        courseData.maxParticipants ?? 0,
                        (courseData.priceCurrency as Currency) ??
                          expensesCurrency,
                        resourcePackCost?.anz_resource_packs_pricing[0]?.price,
                      ),
                },
              }
            : null),
          ...(shouldInsertOrder && invoiceDetails
            ? {
                [shouldInsertTemporaryOrder ? 'tempOrders' : 'orders']: {
                  data: [
                    {
                      ...(shouldInsertTemporaryOrder
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
              }
            : {}),
          priceCurrency: courseData.priceCurrency,
          ...(courseHasManualPrice
            ? { price: courseData.price ?? undefined }
            : undefined),
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
          hasExceptions: exceptions.length > 0,
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
    isBILDcourse,
    isIndirectCourse,
    exceptions,
    acl,
    isClosedCourse,
    invoiceDetails,
    workbookDeliveryAddress,
    calculateVATrate,
    profile?.fullName,
    profile?.email,
    profile?.phone,
    insertCourse,
    bildStrategyModules,
    bildModules,
    curriculum?.curriculum,
    curriculum?.modulesDuration,
    courseName,
    isOpenCourse,
    hideMCM,
    shouldSetWARenewalCycles,
    expenses,
    expensesCurrency,
    resourcePackCost?.anz_resource_packs_pricing,
    courseHasManualPrice,
    setDateTimeTimeZone,
    draftId,
    removeCourseDraft,
  ])

  return {
    savingStatus,
    allowCreateCourse,
    saveCourse,
  }
}
