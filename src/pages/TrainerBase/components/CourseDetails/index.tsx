import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Tab,
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

const CourseDetailsTabs = {
  ATTENDEES: 'ATTENDEES',
  GRADING: 'GRADING',
}

export const CourseDetails = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [searchParams] = useSearchParams()
  const courseJustSubmitted = searchParams.get('courseJustSubmitted') === 'true'
  const [selectedTab, setSelectedTab] = useState(CourseDetailsTabs.ATTENDEES)

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

              <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
                {courseJustSubmitted && (
                  <Expire delay={3000}>
                    <Alert variant="outlined" color="success">
                      {`You have successfully created your ${course.name} Course`}
                    </Alert>
                  </Expire>
                )}

                <TabContext value={selectedTab}>
                  <TabList
                    onChange={(_, selectedTab: React.SetStateAction<string>) =>
                      setSelectedTab(selectedTab)
                    }
                  >
                    <Tab
                      label={t('pages.course-details.tabs.attendees.title')}
                      value={CourseDetailsTabs.ATTENDEES}
                    />
                    {courseHasEnded ? (
                      <Tab
                        label={t('pages.course-details.tabs.grading.title')}
                        value={CourseDetailsTabs.GRADING}
                      />
                    ) : null}
                  </TabList>

                  <TabPanel value={CourseDetailsTabs.ATTENDEES}>
                    <CourseAttendees course={course} />
                  </TabPanel>
                  {courseHasEnded ? (
                    <TabPanel value={CourseDetailsTabs.GRADING}>
                      <CourseGrading course={course} />
                    </TabPanel>
                  ) : null}
                </TabContext>
              </Container>
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
