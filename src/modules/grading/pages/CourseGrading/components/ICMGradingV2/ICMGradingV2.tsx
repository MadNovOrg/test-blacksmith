import { LoadingButton } from '@mui/lab'
import {
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseGradingMenu } from '@app/components/CourseGradingMenu/CourseGradingMenu'
import { Dialog } from '@app/components/dialogs'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
import { ModulesSelectionListV2 } from '@app/modules/grading/components/ModulesSelectionListV2/ModulesSelectionListV2'
import { isLesson, isModule } from '@app/modules/grading/shared/utils'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'

import useCourseGradingData from '../../hooks/useCourseGradingData'
import { useGradingParticipants } from '../../hooks/useGradingParticipants'
import { GradingCount } from '../GradingCount'
import { GradingTitle } from '../GradingTitle'
import { ModuleGroupNoteInput } from '../ModuleGroupNoteInput/ModuleGroupNoteInput'
import { ParticipantsList } from '../ParticipantsList'

import { useSaveCourseGrading } from './hooks/useSaveCourseGrading'

type Props = {
  course: NonNullable<ReturnType<typeof useCourseGradingData>['data']>
}

export const ICMGradingV2: React.FC<Props> = ({ course }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const notesRef = useRef(new Map<string, string>())
  const { acl } = useAuth()
  const { t } = useTranslation()

  const [modalOpened, setModalOpened] = useState(false)
  const [grade, setGrade] = useState<Grade_Enum | undefined>()

  const [
    { data: saveGradingData, fetching: savingGrading, error: saveGradingError },
    saveCourseGrading,
  ] = useSaveCourseGrading()

  const modulesSelectionRef = useRef<unknown>(null)

  const filteredCourseParticipants = useGradingParticipants(course.participants)

  const openConfirmationModal = () => {
    setModalOpened(true)
  }

  const closeConfirmationModal = () => {
    setModalOpened(false)
  }

  const saveGrades = () => {
    if (!grade) {
      return
    }

    const selectedCurriculum = modulesSelectionRef.current

    const curriculumWithNotes = Array.isArray(selectedCurriculum)
      ? selectedCurriculum.map(m => {
          const module = { ...m }

          if (!isModule(module)) {
            return
          }

          module.note = notesRef.current.get(module.id) ?? ''

          return module
        })
      : modulesSelectionRef.current

    saveCourseGrading({
      participantIds: filteredCourseParticipants.map(p => p.id),
      courseId: course.id,
      gradedOn: curriculumWithNotes,
      grade,
    })
  }

  const canAddModuleNotes = acl.canAddModuleNotes(
    course.trainers
      .filter(t => t.type === Course_Trainer_Type_Enum.Leader)
      .map(t => t.profile_id)
  )

  const curriculum = useMemo(() => {
    const c =
      course.curriculum && Array.isArray(course.curriculum)
        ? [...course.curriculum]
        : []

    const mappedCurriculum =
      Array.isArray(c) && c.length
        ? c.map(m => {
            const module = { ...m }

            if (!isModule(module)) {
              return
            }

            const items = [...module.lessons.items]

            if (Array.isArray(items) && items.length) {
              module.lessons = {
                items: items.filter(l => {
                  if (!isLesson(l)) {
                    return false
                  }

                  return l.covered
                }),
              }
            }

            return module
          })
        : []

    return mappedCurriculum.filter(m => m?.lessons?.items?.length)
  }, [course.curriculum])

  useEffect(() => {
    if (saveGradingData && !saveGradingError) {
      navigate(`/courses/${course.id}/details?tab=${CourseDetailsTabs.GRADING}`)
    }
  }, [course.id, navigate, saveGradingData, saveGradingError])

  return (
    <>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
        <Box width={400} display="flex" flexDirection="column" pr={4}>
          <Sticky>
            <Box mb={2}>
              <BackButton
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
              {t('pages.course-details.tabs.grading.title')}
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

        {curriculum.length ? (
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
            {saveGradingError ? (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                data-testid="saving-grading-error-alert"
              >
                {t('pages.course-grading.grading-error')}
              </Alert>
            ) : null}

            <ModulesSelectionListV2
              curriculum={curriculum}
              onChange={curriculum =>
                (modulesSelectionRef.current = curriculum)
              }
              slots={{
                afterModule: moduleId =>
                  filteredCourseParticipants.length === 1 &&
                  canAddModuleNotes ? (
                    <ModuleGroupNoteInput
                      groupId={moduleId}
                      onChange={e => {
                        notesRef.current.set(moduleId, e.target.value)
                      }}
                    />
                  ) : null,
              }}
            />

            <Typography mt={3} color={theme.palette.dimGrey.main}>
              {t('pages.course-grading.submit-description')}
            </Typography>
            <Box display="flex" justifyContent="right" mt={5}>
              <LoadingButton
                variant="contained"
                onClick={openConfirmationModal}
                disabled={!grade}
                data-testid="grading-submit-button"
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
            loading={savingGrading}
            onClick={() => saveGrades()}
          >
            {t('pages.course-grading.modal-confirm-btn-text')}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  )
}
