import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import useCourseInvites from '@app/hooks/useCourseInvites'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { AttendingTab } from '@app/pages/trainer-pages/components/CourseAttendees/AttendingTab'
import { InvitesTab } from '@app/pages/trainer-pages/components/CourseAttendees/InvitesTab'
import { WaitlistTab } from '@app/pages/trainer-pages/components/CourseAttendees/WaitlistTab'
import { Course, InviteStatus } from '@app/types'
import { LoadingStatus } from '@app/util'

import { CourseInvites } from '../CourseInvites'

type CourseAttendeesProps = {
  course: Course
}

export const CourseAttendees: React.FC<CourseAttendeesProps> = ({ course }) => {
  const { id: courseId } = useParams()
  const [selectedTab, setSelectedTab] = useState('0')

  const { t } = useTranslation()

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
  const { total: waitlistTotal } = useWaitlist({
    courseId: Number(courseId ?? 0),
    sort: { by: 'createdAt', dir: 'asc' },
  })

  return (
    <Container disableGutters>
      {!course || courseParticipantsLoadingStatus === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          paddingTop={2}
          data-testid="course-participants-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : (
        <>
          {courseParticipantsError ? (
            <Alert severity="error">{t('errors.loading-participants')}</Alert>
          ) : null}

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="subtitle2"
              fontSize="18px"
              data-testid="attending"
            >
              {t('pages.course-participants.attending', {
                attending: courseParticipantsTotal,
                max: course.max_participants,
              })}
            </Typography>

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
                data-testid="tabParticipants"
              />
              <Tab
                label={t('pages.course-participants.tabs.pending', {
                  number: pendingTotal,
                })}
                value="1"
                data-testid="tabPending"
              />
              <Tab
                label={t('pages.course-participants.tabs.declined', {
                  number: declinedTotal,
                })}
                value="2"
                data-testid="tabDeclined"
              />
              <Tab
                label={t('pages.course-participants.tabs.waitlist', {
                  number: waitlistTotal,
                })}
                value="3"
                data-testid="tabWaitlist"
              />
            </TabList>

            <TabPanel value="0" sx={{ px: 0 }}>
              <AttendingTab course={course} />
            </TabPanel>
            <TabPanel value="1" sx={{ px: 0 }}>
              <InvitesTab course={course} inviteStatus={InviteStatus.PENDING} />
            </TabPanel>
            <TabPanel value="2" sx={{ px: 0 }}>
              <InvitesTab
                course={course}
                inviteStatus={InviteStatus.DECLINED}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ px: 0 }}>
              <WaitlistTab course={course} />
            </TabPanel>
          </TabContext>
        </>
      )}
    </Container>
  )
}
