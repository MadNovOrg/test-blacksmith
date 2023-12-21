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
  Course_Level_Enum,
  Course_Type_Enum,
  CourseTrainerType,
  SearchTrainer,
} from '@app/generated/graphql'
import useProfile from '@app/hooks/useProfile'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  CourseException,
  checkCourseDetailsForExceptions,
  isTrainersRatioNotMet,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import {
  CourseInput,
  InviteStatus,
  TrainerInput,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import { LoadingStatus, bildStrategiesToArray } from '@app/util'

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

  const { savingStatus, saveCourse } = useSaveCourse()
  const [assistants, setAssistants] = useState<SearchTrainer[]>([])
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()
  const isBild = courseData?.accreditedBy === Accreditors_Enum.Bild

  const [courseExceptions, setCourseExceptions] = useState<CourseException[]>(
    []
  )

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
    if (courseType === Course_Type_Enum.Indirect && profile && certifications) {
      setTrainers([
        {
          profile_id: profile.id,
          type: CourseTrainerType.Leader,
          status: InviteStatus.ACCEPTED,
          levels: certifications as TrainerInput['levels'],
          trainer_role_types: profile.trainer_role_types,
        },
        ...assistants.map(assistant => ({
          profile_id: assistant.id,
          type: CourseTrainerType.Assistant,
          status: InviteStatus.PENDING,
          levels: certifications as TrainerInput['levels'],
          trainer_role_types: assistant.trainer_role_types,
        })),
      ])
    }
  }, [assistants, courseType, setTrainers, profile, certifications])

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

  const nextStepEnabled = useMemo(() => {
    if (courseType !== Course_Type_Enum.Indirect) {
      return courseDataValid
    }

    const evaluatedFlag = !isBild
      ? omit(consentFlags, 'needsAnalysis')
      : consentFlags

    const hasCheckedAllFlags = Object.values(evaluatedFlag).every(
      flag => flag === true
    )

    return hasCheckedAllFlags && courseDataValid
  }, [consentFlags, courseDataValid, courseType, isBild])

  const submit = useCallback(async () => {
    if (!courseData || !profile) return

    if (
      courseData.blendedLearning &&
      courseData.type === Course_Type_Enum.Indirect
    ) {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./license-order-details')
    } else if (courseType === Course_Type_Enum.Indirect) {
      const savedCourse = await saveCourse()

      if (savedCourse?.id) {
        navigate(`/courses/${savedCourse.id}/modules`)
      }
    } else {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./assign-trainers')
    }
  }, [completeStep, courseData, courseType, navigate, profile, saveCourse])

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const checkboxError = useMemo(
    () =>
      formSubmitted &&
      (!consentFlags.practiceProtocols ||
        !consentFlags.validID ||
        !consentFlags.connectFee ||
        (isBild && !consentFlags.needsAnalysis)),
    [
      formSubmitted,
      isBild,
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
    assertCourseDataValid(courseData, courseDataValid)

    if (courseType === Course_Type_Enum.Indirect && !acl.isTTAdmin()) {
      const exceptions = checkCourseDetailsForExceptions(
        {
          ...courseData,
          hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
          usesAOL: courseData.usesAOL,
          isTrainer: acl.isTrainer(),
        },
        [
          ...assistants.map(assistant => ({
            type: CourseTrainerType.Assistant,
            trainer_role_types: assistant.trainer_role_types,
            levels: assistant.levels,
          })),
          {
            type: CourseTrainerType.Leader,
            levels: certifications as TrainerInput['levels'],
            trainer_role_types: profile.trainer_role_types,
          },
        ]
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
    courseData?.blendedLearning && courseData.type === Course_Type_Enum.Indirect
      ? 'order-details-button-text'
      : courseType === Course_Type_Enum.Indirect
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
          hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
          usesAOL: courseData.usesAOL,
          isTrainer: acl.isTrainer(),
        },
        assistants.map(assistant => ({
          type: CourseTrainerType.Assistant,
          trainer_role_types: assistant.trainer_role_types,
          levels: assistant.levels,
        }))
      )
    )
  }, [acl, assistants, courseData, seniorOrPrincipalLead])

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
          <Typography mt={2} mb={2} variant="h5" fontWeight={500}>
            {t('pages.create-course.assign-trainers-title')}
          </Typography>

          <SearchTrainers
            trainerType={CourseTrainerType.Assistant}
            courseLevel={courseData?.courseLevel || Course_Level_Enum.Level_1}
            courseSchedule={{
              start: courseData?.startDateTime ?? undefined,
              end: courseData?.endDateTime ?? undefined,
            }}
            matchesFilter={matches => matches.filter(t => t.id !== profile?.id)}
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
          />

          {showTrainerRatioWarning ? (
            <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
              {t(
                `pages.create-course.exceptions.type_${CourseException.TRAINER_RATIO_NOT_MET}`
              )}
            </Alert>
          ) : null}

          {courseData?.type === Course_Type_Enum.Indirect && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('components.course-form.indirect-course-assist-trainer-info')}
            </Alert>
          )}

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
              />

              {isBild && (
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

      {isBild && courseData.type === Course_Type_Enum.Indirect ? (
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
