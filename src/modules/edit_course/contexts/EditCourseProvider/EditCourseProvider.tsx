import * as Sentry from '@sentry/react'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { OperationContext, useMutation } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  ApproveCourseMutation,
  ApproveCourseMutationVariables,
  Course_Audit_Type_Enum,
  Course_Delivery_Type_Enum,
  Course_Exception_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Insert_Input,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  CourseLevel,
  Currency,
  Go1_History_Events_Enum,
  Go1_Licenses_History_Insert_Input,
  InsertCourseAuditMutation,
  InsertCourseAuditMutationVariables,
  InsertCourseOrderMutation,
  InsertCourseOrderMutationVariables,
  Maybe,
  NotifyCourseEditMutation,
  NotifyCourseEditMutationVariables,
  Order_Insert_Input,
  Payment_Methods_Enum,
  ReserveGo1LicensesMutation,
  ReserveGo1LicensesMutationVariables,
  ResourcePacksTypeEnum,
  UpdateCourseMutation,
  UpdateCourseMutationVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import useTimeZones from '@app/hooks/useTimeZones'
import { FormValues as TrainersFormValues } from '@app/modules/course/components/ChooseTrainers'
import { hasRenewalCycle } from '@app/modules/course/components/CourseForm/helpers'
import { useBildStrategies } from '@app/modules/course/hooks/useBildStrategies'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'
import { shouldGoIntoExceptionApproval } from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { APPROVE_COURSE_MUTATION } from '@app/modules/course_details/hooks/courses/approve-course'
import {
  BildStrategies,
  Course,
  CourseInput,
  CourseTrainerType,
  InviteStatus,
  InvoiceDetails,
  RoleName,
  ValidCourseInput,
} from '@app/types'
import {
  convertScheduleDateToLocalTime,
  courseToCourseInput,
  generateBildCourseName,
  generateCourseName,
  LoadingStatus,
  profileToInput,
  UKTimezone,
} from '@app/util'

import { FormValues as ReviewChangesFormValues } from '../../components/ReviewChangesModal'
import { INSERT_COURSE_AUDIT } from '../../queries/insert-course-audit'
import { NOTIFY_COURSE_EDIT } from '../../queries/notify-course-edit'
import {
  INSERT_COURSE_ORDER,
  RESERVE_GO1_LICENSES_MUTATION,
  UPDATE_COURSE_MUTATION,
  useReserveResourcePacks,
} from '../../queries/update-course'
import { CourseDiff, getChangedTrainers } from '../../utils/shared'

import { useUpdateContactResidingCountry } from './hooks/use-update-contact-residing-country'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean,
): asserts data is ValidCourseInput {
  if (!isValid) {
    throw new Error()
  }
}

/**
 * The Edit course context was created and is exclusively utilized for Indirect Blended Learning courses
 * when there's a need to purchase additional licenses or to increase the maximum number of participants during an edit.
 * @see https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-4228
 */
const EditCourseContext = React.createContext<
  | {
      additionalLicensesOrderOnly: boolean
      additionalRequiredResourcePacks: number
      additionalResourcePacksToPurchase: number
      autoapproved: boolean
      indirectCourseInvitesAfterCourseCompletion: Record<string, unknown>[]
      canGoToCourseBuilder: boolean
      courseData: CourseInput | null
      courseDataValid: boolean
      courseDiffs: CourseDiff[]
      courseExceptions: Course_Exception_Enum[]
      courseFormInput: CourseInput | undefined
      editCourseReviewInput: ReviewChangesFormValues | undefined
      fetching: boolean
      getCourseName: () => string
      hasError: boolean
      invoiceDetails: InvoiceDetails | undefined
      mutateCourse: (opts?: Partial<OperationContext> | undefined) => void
      preEditedCourse: Maybe<Course> | undefined
      requiredLicenses: number
      requireNewOrderForGo1Licenses: boolean
      requireNewOrderForResourcePacks: boolean
      saveAdditionalLicensesOrder: () => Promise<void>
      saveChanges: (reviewInput?: ReviewChangesFormValues) => Promise<void>
      setAdditionalLicensesOrderOnly: React.Dispatch<
        React.SetStateAction<boolean>
      >
      setAdditionalRequiredResourcePacks: React.Dispatch<
        React.SetStateAction<number>
      >
      setIndirectCourseInvitesAfterCourseCompletion: React.Dispatch<
        Record<string, unknown>[]
      >
      setCourseData: React.Dispatch<React.SetStateAction<CourseInput | null>>
      setCourseDataValid: React.Dispatch<React.SetStateAction<boolean>>
      setCourseExceptions: React.Dispatch<
        React.SetStateAction<Course_Exception_Enum[]>
      >
      setEditCourseReviewInput: React.Dispatch<
        React.SetStateAction<ReviewChangesFormValues | undefined>
      >
      setInvoiceDetails: React.Dispatch<InvoiceDetails | undefined>
      setRequiredLicenses: React.Dispatch<React.SetStateAction<number>>
      setTrainersData: React.Dispatch<TrainersFormValues | undefined>
      status: LoadingStatus
      trainersData: TrainersFormValues | undefined
    }
  | undefined
