import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { t } from 'i18next'
import { capitalize } from 'lodash'
import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { useCourseDraft } from '@app/modules/course/hooks/useCourseDraft'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { DraftConfirmationDialog } from '@app/modules/trainer_courses/components/DraftConfirmationDialog'

import { useCreateCourse } from './components/CreateCourseProvider'
import { CreateCourseSteps } from './components/CreateCourseSteps'

const excludeCourseStepsPathnames = ['/courses/new/modules']
const whiteBackgroundPathnames = ['/courses/new/modules']

export const CreateCoursePage = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { id: draftId } = useParams()

  const { acl } = useAuth()
  const navigate = useNavigate()

  const isDraftCourseBuilderPage = useMemo(() => {
    return draftId && location.pathname.includes('modules')
  }, [draftId, location.pathname])

  const {
    completedSteps,
    courseData,
    courseType: contextCourseType,
    currentStepKey,
    draftName: courseDraftName,
    initializeData,
    setShowDraftConfirmationDialog,
    showDraftConfirmationDialog,
  } = useCreateCourse()

  const { data: draftData, name: draftName, fetching } = useCourseDraft(draftId)
  useEffect(() => {
    if (draftData.courseData && !courseData) {
      initializeData(draftData, draftName ?? undefined)
    }
  }, [courseData, draftData, draftName, initializeData])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isDraft = location.pathname.indexOf('draft') > -1

  const includeCourseSteps = !(
    excludeCourseStepsPathnames.includes(location.pathname) ||
    isDraftCourseBuilderPage
  )

  const courseType = useMemo(() => {
    const qsType =
      (searchParams.get('type') as Course_Type_Enum) ?? Course_Type_Enum.Open
    return courseData?.type ?? qsType
  }, [courseData, searchParams])

  const suspenseLoadingForDraftCourse = useMemo(() => {
    // draftData.courseData?.type !== contextCourseType will wait until the course type from create course context is synced with the draft course one
    return (
      (fetching && Boolean(draftId)) ||
      (!fetching &&
        Boolean(draftData.courseData?.type) &&
        draftData.courseData?.type !== contextCourseType)
    )
  }, [contextCourseType, draftData.courseData?.type, draftId, fetching])

  if (suspenseLoadingForDraftCourse) {
    return <SuspenseLoading />
  }

  if (!acl.canCreateCourse(courseType)) {
    return <NotFound />
  }

  return (
    <FullHeightPageLayout
      bgcolor={
        whiteBackgroundPathnames.includes(location.pathname) ||
        isDraftCourseBuilderPage
          ? undefined
          : theme.palette.grey[100]
      }
    >
      <Helmet>
        <title>
          {location.pathname.includes('drafts')
            ? t('pages.browser-tab-titles.my-courses.draft-course')
            : t('pages.browser-tab-titles.manage-courses.creating-course', {
                courseType: capitalize(courseType),
              })}
        </title>
      </Helmet>
      <Container
        maxWidth="lg"
        sx={{ pt: includeCourseSteps ? 2 : 0 }}
        disableGutters
      >
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          {!includeCourseSteps ? null : (
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
          )}

          <Box flex={1}>
            <Box mt={isMobile || !includeCourseSteps ? 0 : 8}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Container>

      {showDraftConfirmationDialog && (
        <DraftConfirmationDialog
          open={showDraftConfirmationDialog}
          name={courseDraftName}
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
