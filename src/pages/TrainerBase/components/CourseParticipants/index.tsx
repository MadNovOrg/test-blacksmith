import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TabContext, TabList, TabPanel } from '@mui/lab'

import useCourseParticipants from '@app/hooks/useCourseParticipants'
import useCourseInvites from '@app/hooks/useCourseInvites'

import { CourseInvites } from './CourseInvites'

import { LoadingStatus } from '@app/util'
import { AttendingTab } from '@app/pages/TrainerBase/components/CourseParticipants/AttendingTab'
import { Course, InviteStatus } from '@app/types'
import { InvitesTab } from '@app/pages/TrainerBase/components/CourseParticipants/InvitesTab'

type CourseParticipantsProps = {
  course: Course
}

export const CourseParticipants: React.FC<CourseParticipantsProps> = ({
  course,
}) => {
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

  return (
    <>
      <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
        {!course ||
        courseParticipantsLoadingStatus === LoadingStatus.FETCHING ? (
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
          </>
        )}
      </Container>
    </>
  )
}