>(undefined)

export const EditCourseProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isIndirectCourseResourcePacksFlagEnabled = useFeatureFlagEnabled(
    'indirect-course-resource-packs',
  )

  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { acl, activeRole, profile } = useAuth()
  const { isUKCountry } = useWorldCountries()
  const { setDateTimeTimeZone } = useTimeZones()

  /**
   * @description Indicates whether the user was redirected straight to the licenses order page, bypassing the course edit.
   * This occurs when new invites require extra licenses.
   * This can only happen after the first completion of the Indirect blended learning course.
   */
  const [additionalLicensesOrderOnly, setAdditionalLicensesOrderOnly] =
    useState<boolean>(false)

  const [courseData, setCourseData] = useState<CourseInput | null>(null)
  const [courseDataValid, setCourseDataValid] = useState(false)
  const [courseExceptions, setCourseExceptions] = useState<
    Course_Exception_Enum[]
  >([])

  /**
   * @description The invitees are only established when redirected to the licenses order page,
   * due to the need for additional licenses after attempting to send new invites.
   * This can only happen after the first completion of the Indirect blended learning course.
   * @see additionalLicensesOrderOnly
   */
  const [
    indirectCourseInvitesAfterCourseCompletion,
    setIndirectCourseInvitesAfterCourseCompletion,
  ] = useState<Record<string, unknown>[]>([])

  const [editCourseReviewInput, setEditCourseReviewInput] = useState<
    ReviewChangesFormValues | undefined
  >()
  const [invoiceDetails, setInvoiceDetails] = useState<
    InvoiceDetails | undefined
  >()
  const [order, setOrder] = useState<Order_Insert_Input | null>(null)
  const [requiredLicenses, setRequiredLicenses] = useState(0)
  const [additionalRequiredResourcePacks, setAdditionalRequiredResourcePacks] =
    useState(0)
  const [
    additionalResourcePacksToPurchase,
    setAdditionalResourcePacksToPurchase,
  ] = useState(0)
  const [trainersData, setTrainersData] = useState<TrainersFormValues>()

  const { strategies } = useBildStrategies(
    Boolean(courseData?.accreditedBy === Accreditors_Enum.Bild),
  )

  const {
    data: courseInfo,
    mutate: mutateCourse,
    status,
  } = useCourse(id ?? '', {
    includeOrgLicenses: acl.canEditIndirectBLCourses(),
    includePendingInvitesCount: true,
    includeResourcePacks:
      acl.isAustralia() && acl.canCreateCourse(Course_Type_Enum.Indirect),
  })

  const isIndirectCourseResourcePacksEnabled = useMemo(() => {
    return Boolean(
      acl.isAustralia() &&
        isIndirectCourseResourcePacksFlagEnabled &&
        courseInfo?.course?.organization?.id &&
        courseInfo.course?.type === Course_Type_Enum.Indirect &&
        courseInfo.course?.resourcePacksType,
    )
  }, [
    acl,
    courseInfo?.course?.organization?.id,
    courseInfo?.course?.resourcePacksType,
    courseInfo?.course?.type,
    isIndirectCourseResourcePacksFlagEnabled,
  ])

  const coursesOrgResourcePacks = useOrgResourcePacks({
    orgId: courseInfo?.course?.organization?.id,
    pause: !isIndirectCourseResourcePacksEnabled,
  })

  const filteredOrgResourcePacks = useMemo(() => {
    if (courseInfo?.course?.resourcePacksType) {
      return {
        balance:
          coursesOrgResourcePacks.resourcePacks.balance[
            courseInfo?.course?.resourcePacksType
          ],
        reserved:
          coursesOrgResourcePacks.resourcePacks.reserved[
            courseInfo?.course?.resourcePacksType
          ],
      }
    }
  }, [
    courseInfo?.course?.resourcePacksType,
    coursesOrgResourcePacks.resourcePacks.balance,
    coursesOrgResourcePacks.resourcePacks.reserved,
  ])

  const preEditedCourse = courseInfo?.course

  const courseFormInput: CourseInput | undefined = useMemo(() => {
    return preEditedCourse ? courseToCourseInput(preEditedCourse) : undefined
  }, [preEditedCourse])

  const canGoToCourseBuilder =
    activeRole === RoleName.TRAINER &&
    preEditedCourse?.accreditedBy === Accreditors_Enum.Icm &&
    preEditedCourse?.type === Course_Type_Enum.Indirect

  useEffect(() => {
    if (invoiceDetails) {
      const {
        billingAddress,
        email,
        firstName,
        phone,
        purchaseOrder,
        surname,
        orgId,
      } = invoiceDetails

      const orderToBeCreated: Order_Insert_Input = {
        attendeesQuantity: 0,
        billingAddress: billingAddress,
        billingEmail: email,
        billingFamilyName: surname,
        billingGivenName: firstName,
        billingPhone: phone,
        clientPurchaseOrder: purchaseOrder,
        currency:
          preEditedCourse?.priceCurrency ??
          (acl.isAustralia() ? Currency.Aud : Currency.Gbp),
        organizationId: orgId,
        paymentMethod: Payment_Methods_Enum.Invoice,
        registrants: [],
        user: {
          fullName: profile?.fullName,
          email: profile?.email,
          phone: profile?.phone,
        },
        vat: 20,
      }

      setOrder(orderToBeCreated)
    }
  }, [
    acl,
    invoiceDetails,
    preEditedCourse?.priceCurrency,
    profile?.email,
    profile?.fullName,
    profile?.phone,
  ])

  const [, approveCourse] = useMutation<
    ApproveCourseMutation,
    ApproveCourseMutationVariables
  >(APPROVE_COURSE_MUTATION)

  const [{ fetching: insertingAudit, error: errorOnAuditInsert }, insertAudit] =
    useMutation<InsertCourseAuditMutation, InsertCourseAuditMutationVariables>(
      INSERT_COURSE_AUDIT,
    )

  const [
    { fetching: insertingOrder, error: errorOnOrderInsert },
    insertCourseOrder,
  ] = useMutation<
    InsertCourseOrderMutation,
    InsertCourseOrderMutationVariables
  >(INSERT_COURSE_ORDER)

  const [
    { fetching: notifyCourseEditLoading, error: errorOnEditNotify },
    notifyCourseEdit,
  ] = useMutation<NotifyCourseEditMutation, NotifyCourseEditMutationVariables>(
    NOTIFY_COURSE_EDIT,
  )

  const [, reserveGo1Licenses] = useMutation<
    ReserveGo1LicensesMutation,
    ReserveGo1LicensesMutationVariables
  >(RESERVE_GO1_LICENSES_MUTATION)

  const [, reserveResourcePacks] = useReserveResourcePacks()

  const [{ fetching: updatingCourse, error: errorOnUpdate }, updateCourse] =
    useMutation<UpdateCourseMutation, UpdateCourseMutationVariables>(
      UPDATE_COURSE_MUTATION,
    )

  const { editContactResidingCountry } = useUpdateContactResidingCountry({
    courseData,
    initialCourseData: preEditedCourse,
  })

  const hasError = Boolean(
    errorOnAuditInsert ||
      errorOnEditNotify ||
      errorOnOrderInsert ||
      errorOnUpdate,
  )

  const fetching =
    insertingAudit ||
    insertingOrder ||
    notifyCourseEditLoading ||
    updatingCourse

  const isBILDCourse = courseData?.accreditedBy === Accreditors_Enum.Bild
  const isClosedTypeCourse = courseData?.type === Course_Type_Enum.Closed
  const isOpenTypeCourse = courseData?.type === Course_Type_Enum.Open

  const isIndirectBlendedLearningCourse =
    preEditedCourse?.type === Course_Type_Enum.Indirect &&
    preEditedCourse?.go1Integration

  const go1Licenses =
    preEditedCourse?.organization?.mainOrganizationLicenses?.go1Licenses ??
    preEditedCourse?.organization?.go1Licenses ??
    0

  const isAdditionalBlendedLearningLicensesRequired = useMemo(() => {
    if (
      !courseData?.maxParticipants ||
      preEditedCourse?.status === Course_Status_Enum.ExceptionsApprovalPending
    )
      return false

    const licenses = Math.max(
      (courseData?.maxParticipants ?? 0) -
        Math.abs(preEditedCourse?.coursesReservedLicenses ?? 0),
      0,
    )

    if (isIndirectBlendedLearningCourse && licenses > 0) {
      setRequiredLicenses(licenses)
    }

    return isIndirectBlendedLearningCourse && licenses > 0
  }, [
    courseData?.maxParticipants,
    isIndirectBlendedLearningCourse,
    preEditedCourse?.coursesReservedLicenses,
    preEditedCourse?.status,
  ])

  const isAdditionalResourcePacksRequired = useMemo(() => {
    if (
      !isIndirectCourseResourcePacksEnabled ||
      filteredOrgResourcePacks?.balance === undefined
    )
      return false

    const coursesReservedNumberOfResourcePacks =
      preEditedCourse?.reservedResourcePacks ?? 0

    const newNumberOfMaxParticipants = courseData?.maxParticipants ?? 0

    const additionalResourcePacks =
      newNumberOfMaxParticipants - coursesReservedNumberOfResourcePacks

    if (additionalResourcePacks > 0) {
      setAdditionalRequiredResourcePacks(additionalResourcePacks)
      return true
    }

    return false
  }, [
    courseData?.maxParticipants,
    filteredOrgResourcePacks?.balance,
    isIndirectCourseResourcePacksEnabled,
    preEditedCourse?.reservedResourcePacks,
  ])

  const requireNewOrderForGo1Licenses = useMemo(() => {
    return (
      isAdditionalBlendedLearningLicensesRequired &&
      isIndirectBlendedLearningCourse &&
      requiredLicenses > 0 &&
      requiredLicenses - go1Licenses > 0
    )
  }, [
    go1Licenses,
    isAdditionalBlendedLearningLicensesRequired,
    isIndirectBlendedLearningCourse,
    requiredLicenses,
  ])

  const requireNewOrderForResourcePacks = useMemo(() => {
    if (
      isAdditionalResourcePacksRequired &&
      additionalRequiredResourcePacks > 0
    ) {
      const insufficientNumberOfResourcePacks =
        additionalRequiredResourcePacks -
          (filteredOrgResourcePacks?.balance ?? 0) >
        0

      if (insufficientNumberOfResourcePacks) {
        setAdditionalResourcePacksToPurchase(
          additionalRequiredResourcePacks -
            (filteredOrgResourcePacks?.balance ?? 0),
        )

        return true
      }
    }

    setAdditionalResourcePacksToPurchase(0)
    return false
  }, [
    additionalRequiredResourcePacks,
    filteredOrgResourcePacks?.balance,
    isAdditionalResourcePacksRequired,
  ])

  const [courseDiffs, autoapproved]: [CourseDiff[], boolean] = useMemo(() => {
    const diffs: CourseDiff[] = []
    let approved = true

    if (
      preEditedCourse?.schedule[0].start &&
      preEditedCourse.schedule[0].end &&
      courseData?.startDateTime &&
      courseData.endDateTime
    ) {
      const { start: oldStart, end: oldEnd } = convertScheduleDateToLocalTime(
        preEditedCourse.schedule[0].start,
        preEditedCourse.schedule[0].end,
        preEditedCourse.schedule[0].timeZone,
      )

      const newStart = courseData.startDateTime
      const newEnd = courseData.endDateTime

      if (
        oldStart.getTime() !== newStart.getTime() ||
        oldEnd.getTime() !== newEnd.getTime()
      ) {
        diffs.push({
          type: 'date',
          oldValue: [oldStart, oldEnd],
          newValue: [newStart, newEnd],
        })

        approved = false
      }
    }

    return [diffs, approved]
  }, [
    courseData?.endDateTime,
    courseData?.startDateTime,
    preEditedCourse?.schedule,
  ])

  const mustApproveExceptions = preEditedCourse
    ? preEditedCourse.status === Course_Status_Enum.ExceptionsApprovalPending &&
      !shouldGoIntoExceptionApproval(acl, preEditedCourse?.type)
    : false

  const getCourseName = useCallback(() => {
    return courseData?.accreditedBy === Accreditors_Enum.Bild
      ? generateBildCourseName(
          strategies,
          {
            bildStrategies: courseData.bildStrategies as Record<
              BildStrategies,
              boolean
            >,
            conversion: courseData.conversion,
            level: courseData.courseLevel as Course_Level_Enum,
            reaccreditation: courseData.reaccreditation,
          },
          t,
        )
      : generateCourseName(
          {
            level: courseData?.courseLevel as Course_Level_Enum,
            reaccreditation: courseData?.reaccreditation as boolean,
          },
          t,
          acl.isUK(),
        )
  }, [courseData, strategies, t, acl])

  const getGo1LicensesReserveAudit: () => Go1_Licenses_History_Insert_Input =
    useCallback(
      () => ({
        balance: go1Licenses - requiredLicenses,
        change: -requiredLicenses,
        event: Go1_History_Events_Enum.LicensesReserved,
        org_id:
          preEditedCourse?.organization?.main_organisation?.id ??
          preEditedCourse?.organization?.id,
        payload: {
          courseCode: preEditedCourse?.course_code,
          courseId: preEditedCourse?.id,
          courseStartDate:
            courseData?.startDateTime ??
            preEditedCourse?.dates.aggregate.start.date,
          invokedBy: profile?.fullName,
          invokedById: profile?.id,
        },
        reservedBalance:
          (preEditedCourse?.organization?.mainOrganizationLicenses
            ?.reservedGo1Licenses ??
            preEditedCourse?.organization?.reservedGo1Licenses ??
            0) + requiredLicenses,
      }),
      [
        courseData?.startDateTime,
        go1Licenses,
        preEditedCourse?.course_code,
        preEditedCourse?.dates.aggregate.start.date,
        preEditedCourse?.id,
        preEditedCourse?.organization?.id,
        preEditedCourse?.organization?.mainOrganizationLicenses
          ?.reservedGo1Licenses,
        preEditedCourse?.organization?.main_organisation?.id,
        preEditedCourse?.organization?.reservedGo1Licenses,
        profile?.fullName,
        profile?.id,
        requiredLicenses,
      ],
    )

  const reserveAdditionalLicenses = useCallback(async () => {
    const orgToManageGo1Licenses =
      preEditedCourse?.organization?.main_organisation?.id ??
      preEditedCourse?.organization?.id

    if (
      orgToManageGo1Licenses &&
      isAdditionalBlendedLearningLicensesRequired &&
      !requireNewOrderForGo1Licenses
    ) {
      try {
        await reserveGo1Licenses({
          go1LicensesOrgIdManage: orgToManageGo1Licenses,
          decrementGo1LicensesFromOrganizationPool: -requiredLicenses,
          incrementGo1LicensesFromOrganizationPool: requiredLicenses,
          reserveGo1LicensesAudit: [getGo1LicensesReserveAudit()],
        })
      } catch (err) {
        Sentry.captureException(err)
      }
    }
  }, [
    getGo1LicensesReserveAudit,
    isAdditionalBlendedLearningLicensesRequired,
    preEditedCourse?.organization?.id,
    preEditedCourse?.organization?.main_organisation?.id,
    requireNewOrderForGo1Licenses,
    requiredLicenses,
    reserveGo1Licenses,
  ])

  const reserveAdditionalResourcePacks = useCallback(
    async (courseExceptionsApprovalPending: boolean) => {
      if (courseExceptionsApprovalPending) return

      if (
        preEditedCourse?.organization?.id &&
        additionalRequiredResourcePacks &&
        !additionalResourcePacksToPurchase
      ) {
        try {
          await reserveResourcePacks({
            input: {
              courseId: preEditedCourse.id,
              orgId: preEditedCourse.organization.id,
              quantity: additionalRequiredResourcePacks,
              resourcePackType:
                preEditedCourse.resourcePacksType as unknown as ResourcePacksTypeEnum,
            },
          })
        } catch (err) {
          Sentry.captureException(err)
        }
      }
    },
    [
      additionalRequiredResourcePacks,
      additionalResourcePacksToPurchase,
      preEditedCourse?.id,
      preEditedCourse?.organization?.id,
      preEditedCourse?.resourcePacksType,
      reserveResourcePacks,
    ],
  )

  // 17.12.2024 - 86 cognitive complexity - tread with caution
  const saveChanges = useCallback(
    async (reviewInput?: ReviewChangesFormValues) => {
      if (!courseData || !preEditedCourse || !trainersData) return

      assertCourseDataValid(courseData, courseDataValid)

      // TRAINERS
      const mappedTrainers = new Map(
        preEditedCourse?.trainers?.map(trainer => [
          trainer.profile.id,
          trainer,
        ]),
      )

      const trainers = [
        ...trainersData.assist.map(t => ({
          ...profileToInput(
            preEditedCourse,
            Course_Trainer_Type_Enum.Assistant,
          )(t),
          status: mappedTrainers.get(t.id)?.status,
        })),
        ...trainersData.moderator.map(t => ({
          ...profileToInput(
            preEditedCourse,
            Course_Trainer_Type_Enum.Moderator,
          )(t),
          status: mappedTrainers.get(t.id)?.status,
        })),
      ]

      if (!acl.canAssignLeadTrainer() && profile) {
        trainers.push({
          course_id: preEditedCourse.id,
          profile_id: profile.id,
          type: Course_Trainer_Type_Enum.Leader,
          status: InviteStatus.ACCEPTED,
        })
      } else {
        trainers.push(
          ...trainersData.lead.map(t => ({
            ...profileToInput(
              preEditedCourse,
              Course_Trainer_Type_Enum.Leader,
            )(t),
            status: mappedTrainers.get(t.id)?.status,
          })),
        )
      }

      const [trainersToAdd, trainersToDelete] = getChangedTrainers(
        preEditedCourse.trainers?.map(t => ({
          profile_id: t.profile.id,
          type: t.type,
          status: t.status,
        })) ?? [],
        trainers.map(t => ({ profile_id: t.profile_id, type: t.type })),
      )

      // VENUE
      const newVenueId =
        [
          Course_Delivery_Type_Enum.F2F,
          Course_Delivery_Type_Enum.Mixed,
        ].includes(courseData.deliveryType) && courseData.venue
          ? courseData.venue.id
          : null

      // STATUS
      const status =
        courseExceptions.length > 0 &&
        shouldGoIntoExceptionApproval(acl, preEditedCourse.type)
          ? Course_Status_Enum.ExceptionsApprovalPending
          : null

      // DATE & TIME
      const scheduledDateTime: (Date | string)[] = [
        courseData.startDateTime,
        courseData.endDateTime,
      ]

      if (courseData.timeZone) {
        const scheduledStarDateTime = setDateTimeTimeZone(
          courseData.startDateTime,
          courseData.timeZone.timeZoneId,
        )
        if (scheduledStarDateTime) scheduledDateTime[0] = scheduledStarDateTime

        const scheduledEndDateTime = setDateTimeTimeZone(
          courseData.endDateTime,
          courseData.timeZone.timeZoneId,
        )
        if (scheduledEndDateTime) scheduledDateTime[1] = scheduledEndDateTime
      }

      const updateCourseInput = {
        courseId: preEditedCourse.id,
        courseInput: {
          ...(acl.isInternalUser()
            ? { arloReferenceId: courseData.arloReferenceId ?? '' }
            : null),
          bookingContactProfileId: courseData.bookingContact?.profileId ?? null,
          ...(courseData.bookingContact?.email
            ? { bookingContactInviteData: courseData.bookingContact }
            : null),
          deliveryType: courseData.deliveryType,
          exceptionsPending:
            status === Course_Status_Enum.ExceptionsApprovalPending,
          freeSpaces: courseData.freeSpaces,
          free_course_materials: courseData.freeCourseMaterials ?? 0,
          go1Integration: courseData.blendedLearning,
          max_participants: courseData.maxParticipants,
          min_participants: courseData.minParticipants,
          name: getCourseName(),
          organization_id: courseData.organization?.id ?? null,
          organizationKeyContactProfileId:
            courseData.organizationKeyContact?.profileId ?? null,
          ...(courseData.organizationKeyContact?.email
            ? {
                organizationKeyContactInviteData:
                  courseData.organizationKeyContact,
              }
            : null),
          parking_instructions: courseData.parkingInstructions,
          reaccreditation: courseData.reaccreditation,
          renewalCycle: hasRenewalCycle({
            courseLevel: courseData.courseLevel,
            courseType: courseData.type,
            isAustralia: acl.isAustralia(),
            startDate: courseData.startDate,
          })
            ? courseData.renewalCycle
            : null,
          residingCountry: courseData.residingCountry,
          special_instructions: courseData.specialInstructions,
          status,

          ...(courseData.usesAOL
            ? {
                aolCostOfCourse: courseData.courseCost,
                aolCountry: courseData.aolCountry,
                aolRegion: courseData.aolRegion,
              }
            : {
                aolCostOfCourse: null,
                aolCountry: null,
                aolRegion: null,
              }),

          ...(isClosedTypeCourse
            ? {
                free_course_materials: courseData.freeCourseMaterials ?? 0,
                includeVAT:
                  isBILDCourse || !isUKCountry(courseData.residingCountry)
                    ? courseData.includeVAT
                    : null,
                price:
                  isBILDCourse || !isUKCountry(courseData.residingCountry)
                    ? courseData.price
                    : null,
                priceCurrency:
                  isBILDCourse || !isUKCountry(courseData.residingCountry)
                    ? courseData.priceCurrency
                    : null,
              }
            : {}),

          ...(isOpenTypeCourse
            ? {
                displayOnWebsite: courseData.displayOnWebsite,
                price: courseData.price,
                priceCurrency: !isUKCountry(courseData.residingCountry)
                  ? courseData.priceCurrency
                  : null,
                includeVAT: !isUKCountry(courseData.residingCountry)
                  ? courseData.includeVAT
                  : null,
              }
            : {}),
        },
        orderInput: {
          salesRepresentativeId: courseData.salesRepresentative?.id,
          source: courseData.source,
        },
        scheduleId: preEditedCourse?.schedule[0].id,
        scheduleInput: {
          end: scheduledDateTime[1],
          start: scheduledDateTime[0],
          timeZone: courseData.timeZone?.timeZoneId,
          venue_id: newVenueId,
          virtualAccountId: courseData.zoomProfileId,
        },
        ...(status === Course_Status_Enum.ExceptionsApprovalPending
          ? {
              exceptions: courseExceptions,
              exceptionsInput: courseExceptions.map(exception => ({
                courseId: preEditedCourse.id,
                exception,
              })),
            }
          : null),
        trainers: trainersToAdd.map(t => ({
          ...t,
          course_id: preEditedCourse.id,
        })) as Course_Trainer_Insert_Input,
        trainersToDelete,
      }

      try {
        const resp = await updateCourse({
          ...updateCourseInput,
          ...(order
            ? {
                ...(status === Course_Status_Enum.ExceptionsApprovalPending
                  ? {
                      temporaryOrderInsertInput: [
                        {
                          courseId: preEditedCourse.id,
                          ...order,
                          attendeesQuantity: 0,
                        },
                      ],
                    }
                  : {
                      ordersInsertInput: [
                        {
                          course_id: preEditedCourse.id,
                          order: {
                            data: {
                              ...order,
                              attendeesQuantity: 0,
                              invitees:
                                indirectCourseInvitesAfterCourseCompletion.length
                                  ? indirectCourseInvitesAfterCourseCompletion
                                  : null,
                            },
                          },
                        },
                      ],
                    }),
              }
            : null),
        })

        if (resp.data?.updateCourse?.id) {
          if (mustApproveExceptions) {
            await approveCourse({
              input: { courseId: preEditedCourse.id, reason: '' },
            })
          }

          await reserveAdditionalLicenses()

          await reserveAdditionalResourcePacks(
            status === Course_Status_Enum.ExceptionsApprovalPending,
          )

          await editContactResidingCountry()

          if (courseDiffs.length) {
            const dateChanged = courseDiffs.find(d => d.type === 'date')

            if (!dateChanged) {
              return
            }

            const payload = {
              newEndDate: setDateTimeTimeZone(
                courseData.endDateTime,
                preEditedCourse.schedule[0].timeZone ?? UKTimezone,
              ),
              newStartDate: setDateTimeTimeZone(
                courseData.startDateTime,
                preEditedCourse.schedule[0].timeZone ?? UKTimezone,
              ),
              oldEndDate: preEditedCourse.schedule[0].end,
              oldStartDate: preEditedCourse.schedule[0].start,
              reason: (editCourseReviewInput ?? reviewInput)?.reason ?? '',
              ...(preEditedCourse.type === Course_Type_Enum.Closed &&
              (editCourseReviewInput || reviewInput)
                ? {
                    customFee: (
                      (editCourseReviewInput ??
                        reviewInput) as ReviewChangesFormValues
                    ).customFee,
                    feeType: (
                      (editCourseReviewInput ??
                        reviewInput) as ReviewChangesFormValues
                    ).feeType,
                  }
                : null),
            }

            await insertAudit({
              object: {
                authorized_by: profile?.id,
                course_id: preEditedCourse.id,
                payload,
                type: Course_Audit_Type_Enum.Reschedule,
                xero_invoice_number:
                  preEditedCourse.orders && preEditedCourse.orders.length > 0
                    ? preEditedCourse.orders[0]?.order.xeroInvoiceNumber
                    : null,
              },
            })
          }

          await notifyCourseEdit({
            oldCourse: {
              courseId: preEditedCourse.id,
              endDate: preEditedCourse.dates.aggregate.end.date,
              level: preEditedCourse.level as unknown as CourseLevel,
              parkingInstructions: preEditedCourse.parking_instructions || '',
              specialInstructions: preEditedCourse.special_instructions || '',
              startDate: preEditedCourse.dates.aggregate.start.date,
              venueId: preEditedCourse.schedule[0].venue?.id || null,
              virtualLink: preEditedCourse.schedule[0].virtualLink || null,
            },
            oldTrainers:
              preEditedCourse.trainers?.map(trainer => ({
                id: trainer.profile.id,
                type: trainer.type as CourseTrainerType,
              })) || [],
          })

          mutateCourse()

          canGoToCourseBuilder
            ? navigate(`/courses/${courseFormInput?.id}/modules`, {
                state: { editMode: true },
              })
            : navigate(`/courses/${preEditedCourse.id}/details`)
        }
      } catch (err) {
        console.error(err)
      }

      setCourseData(null)
    },
    [
      acl,
      approveCourse,
      canGoToCourseBuilder,
      courseData,
      courseDataValid,
      courseDiffs,
      courseExceptions,
      courseFormInput?.id,
      editContactResidingCountry,
      editCourseReviewInput,
      getCourseName,
      indirectCourseInvitesAfterCourseCompletion,
      insertAudit,
      isBILDCourse,
      isClosedTypeCourse,
      isOpenTypeCourse,
      isUKCountry,
      mustApproveExceptions,
      mutateCourse,
      navigate,
      notifyCourseEdit,
      order,
      preEditedCourse,
      profile,
      reserveAdditionalLicenses,
      reserveAdditionalResourcePacks,
      setDateTimeTimeZone,
      trainersData,
      updateCourse,
    ],
  )

  /**
   * @description This method is used exclusively when a user is redirected to the additional licenses order page after attempting to invite new participants,
   * but there aren’t enough Go1 licenses available.
   * This scenario can occur only for Indirect Blended Learning courses following the initial course completion.
   */
  const saveAdditionalLicensesOrder = useCallback(async () => {
    if (!additionalLicensesOrderOnly || !order) return

    const orderInput = {
      ...order,
      attendeesQuantity: 0,
      invitees: indirectCourseInvitesAfterCourseCompletion.length
        ? indirectCourseInvitesAfterCourseCompletion.map(invitee => ({
            ...invitee,
            inviter_id: profile?.id,
          }))
        : null,
    }

    await insertCourseOrder({
      orderInput: {
        course_id: preEditedCourse?.id,
        order: {
          data: orderInput,
        },
      },
    })

    navigate(`/courses/${preEditedCourse?.id}/details`, {
      state: {
        invitees: indirectCourseInvitesAfterCourseCompletion.map(
          invitee => invitee.email,
        ),
      },
    })
  }, [
    additionalLicensesOrderOnly,
    indirectCourseInvitesAfterCourseCompletion,
    insertCourseOrder,
    navigate,
    order,
    preEditedCourse?.id,
    profile?.id,
  ])

  const value = useMemo(
    () => ({
      additionalLicensesOrderOnly,
      additionalRequiredResourcePacks,
      additionalResourcePacksToPurchase,
      autoapproved,
      canGoToCourseBuilder,
      courseData,
      courseDataValid,
      courseDiffs,
      courseExceptions,
      courseFormInput,
      editCourseReviewInput,
      fetching,
      getCourseName,
      hasError,
      indirectCourseInvitesAfterCourseCompletion,
      invoiceDetails,
      mutateCourse,
      preEditedCourse,
      requiredLicenses,
      requireNewOrderForGo1Licenses,
      requireNewOrderForResourcePacks,
      saveAdditionalLicensesOrder,
      saveChanges,
      setAdditionalLicensesOrderOnly,
      setAdditionalRequiredResourcePacks,
      setCourseData,
      setCourseDataValid,
      setCourseExceptions,
      setEditCourseReviewInput,
      setIndirectCourseInvitesAfterCourseCompletion,
      setInvoiceDetails,
      setRequiredLicenses,
      setTrainersData,
      status,
      trainersData,
    }),
    [
      additionalLicensesOrderOnly,
      additionalRequiredResourcePacks,
      additionalResourcePacksToPurchase,
      autoapproved,
      canGoToCourseBuilder,
      courseData,
      courseDataValid,
      courseDiffs,
      courseExceptions,
      courseFormInput,
      editCourseReviewInput,
      fetching,
      getCourseName,
      hasError,
      indirectCourseInvitesAfterCourseCompletion,
      invoiceDetails,
      mutateCourse,
      preEditedCourse,
      requiredLicenses,
      requireNewOrderForGo1Licenses,
      requireNewOrderForResourcePacks,
      saveAdditionalLicensesOrder,
      saveChanges,
      status,
      trainersData,
    ],
  )

  return (
    <EditCourseContext.Provider value={value}>
      {children}
    </EditCourseContext.Provider>
  )
}

export function useEditCourse() {
  const context = useContext(EditCourseContext)

  if (context === undefined) {
    throw new Error('useEditCourse must be used within a EditCourseProvider')
  }

  return context
}
