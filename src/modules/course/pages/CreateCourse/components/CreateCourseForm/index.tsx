import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import omit from 'lodash-es/omit'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormState, UseFormReset, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  BildStrategy,
  Course_Delivery_Type_Enum,
  Course_Exception_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Course_Trainer_Type_Enum,
  SearchTrainer,
} from '@app/generated/graphql'
import { CourseForm } from '@app/modules/course/components/CourseForm'
import { SearchTrainers } from '@app/modules/course/components/SearchTrainers'
import { CourseExceptionsConfirmation } from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  isTrainersRatioNotMet,
} from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import useProfile from '@app/modules/profile/hooks/useProfile/useProfile'
import {
  CourseInput,
  InviteStatus,
  TrainerInput,
  TrainerRoleType,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import {
  LoadingStatus,
  bildStrategiesToArray,
  checkIsETA,
  checkIsEmployerAOL,
} from '@app/util'

import { useSaveCourse } from '../../hooks/useSaveCourse'
import { StepsEnum } from '../../types'
import { useCreateCourse } from '../CreateCourseProvider'
import { NoExceptionsDialog } from '../NoExceptionsDialog'

import { ConsentFlags, CourseFormCheckboxes } from './components/Checkboxes'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean,
): asserts data is ValidCourseInput {
  if (!isValid) {
    throw new Error()
  }
}

