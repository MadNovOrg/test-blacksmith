import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import omit from 'lodash-es/omit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormState, UseFormReset, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import CourseForm from '@app/components/CourseForm'
import { SearchTrainers } from '@app/components/SearchTrainers'
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
import useProfile from '@app/hooks/useProfile'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  isTrainersRatioNotMet,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
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

import { StepsEnum } from '../../types'
import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'
import { NoExceptionsDialog } from '../NoExceptionsDialog'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean
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
    setTrainers,
    setShowDraftConfirmationDialog,
  } = useCreateCourse()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { savingStatus, saveCourse, allowCreateCourse } = useSaveCourse()
  const [assistants, setAssistants] = useState<SearchTrainer[]>([])
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()
  const isBILDcourse = courseData?.accreditedBy === Accreditors_Enum.Bild
  const isINDIRECTcourse = courseData?.type === Course_Type_Enum.Indirect

  const [courseExceptions, setCourseExceptions] = useState<
    Course_Exception_Enum[]
  >([])
  const [displayNoCoursePriceError, setDisplayNoCoursePriceError] =
    useState<boolean>(false)

  const { certifications } = useProfile(profile?.id)

  const [consentFlags, setConsentFlags] = useState({
    healthLeaflet: false,
    practiceProtocols: false,
    validID: false,
    needsAnalysis: false,
    connectFee: false,
  })

  const methods = useRef<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
    reset: UseFormReset<CourseInput>
  }>(null)

  useEffect(() => {
    if (
      isINDIRECTcourse &&
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
  }, [assistants, isINDIRECTcourse, setTrainers, profile, certifications, acl])

  useEffect(() => {
    setCurrentStepKey(StepsEnum.COURSE_DETAILS)
  }, [setCurrentStepKey])

  const seniorOrPrincipalLead = useMemo(() => {
    return (
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL
      ) ?? false
    )
  }, [profile])

  const isETA = useMemo(() => {
    return checkIsETA(
      profile?.trainer_role_types as unknown as TrainerRoleType[]
    )
  }, [profile])

  const isEmployerAOL = useMemo(() => {
    return checkIsEmployerAOL(
      profile?.trainer_role_types as unknown as TrainerRoleType[]
    )
  }, [profile])

  const nextStepEnabled = useMemo(() => {
    if (!isINDIRECTcourse) {
      return courseDataValid
    }

    const evaluatedFlag = !isBILDcourse
      ? omit(consentFlags, 'needsAnalysis')
      : consentFlags

    const hasCheckedAllFlags = Object.values(evaluatedFlag).every(
      flag => flag === true
    )

    return hasCheckedAllFlags && courseDataValid
  }, [consentFlags, courseDataValid, isINDIRECTcourse, isBILDcourse])

  const submit = useCallback(async () => {
    if (!courseData || !profile) return

    if (
      courseData.blendedLearning &&
      courseData.type === Course_Type_Enum.Indirect &&
      !acl.isInternalUser()
    ) {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./license-order-details')
    } else if (
      courseType === Course_Type_Enum.Indirect &&
      !acl.isInternalUser()
    ) {
      const savedCourse = await saveCourse()

      if (savedCourse?.id) {
        navigate(`/courses/${savedCourse.id}/modules`)
      }
    } else {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./assign-trainers')
    }
  }, [acl, completeStep, courseData, courseType, navigate, profile, saveCourse])

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const checkboxError = useMemo(
    () =>
      formSubmitted &&
      (!consentFlags.practiceProtocols ||
        !consentFlags.validID ||
        !consentFlags.connectFee ||
        (isBILDcourse && !consentFlags.needsAnalysis)),
    [
      formSubmitted,
      isBILDcourse,
      consentFlags.practiceProtocols,
      consentFlags.validID,
      consentFlags.needsAnalysis,
      consentFlags.connectFee,
    ]
  )

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

    if (isINDIRECTcourse && !acl.isTTAdmin()) {
      const exceptions = checkCourseDetailsForExceptions(
        {
          ...courseData,
          hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
          usesAOL: courseData.usesAOL,
          isTrainer: acl.isTrainer(),
          isETA: isETA,
          isEmployerAOL: isEmployerAOL,
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
        ignoreExceptions
      )
      setCourseExceptions(exceptions)
      if (exceptions.length > 0) return
    }
    await submit()
  }

  const handleConsentFlagChange = (
    flag: keyof typeof consentFlags,
    checked: boolean
  ) => {
    setConsentFlags({
      ...consentFlags,
      [flag]: checked,
    })
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
    [setCourseData]
  )

  const nextStepButtonLabel =
    courseData?.blendedLearning &&
    courseData.type === Course_Type_Enum.Indirect &&
    !acl.isInternalUser()
      ? 'order-details-button-text'
      : courseType === Course_Type_Enum.Indirect && !acl.isInternalUser()
      ? 'course-builder-button-text'
      : 'select-trainers-button-text'

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
        },
        assistants.map(assistant => ({
          type: Course_Trainer_Type_Enum.Assistant,
          trainer_role_types: assistant.trainer_role_types,
          levels: assistant.levels,
        }))
      )
    )
  }, [acl, assistants, courseData])

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
                  courseData?.courseLevel || Course_Level_Enum.Level_1
                }
                courseSchedule={{
                  start: courseData?.startDateTime ?? undefined,
                  end: courseData?.endDateTime ?? undefined,
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
                        courseData?.bildStrategies
                      ) as unknown as BildStrategy[])
                    : []
                }
                useAOL={courseData?.usesAOL}
              />

              {showTrainerRatioWarning ? (
                <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                  {t(
                    `pages.create-course.exceptions.type_${Course_Exception_Enum.TrainerRatioNotMet}`
                  )}
                </Alert>
              ) : null}

              {courseData?.type === Course_Type_Enum.Indirect && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t(
                    'components.course-form.indirect-course-assist-trainer-info'
                  )}
                </Alert>
              )}
            </>
          ) : null}

          <FormControl required error={checkboxError}>
            <FormGroup sx={{ marginTop: 3 }} data-testid="acknowledge-checks">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentFlags.healthLeaflet}
                    onChange={e =>
                      handleConsentFlagChange('healthLeaflet', e.target.checked)
                    }
                  />
                }
                label={
                  t('pages.create-course.form.health-leaflet-copy') as string
                }
                sx={{ mb: 1 }}
                data-testid="healthLeaflet"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentFlags.practiceProtocols}
                    onChange={e =>
                      handleConsentFlagChange(
                        'practiceProtocols',
                        e.target.checked
                      )
                    }
                  />
                }
                label={
                  t('pages.create-course.form.practice-protocol-copy') as string
                }
                sx={{ mb: 2 }}
                data-testid="practiceProtocols"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentFlags.validID}
                    onChange={e =>
                      handleConsentFlagChange('validID', e.target.checked)
                    }
                  />
                }
                label={t('pages.create-course.form.valid-id-copy') as string}
                sx={{ mb: 2 }}
                data-testid="validID"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentFlags.connectFee}
                    onChange={e =>
                      handleConsentFlagChange('connectFee', e.target.checked)
                    }
                  />
                }
                label={
                  t(
                    'pages.create-course.form.connect-fee-notification'
                  ) as string
                }
                data-testid="connectFee"
              />

              {isBILDcourse && (
                <FormControlLabel
                  required
                  control={
                    <Checkbox
                      checked={consentFlags.needsAnalysis}
                      onChange={e =>
                        handleConsentFlagChange(
                          'needsAnalysis',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={
                    t('pages.create-course.form.needs-analysis-copy') as string
                  }
                  data-testid="needsAnalysis"
                />
              )}

              {checkboxError && (
                <FormHelperText>
                  {t('pages.create-course.form.checkboxes-missing')}
                </FormHelperText>
              )}
            </FormGroup>
          </FormControl>
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

      {isBILDcourse && isINDIRECTcourse ? (
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
        />
      )}
    </Box>
  )
}
