import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  styled,
  Tab,
  tabClasses,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { Expire } from '@app/components/Expire'

import useCourse from '@app/hooks/useCourse'

import { courseEnded, LoadingStatus } from '@app/util'
import { CourseAttendees } from '@app/pages/TrainerBase/components/CourseDetails/components/CourseAttendees'
import { CourseGrading } from '@app/pages/TrainerBase/components/CourseDetails/components/CourseGrading'
import { EvaluationSummary } from '@app/pages/TrainerBase/components/EvaluationSummary'

const CourseDetailsTabs = {
  ATTENDEES: 'ATTENDEES',
  GRADING: 'GRADING',
  EVALUATION: 'EVALUATION',
} as const

const StyledTabList = styled(TabList)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  minHeight: theme.spacing(5),

  '& .MuiTabs-indicator': {
    display: 'none',
  },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: theme.spacing(4),
  height: theme.spacing(4),

  '& + &': {
    marginLeft: theme.spacing(3),
  },

  [`&.${tabClasses.selected}`]: {
    background: theme.palette.grey[100],
    borderRadius: theme.spacing(0.5),
    ...theme.typography.body1,
    fontWeight: '500',
    border: 0,
  },
}))

const successAlerts = {
  course_submitted:
    'pages.trainer-base.create-course.new-course.submitted-course',
  course_evaluated: 'course-evaluation.saved',
} as const

export const CourseDetails = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [searchParams] = useSearchParams()
  const alertType = searchParams.get('success') as keyof typeof successAlerts
  const alertMessage = alertType ? successAlerts[alertType] : null

  const [selectedTab, setSelectedTab] = useState<
    keyof typeof CourseDetailsTabs
  >(CourseDetailsTabs.ATTENDEES)

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  const courseHasEnded = course && courseEnded(course)

  return (
    <>
      {courseError && (
        <Alert severity="error">There was an error loading a course.</Alert>
      )}
      {course ? (
        <>
          {courseLoadingStatus === LoadingStatus.FETCHING ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="course-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <CourseHeroSummary
                course={course}
                renderButton={() => (
                  <Button variant="contained" color="secondary" size="large">
                    {t('pages.course-participants.edit-course-button')}
                  </Button>
                )}
              >
                <Button
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                  sx={{ marginBottom: 2 }}
                  onClick={() => navigate('/trainer-base/course')}
                >
                  {t('pages.course-participants.back-button')}
                </Button>
              </CourseHeroSummary>

              <TabContext value={selectedTab}>
                <Box borderBottom={1} borderColor="divider">
                  <Container>
                    <StyledTabList
                      onChange={(
                        _,
                        selectedTab: React.SetStateAction<
                          keyof typeof CourseDetailsTabs
                        >
                      ) => setSelectedTab(selectedTab)}
                    >
                      <StyledTab
                        label={t('pages.course-details.tabs.attendees.title')}
                        value={CourseDetailsTabs.ATTENDEES}
                      />
                      {courseHasEnded ? (
                        <StyledTab
                          label={t('pages.course-details.tabs.grading.title')}
                          value={CourseDetailsTabs.GRADING}
                        />
                      ) : null}
                      <StyledTab
                        label={t('pages.course-details.tabs.evaluation.title')}
                        value={CourseDetailsTabs.EVALUATION}
                      />
                    </StyledTabList>
                  </Container>
                </Box>

                <Container sx={{ pb: 2 }}>
                  {alertMessage ? (
                    <Expire delay={3000}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt={2}
                      >
                        <Alert variant="outlined" color="success">
                          {t(alertMessage, { name: course?.name })}
                        </Alert>
                      </Box>
                    </Expire>
                  ) : null}

                  <TabPanel value={CourseDetailsTabs.ATTENDEES}>
                    <CourseAttendees course={course} />
                  </TabPanel>
                  {courseHasEnded ? (
                    <TabPanel value={CourseDetailsTabs.GRADING}>
                      <CourseGrading course={course} />
                    </TabPanel>
                  ) : null}

                  <TabPanel value={CourseDetailsTabs.EVALUATION}>
                    <EvaluationSummary />
                  </TabPanel>
                </Container>
              </TabContext>
            </>
          )}
        </>
      ) : (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Alert severity="warning">Course not found.</Alert>
        </Container>
      )}
    </>
  )
}
