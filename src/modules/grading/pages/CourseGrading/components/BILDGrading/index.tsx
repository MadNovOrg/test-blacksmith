import { LoadingButton } from '@mui/lab'
import {
  Box,
  Typography,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { Dialog } from '@app/components/dialogs'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Grade_Enum,
  SaveBildGradeMutation,
  SaveBildGradeMutationVariables,
} from '@app/generated/graphql'
import { CourseGradingMenu } from '@app/modules/course_details/course_grading_tab/components/CourseGradingMenu/CourseGradingMenu'
import { CourseDetailsTabs } from '@app/modules/course_details/pages/CourseDetails'
import { Strategy } from '@app/types'

import useCourseGradingData from '../../hooks/useCourseGradingData'
import { useGradingParticipants } from '../../hooks/useGradingParticipants'
import { GradingCount } from '../GradingCount'
import { GradingTitle } from '../GradingTitle'
import { ModuleGroupNoteInput } from '../ModuleGroupNoteInput/ModuleGroupNoteInput'
import { ParticipantsList } from '../ParticipantsList'

import { BILDModulesSelection } from './components/BILDModulesSelection'
import { SAVE_BILD_GRADE_MUTATION } from './queries'

type Props = {
  course: NonNullable<ReturnType<typeof useCourseGradingData>['data']>
}

export const BILDGrading: FC<Props> = ({ course }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { acl } = useAuth()

  const filteredCourseParticipants = useGradingParticipants(course.participants)
  const [grade, setGrade] = useState<Grade_Enum | undefined>()
  const [modalOpened, setModalOpened] = useState(false)
  const navigate = useNavigate()
  const notesRef = useRef<Map<string, string>>(new Map())

  const strategyModulesRef =
    useRef<Record<string, Strategy & { note?: string }>>()

  const bildStrategyModules = course.bildModules.length
    ? course.bildModules[0].modules
    : {}

  const [{ data: savingData, fetching, error }, saveBildGrades] = useMutation<
    SaveBildGradeMutation,
    SaveBildGradeMutationVariables
  >(SAVE_BILD_GRADE_MUTATION)

  const saveGrades = useCallback(async () => {
    setModalOpened(false)

    if (grade) {
      if (strategyModulesRef.current) {
        Object.keys(strategyModulesRef.current).forEach(strategyName => {
          const strategyNotes = notesRef.current.get(strategyName)

          if (strategyNotes && strategyModulesRef.current) {
            strategyModulesRef.current[strategyName].note = strategyNotes
          }
        })
      }

      saveBildGrades({
        participantIds: filteredCourseParticipants.map(
          participant => participant.id,
        ),
        grade,
        modules: filteredCourseParticipants.map(participant => ({
          participant_id: participant.id,
          modules: strategyModulesRef.current,
        })),
        courseId: course.id,
      })
    }
  }, [grade, saveBildGrades, filteredCourseParticipants, course.id])

  useEffect(() => {
    if (savingData) {
      navigate(`../details?tab=${CourseDetailsTabs.GRADING}`)
    }
  }, [savingData, navigate])

  const canAddModuleNotes = acl.canAddModuleNotes(
    course.trainers
      .filter(t => t.type === Course_Trainer_Type_Enum.Leader)
      .map(t => t.profile_id),
  )

  return (
    <>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
        <Box width={400} display="flex" flexDirection="column" pr={4}>
          <Sticky>
            <Box mb={2}>
              <BackButton
                to={`../details?tab=${CourseDetailsTabs.GRADING}`}
                label={t('pages.course-grading-details.back-button-text')}
              />
            </Box>

            <GradingTitle>{course.name}</GradingTitle>

            <GradingCount
              count={filteredCourseParticipants.length}
              gradingAll={
                course.participants.length === filteredCourseParticipants.length
              }
            />
            <ParticipantsList participants={filteredCourseParticipants} />

            <Typography mb={2}>
              {t('pages.course-grading.grading-menu-description')}
            </Typography>
            <CourseGradingMenu
              courseDeliveryType={course.deliveryType}
              courseLevel={course.level as unknown as Course_Level_Enum}
              onChange={setGrade}
            />
          </Sticky>
        </Box>

        <Box flex={1} mt={'6px'}>
          <Typography variant="h5" fontWeight="500" mb={2}>
            {t('pages.course-grading.modules-selection-title')}
          </Typography>
          <Typography variant="body1" mb={4} color={theme.palette.dimGrey.main}>
            {t('pages.course-grading.modules-selection-description')}
          </Typography>

          {error ? (
            <Alert severity="error" variant="outlined" sx={{ mb: 4 }}>
              {t('pages.course-grading.grading-error')}
            </Alert>
          ) : null}

          <BILDModulesSelection
            strategyModules={bildStrategyModules}
            onChange={selection => (strategyModulesRef.current = selection)}
            courseType={course.type}
            slots={{
              afterStrategyAccordion: strategyName =>
                filteredCourseParticipants.length === 1 && canAddModuleNotes ? (
                  <ModuleGroupNoteInput
                    groupId={strategyName}
                    onChange={e =>
                      notesRef.current.set(strategyName, e.target.value)
                    }
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
              onClick={() => setModalOpened(true)}
              disabled={!grade}
            >
              {t('pages.course-grading.submit-button-text')}
            </LoadingButton>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        title={t('pages.course-grading.modal-title')}
      >
        <Typography>{t('pages.course-grading.modal-description')}</Typography>
        <Box mt={4} display="flex" justifyContent="right">
          <Button sx={{ marginRight: 1 }} onClick={() => setModalOpened(false)}>
            {t('pages.course-grading.modal-cancel-btn-text')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={fetching}
            onClick={() => saveGrades()}
          >
            {t('pages.course-grading.modal-confirm-btn-text')}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  )
}
