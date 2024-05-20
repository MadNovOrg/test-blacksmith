import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ModulesSelectionListV2 } from '@app/modules/grading/components/ModulesSelectionListV2/ModulesSelectionListV2'
import { isLesson, isModule } from '@app/modules/grading/shared/utils'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import theme from '@app/theme'

import { useGradingDetails } from '../../components/GradingDetailsProvider'
import { ModulesSelectionTitle } from '../../components/ModulesSelectionTitle/ModulesSelectionTitle'

import { useCourseCurriculum } from './hooks/useCourseCurriculum'
import { useSaveCurriculumSelection } from './hooks/useSaveCurriculumSelection'

const getInitialCurriculum = (curriculum: unknown) => {
  const shouldCheckAllModules =
    curriculum && Array.isArray(curriculum) && curriculum.every(isModule)
  if (!shouldCheckAllModules) {
    return curriculum
  }

  return curriculum.map(module => {
    const lessons = module.lessons?.items

    return {
      ...module,
      lessons: {
        ...module.lessons,
        items:
          Array.isArray(lessons) && lessons.every(isLesson)
            ? lessons.map(lesson => ({
                ...lesson,
                covered: true,
              }))
            : [],
      },
    }
  })
}

export const ModulesSelectionV2: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { backToStep } = useGradingDetails()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const [{ data: courseData, fetching: fetchingCourseData }] =
    useCourseCurriculum(Number(id))

  const savedCurriculum = useMemo(() => {
    try {
      const stored = localStorage.getItem(`modules-selection-v2-${id}`)

      return stored ? JSON.parse(stored) : null
    } catch (err) {
      return null
    }
  }, [id])

  const curriculum = useMemo(
    () =>
      savedCurriculum ?? getInitialCurriculum(courseData?.course?.curriculum),
    [courseData?.course?.curriculum, savedCurriculum]
  )

  const curriculumRef = useRef<unknown>()

  const [
    {
      data: savedCurriculumData,
      fetching: savingCurriculumSelection,
      error: curriculumSelectionSavingError,
    },
    saveCurriculumSelection,
  ] = useSaveCurriculumSelection()

  const saveModulesSelection = () => {
    saveCurriculumSelection({
      courseId: Number(id),
      curriculum: curriculumRef.current,
    })
  }

  const handleCurriculumChange = (curriculum: unknown) => {
    curriculumRef.current = curriculum

    localStorage.setItem(
      `modules-selection-v2-${id}`,
      JSON.stringify(curriculumRef.current)
    )
  }

  useEffect(() => {
    if (savedCurriculumData?.update_course_by_pk?.id === Number(id)) {
      localStorage.removeItem(`modules-selection-v2-${id}`)

      navigate(`/courses/${id}/details?tab=${CourseDetailsTabs.GRADING}`)
    }
  }, [savedCurriculumData, navigate, id])

  return (
    <Box pb={6}>
      {fetchingCourseData ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : null}

      {curriculum ? (
        <>
          <ModulesSelectionTitle />
          <ModulesSelectionListV2
            curriculum={curriculum}
            onChange={handleCurriculumChange}
          />

          {curriculumSelectionSavingError ? (
            <Alert sx={{ mt: 2 }} severity="error" data-testid="saving-alert">
              {t('pages.modules-selection.saving-error')}
            </Alert>
          ) : null}

          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={isMobile ? 'column' : 'row'}
            mt={3}
          >
            <LoadingButton
              onClick={() => backToStep('grading-clearance')}
              sx={{ py: 1 }}
            >
              <Typography variant="body1" fontWeight={600}>
                {t('pages.modules-selection.back-button-text')}
              </Typography>
            </LoadingButton>
            <LoadingButton
              loading={savingCurriculumSelection}
              variant="contained"
              onClick={saveModulesSelection}
              sx={{ py: 1, mt: isMobile ? 2 : 0 }}
            >
              <Typography variant="body1" fontWeight={600}>
                {t('pages.modules-selection.save-button-text')}
              </Typography>
            </LoadingButton>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