export const CreateCourseForm = () => {
  const {
    completeStep,
    courseData,
    courseType,
    setCourseData,
    setCurrentStepKey,
    setShowDraftConfirmationDialog,
    setTrainers,
    trainers,
  } = useCreateCourse()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isUKCountry } = useWorldCountries()

  const { savingStatus, allowCreateCourse } = useSaveCourse()
  const [assistants, setAssistants] = useState<SearchTrainer[]>([])
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()
  const isBILDcourse = courseData?.accreditedBy === Accreditors_Enum.Bild
  const isIndirectCourse = courseData?.type === Course_Type_Enum.Indirect
  const orgResourcePacksEnabled = useFeatureFlagEnabled('org-resource-packs')
  const [courseExceptions, setCourseExceptions] = useState<
    Course_Exception_Enum[]
  >([])
  const [displayNoCoursePriceError, setDisplayNoCoursePriceError] =
    useState<boolean>(false)

  const { certifications } = useProfile(profile?.id)
  const displayConnectFeeCondition =
    isIndirectCourse && isUKCountry(courseData?.residingCountry)

  const displayResourcePacksCondition = useMemo(
    () =>
      Boolean(orgResourcePacksEnabled) && acl.isAustralia() && isIndirectCourse,
    [acl, isIndirectCourse, orgResourcePacksEnabled],
  )

  const [consentFlags, setConsentFlags] = useState<ConsentFlags>({
    healthLeaflet: false,
    practiceProtocols: false,
    validID: false,
    needsAnalysis: false,
  })

  const methods = useRef<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
    reset: UseFormReset<CourseInput>
  }>(null)

  useEffect(() => {
    if (
      isIndirectCourse &&
      !acl.isInternalUser() &&
      trainers.length === 1 &&
      trainers[0].type === Course_Trainer_Type_Enum.Leader
    ) {
      setAssistants(assistants => {
        if (!assistants.length) return assistants
        return []
      })
    }
  }, [acl, isIndirectCourse, trainers])

  useEffect(() => {
    if (
      isIndirectCourse &&
      profile &&
      certifications &&
      !acl.isInternalUser()
    ) {
      setTrainers([
        {
          profile_id: profile.id,
          type: Course_Trainer_Type_Enum.Leader,
          status: InviteStatus.ACCEPTED,
          levels: certifications as TrainerInput['levels'],
          trainer_role_types: profile.trainer_role_types,
        },
        ...assistants.map(assistant => ({
          profile_id: assistant.id,
          type: Course_Trainer_Type_Enum.Assistant,
          status: InviteStatus.PENDING,
          levels: certifications as TrainerInput['levels'],
          trainer_role_types: assistant.trainer_role_types,
        })),
      ])
    }
  }, [assistants, isIndirectCourse, setTrainers, profile, certifications, acl])

  useEffect(() => {
    setCurrentStepKey(StepsEnum.COURSE_DETAILS)
  }, [setCurrentStepKey])

  const isTrainerAndCourseRequireOrderDetails =
    !acl.isInternalUser() &&
    courseData?.type === Course_Type_Enum.Indirect &&
    Boolean(courseData?.blendedLearning || courseData?.resourcePacksType)

  const seniorOrPrincipalLead = useMemo(() => {
    return (
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL,
      ) ?? false
    )
  }, [profile])

  const isETA = useMemo(() => {
    return checkIsETA(
      profile?.trainer_role_types as unknown as TrainerRoleType[],
    )
  }, [profile])

  const isEmployerAOL = useMemo(() => {
    return checkIsEmployerAOL(
      profile?.trainer_role_types as unknown as TrainerRoleType[],
    )
  }, [profile])

  const nextStepEnabled = useMemo(() => {
    if (!isIndirectCourse) {
      return courseDataValid
    }

    const evaluatedFlag = !isBILDcourse
      ? omit(consentFlags, 'needsAnalysis')
      : consentFlags

    const hasCheckedAllFlags = Object.values(evaluatedFlag).every(
      flag => flag === true,
    )
    return hasCheckedAllFlags && courseDataValid
  }, [consentFlags, courseDataValid, isIndirectCourse, isBILDcourse])

  const submit = useCallback(async () => {
    if (!courseData || !profile) return

    if (isTrainerAndCourseRequireOrderDetails) {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./license-order-details')
    } else if (
      courseType === Course_Type_Enum.Indirect &&
      !acl.isInternalUser()
    ) {
      navigate(`./modules`)
    } else {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./assign-trainers')
    }
  }, [
    acl,
    completeStep,
    courseData,
    courseType,
    isTrainerAndCourseRequireOrderDetails,
    navigate,
    profile,
  ])

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const handleNextStepButtonClick = async () => {
    methods?.current?.trigger()
    setFormSubmitted(true)

    if (!courseData || !profile || !nextStepEnabled) return

    if (!allowCreateCourse) {
      setDisplayNoCoursePriceError(true)
      return
    }

    assertCourseDataValid(courseData, courseDataValid)

    const ignoreExceptions =
      courseType === Course_Type_Enum.Indirect && acl.isInternalUser()
        ? [
            Course_Exception_Enum.LeadTrainerInGracePeriod,
            Course_Exception_Enum.TrainerRatioNotMet,
          ]
        : []

    if (isIndirectCourse && !acl.isTTAdmin()) {
      const exceptions = checkCourseDetailsForExceptions(
        {
          ...courseData,
          hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
          usesAOL: courseData.usesAOL,
          isTrainer: acl.isTrainer(),
          isETA: isETA,
          isEmployerAOL: isEmployerAOL,
          isUKCountry: isUKCountry(courseData.residingCountry),
          isAustraliaRegion: acl.isAustralia(),
        },
        [
          ...assistants.map(assistant => ({
            type: Course_Trainer_Type_Enum.Assistant,
            trainer_role_types: assistant.trainer_role_types,
            levels: assistant.levels,
          })),
          {
            type: Course_Trainer_Type_Enum.Leader,
            levels: certifications as TrainerInput['levels'],
            trainer_role_types: profile.trainer_role_types,
          },
        ],
        acl.isAustralia(),
        ignoreExceptions,
      )
      setCourseExceptions(exceptions)
      if (exceptions.length > 0) return
    }
    await submit()
  }

  const handleCourseFormChange = useCallback(
    ({ data, isValid }: { data?: CourseInput; isValid?: boolean }) => {
      // Type casting to save the data in context
      // Validation still happens before moving to the next step
      if (data) {
        // Do not save the venue if the course is virtual
        const newData = {
          ...data,
          venue:
            data.deliveryType === Course_Delivery_Type_Enum.Virtual
              ? null
              : data.venue,
        }
        setCourseData(newData as unknown as ValidCourseInput)
      }

      setCourseDataValid(Boolean(isValid))
    },
    [setCourseData],
  )

  const handleConsentFlagChange = (value: ConsentFlags) => {
    setConsentFlags(value)
  }

  const nextStepButtonLabel = useMemo(() => {
    if (isTrainerAndCourseRequireOrderDetails) {
      return 'order-details-button-text'
    }

    if (courseType === Course_Type_Enum.Indirect && !acl.isInternalUser()) {
      return 'course-builder-button-text'
    }

    return 'select-trainers-button-text'
  }, [acl, courseType, isTrainerAndCourseRequireOrderDetails])

  const showTrainerRatioWarning = useMemo(() => {
    return (
      courseData?.courseLevel &&
      isTrainersRatioNotMet(
        {
          ...courseData,
          level: courseData.courseLevel,
          max_participants: courseData.maxParticipants,
          usesAOL: courseData.usesAOL,
          isTrainer: acl.isTrainer(),
          isUKCountry: isUKCountry(courseData.residingCountry),
          isAustraliaRegion: acl.isAustralia(),
        },
        [
          {
            type: Course_Trainer_Type_Enum.Leader,
            trainer_role_types: profile?.trainer_role_types ?? [],
          },
          ...assistants.map(assistant => ({
            type: Course_Trainer_Type_Enum.Assistant,
            trainer_role_types: assistant.trainer_role_types,
            levels: assistant.levels,
          })),
        ],
      )
    )
  }, [acl, assistants, courseData, isUKCountry, profile?.trainer_role_types])

  if (displayNoCoursePriceError) {
    return (
      <Alert
        severity="error"
        variant="outlined"
        data-testid="price-error-banner"
      >
        {t('pages.create-course.no-course-price')}
      </Alert>
    )
  }

  return (
    <Box paddingBottom={5}>
      {savingStatus === LoadingStatus.ERROR ? (
        <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
          {t('pages.create-course.error-creating-course')}
        </Alert>
      ) : null}
      <CourseForm
        onChange={handleCourseFormChange}
        type={courseType}
        courseInput={courseData}
        isCreation={true}
        methodsRef={methods}
      />

      {courseType === Course_Type_Enum.Indirect ? (
        <>
          {!acl.isInternalUser() ? (
            <>
              <Typography mt={2} mb={2} variant="h5" fontWeight={500}>
                {t('pages.create-course.assign-trainers-title')}
              </Typography>

              <SearchTrainers
                trainerType={Course_Trainer_Type_Enum.Assistant}
                courseLevel={
                  courseData?.courseLevel ?? Course_Level_Enum.Level_1
                }
                courseSchedule={{
                  start: courseData?.startDateTime,
                  end: courseData?.endDateTime,
                }}
                matchesFilter={matches =>
                  matches.filter(t => t.id !== profile?.id)
                }
                value={assistants}
                onChange={event => {
                  setAssistants(event.target.value)
                }}
                courseType={courseType}
                bildStrategies={
                  courseData?.bildStrategies
                    ? (bildStrategiesToArray(
                        courseData?.bildStrategies,
                      ) as unknown as BildStrategy[])
                    : []
                }
                useAOL={courseData?.usesAOL}
              />

              {showTrainerRatioWarning ? (
                <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                  {t(
                    `pages.create-course.exceptions.type_${Course_Exception_Enum.TrainerRatioNotMet}`,
                  )}
                </Alert>
              ) : null}

              {courseData?.type === Course_Type_Enum.Indirect && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t(
                    'components.course-form.indirect-course-assist-trainer-info',
                  )}
                </Alert>
              )}
            </>
          ) : null}

          <CourseFormCheckboxes
            formSubmitted={formSubmitted}
            courseResidingCountry={courseData?.residingCountry ?? ''}
            displayConnectFeeCondition={displayConnectFeeCondition}
            displayResourcePacksCondition={displayResourcePacksCondition}
            isBILDCourse={isBILDcourse}
            handleConsentFlagChanged={handleConsentFlagChange}
          />
        </>
      ) : null}

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="flex-end"
        sx={{ marginTop: 4 }}
      >
        {acl.isTrainer() && courseData?.type === Course_Type_Enum.Indirect && (
          <Button
            variant="text"
            sx={{ marginRight: 4 }}
            onClick={() => setShowDraftConfirmationDialog(true)}
          >
            {t('pages.create-course.save-as-draft')}
          </Button>
        )}

        <LoadingButton
          variant="contained"
          onClick={handleNextStepButtonClick}
          loading={savingStatus === LoadingStatus.FETCHING}
          endIcon={<ArrowForwardIcon />}
          data-testid="next-page-btn"
        >
          {t(`pages.create-course.${nextStepButtonLabel}`)}
        </LoadingButton>
      </Box>

      {isBILDcourse && isIndirectCourse ? (
        <NoExceptionsDialog
          open={courseExceptions.length > 0}
          onClose={() => setCourseExceptions([])}
        />
      ) : (
        <CourseExceptionsConfirmation
          open={courseExceptions.length > 0}
          onCancel={() => setCourseExceptions([])}
          onSubmit={submit}
          exceptions={courseExceptions}
          courseType={courseType}
          courseData={courseData as ValidCourseInput}
          setCourseData={setCourseData}
        />
      )}
    </Box>
  )
}
