import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { t } from 'i18next'
import { useMemo } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import { NotFound } from '../common/NotFound'
import { DraftConfirmationDialog } from '../trainer-pages/MyCourses/components/DraftConfirmationDialog'

import { useCreateCourse } from './components/CreateCourseProvider'
import { CreateCourseSteps } from './components/CreateCourseSteps'

export const CreateCoursePage = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const { acl } = useAuth()
  const navigate = useNavigate()
  const {
    draftName,
    completedSteps,
    courseData,
    currentStepKey,
    showDraftConfirmationDialog,
    setShowDraftConfirmationDialog,
  } = useCreateCourse()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isDraft = location.pathname.indexOf('draft') > -1

  const courseType = useMemo(() => {
    const qsType =
      (searchParams.get('type') as Course_Type_Enum) ?? Course_Type_Enum.Open
    return courseData?.type ?? qsType
  }, [courseData, searchParams])

  if (!acl.canCreateCourse(courseType)) {
    return <NotFound />
  }

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Box width={400} display="flex" flexDirection="column" pr={4}>
            <Sticky top={20}>
              <Box mb={2}>
                <BackButton
                  label={
                    isDraft
                      ? t('pages.create-course.back-to-all-drafts-button')
                      : t('pages.create-course.back-to-all-courses-button')
                  }
                  to={isDraft ? '/drafts' : '/courses'}
                />
              </Box>
              <Box mb={isMobile ? 2 : 7}>
                <Typography variant="h2" mb={2}>
                  {t(`pages.create-course.${courseType}-course-title`)}
                </Typography>
              </Box>

              <CreateCourseSteps
                completedSteps={completedSteps ?? []}
                type={courseType}
                currentStepKey={currentStepKey ?? undefined}
                blendedLearning={courseData?.blendedLearning ?? false}
              />
            </Sticky>
          </Box>

          <Box flex={1}>
            <Box mt={isMobile ? 0 : 8}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Container>

      {showDraftConfirmationDialog && (
        <DraftConfirmationDialog
          open={showDraftConfirmationDialog}
          name={draftName}
          onCancel={() => {
            setShowDraftConfirmationDialog(false)
          }}
          onSubmit={() => {
            navigate('/drafts')
            setShowDraftConfirmationDialog(false)
          }}
        />
      )}
    </FullHeightPageLayout>
  )
}
