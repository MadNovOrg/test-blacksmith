import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { Expire } from '@app/components/Expire'

import useCourse from '@app/hooks/useCourse'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import useCourseInvites from '@app/hooks/useCourseInvites'

import { CourseInvites } from './CourseInvites'

import { LoadingStatus } from '@app/util'
import { AttendingTab } from '@app/pages/TrainerBase/components/CourseParticipants/AttendingTab'
import { InviteStatus } from '@app/types'
import { InvitesTab } from '@app/pages/TrainerBase/components/CourseParticipants/InvitesTab'

export const CourseParticipants = () => {
  const { id: courseId } = useParams()
  const [searchParams] = useSearchParams()
  const [selectedTab, setSelectedTab] = useState('0')

  const { t } = useTranslation()
  const navigate = useNavigate()

  const courseJustSubmitted = searchParams.get('courseJustSubmitted') === 'true'

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')
  const {
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
    error: courseParticipantsError,
  } = useCourseParticipants(courseId ?? '')
  const { total: pendingTotal } = useCourseInvites(
    courseId ?? '',
    InviteStatus.PENDING
  )
  const { total: declinedTotal } = useCourseInvites(
    courseId ?? '',
    InviteStatus.DECLINED
  )

  if (courseLoadingStatus === LoadingStatus.FETCHING) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="course-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}
      {course ? (
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
            {courseParticipantsLoadingStatus === LoadingStatus.FETCHING ? (
              <Stack
                alignItems="center"
                paddingTop={2}
                data-testid="course-participants-fetching"
              >
                <CircularProgress />
              </Stack>
            ) : null}

            {courseParticipantsError ? (
              <Alert severity="error">
                There was an error loading course participants.
              </Alert>
            ) : null}

            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle2" fontSize="18px">
                {t('pages.course-participants.attending', {
                  attending: courseParticipantsTotal,
                  max: course.max_participants,
                })}
              </Typography>

              {courseJustSubmitted && (
                <Expire delay={3000}>
                  <Alert variant="outlined" color="success">
                    {`You have successfully created your ${course.name} Course`}
                  </Alert>
                </Expire>
              )}
              <CourseInvites course={course} />
            </Grid>

            <TabContext value={selectedTab}>
              <TabList
                onChange={(_, selectedTab: React.SetStateAction<string>) =>
                  setSelectedTab(selectedTab)
                }
              >
                <Tab
                  label={t('pages.course-participants.tabs.attending', {
                    number: courseParticipantsTotal,
                  })}
                  value="0"
                />
                <Tab
                  label={t('pages.course-participants.tabs.pending', {
                    number: pendingTotal,
                  })}
                  value="1"
                />
                <Tab
                  label={t('pages.course-participants.tabs.declined', {
                    number: declinedTotal,
                  })}
                  value="2"
                />
              </TabList>

              <TabPanel value="0">
                <AttendingTab course={course} />
              </TabPanel>
              <TabPanel value="1">
                <InvitesTab
                  course={course}
                  inviteStatus={InviteStatus.PENDING}
                />
              </TabPanel>
              <TabPanel value="2">
                <InvitesTab
                  course={course}
                  inviteStatus={InviteStatus.DECLINED}
                />
              </TabPanel>
            </TabContext>
          </Container>
        </>
      ) : (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Alert severity="warning">Course not found.</Alert>
        </Container>
      )}
    </>
  )
}
