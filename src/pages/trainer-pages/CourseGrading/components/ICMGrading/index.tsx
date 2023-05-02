import { LoadingButton } from '@mui/lab'
import { Box, Typography, Button } from '@mui/material'
import { t } from 'i18next'
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseGradingMenu } from '@app/components/CourseGradingMenu'
import { Dialog } from '@app/components/Dialog'
import { Sticky } from '@app/components/Sticky'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/grading/save-course-grading'
import theme from '@app/theme'
import { LoadingStatus } from '@app/util'

import {
  HoldsRecord,
  ModulesSelectionList,
} from '../../../CourseGradingDetails/ModulesSelectionList'
import { useGradingParticipants } from '../../hooks'
import useCourseGradingData from '../../useCourseGradingData'
import { GradingCount } from '../GradingCount'
import { GradingFeedbackInput } from '../GradingFeedbackInput'
import { GradingTitle } from '../GradingTitle'
import { ParticipantsList } from '../ParticipantsList'

type Props = {
  course: NonNullable<ReturnType<typeof useCourseGradingData>['data']>
}

export const ICMGrading: FC<Props> = ({ course }) => {
  const navigate = useNavigate()
  const [modalOpened, setModalOpened] = useState(false)
  const [savingGradesStatus, setSavingGradesStatus] = useState(
    LoadingStatus.IDLE
  )
  const [grade, setGrade] = useState<Grade_Enum | undefined>()
  const feedbackRef = useRef('')

  const modulesSelectionRef = useRef<Record<string, boolean> | null>(null)

  const fetcher = useFetcher()

  const STORAGE_KEY = `grading-modules-selection-${course?.id}`

  const filteredCourseParticipants = useGradingParticipants(course.participants)

  const handleFeedbackChange = useCallback((feedback: string) => {
    feedbackRef.current = feedback
  }, [])

  const moduleGroups = useMemo(() => {
    if (!course?.modules) {
      return []
    }

    const groups: Record<
      string,
      {
        id: string
        name: string
        mandatory: boolean
        modules: Array<{ id: string; name: string; covered: boolean }>
      }
    > = {}

    const rawStoredSelection = localStorage.getItem(STORAGE_KEY)
    const storedSelection: Record<string, boolean> = JSON.parse(
      rawStoredSelection ?? '{}'
    )

    course.modules.forEach(courseModule => {
      if (!courseModule.covered || !courseModule.module.moduleGroup) {
        return
      }

      const moduleGroup = groups[courseModule.module.moduleGroup.id]

      if (!moduleGroup) {
        groups[courseModule.module.moduleGroup.id] = {
          id: courseModule.module.moduleGroup.id,
          name: courseModule.module.moduleGroup.name,
          mandatory: courseModule.module.moduleGroup.mandatory,
          modules: [],
        }
      }

      groups[courseModule.module.moduleGroup?.id].modules.push({
        id: courseModule.module.id,
        name: courseModule.module.name,
        covered: storedSelection[courseModule.module.id] ?? true,
      })
    })

    return Object.values(groups)
  }, [STORAGE_KEY, course?.modules])

  const openConfirmationModal = () => {
    setModalOpened(true)
  }

  const closeConfirmationModal = () => {
    setModalOpened(false)
  }

  const saveGrades = async () => {
    if (!course || !grade) return

    try {
      setSavingGradesStatus(LoadingStatus.FETCHING)

      const modules: Array<{
        course_participant_id: string
        module_id: string
        completed: boolean
      }> = []

      const attendedParticipants: string[] = []

      filteredCourseParticipants?.forEach(participant => {
        if (!participant.attended || participant.grade) {
          return
        }

        attendedParticipants.push(participant.id)

        for (const id in modulesSelectionRef.current) {
          modules.push({
            course_participant_id: participant.id,
            module_id: id,
            completed: modulesSelectionRef.current[id],
          })
        }
      })

      await fetcher<ResponseType, ParamsType>(MUTATION, {
        modules,
        participantIds: attendedParticipants,
        grade,
        feedback: feedbackRef.current,
        courseId: course.id,
      })

      localStorage.removeItem(STORAGE_KEY)
      navigate(`/courses/${course.id}/details?tab=${CourseDetailsTabs.GRADING}`)
    } catch (err) {
      setSavingGradesStatus(LoadingStatus.ERROR)
    }
  }

  useEffect(() => {
    const initialSelection: Record<string, boolean> = {}

    moduleGroups.forEach(group => {
      group.modules.forEach(module => {
        if (module.covered) {
          initialSelection[module.id] = true
        }
      })
    })

    modulesSelectionRef.current = initialSelection
  }, [moduleGroups])

  const handleModuleSelectionChange = (selection: HoldsRecord) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    modulesSelectionRef.current = selection
  }

  return (
    <>
      <Box display="flex">
        <Box width={400} display="flex" flexDirection="column" pr={4}>
          <Sticky>
            <Box mb={2}>
              <BackButton
                to={`/courses/${course.id}/details?tab=${CourseDetailsTabs.GRADING}`}
                label={t('pages.course-grading-details.back-button-text')}
              />
            </Box>

            <GradingTitle>{course.name}</GradingTitle>
            <GradingCount
              gradingAll={
                course.participants.length === filteredCourseParticipants.length
              }
              count={filteredCourseParticipants.length}
            />

            <ParticipantsList participants={filteredCourseParticipants} />

            <Typography color={theme.palette.grey[700]} fontWeight={600} mb={1}>
              {t('pages.course-grading.grading-menu-title')}
            </Typography>
            <Typography mb={2}>
              {t('pages.course-grading.grading-menu-description')}
            </Typography>

            <CourseGradingMenu
              onChange={grade => setGrade(grade)}
              courseLevel={course.level as unknown as Course_Level_Enum}
              courseDeliveryType={
                course.deliveryType as unknown as Course_Delivery_Type_Enum
              }
            />
          </Sticky>
        </Box>

        {course.modules?.length ? (
          <Box flex={1} mt={'6px'}>
            <Typography variant="h5" fontWeight="500" mb={2}>
              {t('pages.course-grading.modules-selection-title')}
            </Typography>
            <Typography
              variant="body1"
              mb={4}
              color={theme.palette.dimGrey.main}
            >
              {t('pages.course-grading.modules-selection-description')}
            </Typography>

            <ModulesSelectionList
              moduleGroups={moduleGroups}
              onChange={handleModuleSelectionChange}
            />

            <Typography variant="h6" fontWeight="500" mb={1} mt={4}>
              {t('pages.course-grading.feedback-field-title')}
            </Typography>

            <GradingFeedbackInput onChange={handleFeedbackChange} />

            <Box display="flex" justifyContent="right">
              <LoadingButton
                variant="contained"
                onClick={openConfirmationModal}
                disabled={!grade}
              >
                {t('pages.course-grading.submit-button-text')}
              </LoadingButton>
            </Box>
          </Box>
        ) : (
          t('pages.course-grading.no-modules')
        )}
      </Box>

      <Dialog
        open={modalOpened}
        onClose={closeConfirmationModal}
        title={t('pages.course-grading.modal-title')}
      >
        <Typography>{t('pages.course-grading.modal-description')}</Typography>
        <Box mt={4} display="flex" justifyContent="right">
          <Button
            sx={{ marginRight: 1 }}
            onClick={() => closeConfirmationModal()}
          >
            {t('pages.course-grading.modal-cancel-btn-text')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={savingGradesStatus === LoadingStatus.FETCHING}
            onClick={() => saveGrades()}
          >
            {t('pages.course-grading.modal-confirm-btn-text')}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  )
}
