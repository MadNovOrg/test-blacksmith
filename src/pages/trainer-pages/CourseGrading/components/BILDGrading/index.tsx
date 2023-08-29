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
import { CourseGradingMenu } from '@app/components/CourseGradingMenu/CourseGradingMenu'
import { Dialog } from '@app/components/dialogs'
import { Sticky } from '@app/components/Sticky'
import {
  Course_Level_Enum,
  Grade_Enum,
  SaveBildGradeMutation,
  SaveBildGradeMutationVariables,
} from '@app/generated/graphql'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import { Strategy } from '@app/types'

import { useGradingParticipants } from '../../hooks'
import useCourseGradingData from '../../useCourseGradingData'
import { GradingCount } from '../GradingCount'
import { GradingFeedbackInput } from '../GradingFeedbackInput'
import { GradingTitle } from '../GradingTitle'
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

  const filteredCourseParticipants = useGradingParticipants(course.participants)
  const [grade, setGrade] = useState<Grade_Enum | undefined>()
  const [modalOpened, setModalOpened] = useState(false)
  const navigate = useNavigate()

  const feedbackRef = useRef('')
  const strategyModulesRef = useRef<Record<string, Strategy>>()

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
      saveBildGrades({
        participantIds: filteredCourseParticipants.map(
          participant => participant.id
        ),
        grade,
        modules: filteredCourseParticipants.map(participant => ({
          participant_id: participant.id,
          modules: strategyModulesRef.current,
        })),
        feedback: feedbackRef.current,
        courseId: course.id,
      })
    }
  }, [grade, saveBildGrades, filteredCourseParticipants, course.id])

  useEffect(() => {
    if (savingData) {
      navigate(`../details?tab=${CourseDetailsTabs.GRADING}`)
    }
  }, [savingData, navigate])

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
          />

          <Typography variant="h6" fontWeight="500" mb={1} mt={4}>
            {t('pages.course-grading.feedback-field-title')}
          </Typography>

          <GradingFeedbackInput
            onChange={feedback => (feedbackRef.current = feedback)}
          />

          <Box display="flex" justifyContent="right">
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
