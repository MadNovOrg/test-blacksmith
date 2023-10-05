import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import useCourseInvites from '@app/hooks/useCourseInvites'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { Course, CourseType, InviteStatus } from '@app/types'
import { LoadingStatus } from '@app/util'

import { CourseInvites } from './CourseInvites'
import { AttendingTab } from './Tabs/AttendingTab'
import { InvitesTab } from './Tabs/InvitesTab'
import { WaitlistTab } from './Tabs/WaitlistTab'
import { TabMenu } from './TabsMenu'

type CourseAttendeesTabProps = {
  course: Course
}

export const CourseAttendeesTab: React.FC<
  React.PropsWithChildren<CourseAttendeesTabProps>
> = ({ course }) => {
  const { id } = useParams()
  const [selectedTab, setSelectedTab] = useState('0')
  const { acl } = useAuth()
  const [showCourseInformationAlert, setShowCourseInformationAlert] = useState<
    | {
        success: boolean
      }
    | undefined
  >(undefined)

  const { t } = useTranslation()

  const courseId = Number(id ?? 0)

  const {
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
    error: courseParticipantsError,
  } = useCourseParticipants(courseId, { alwaysShowArchived: true })
  const { total: pendingTotal } = useCourseInvites(
    courseId,
    InviteStatus.PENDING
  )
  const { total: declinedTotal } = useCourseInvites(
    courseId,
    InviteStatus.DECLINED
  )
  const { total: waitlistTotal } = useWaitlist({
    courseId: courseId,
    sort: { by: 'createdAt', dir: 'asc' },
  })

  const isOpenCourse = course?.type === CourseType.OPEN

  const showErrorAlert = useCallback(() => {
    setShowCourseInformationAlert({ success: false })
  }, [])

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
            rowSpacing={3}
            alignItems="center"
            sx={{ my: 2 }}
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

            {showCourseInformationAlert ? (
              <Alert
                variant="outlined"
                severity={
                  showCourseInformationAlert.success ? 'success' : 'error'
                }
              >
                {t(
                  showCourseInformationAlert.success
                    ? 'pages.course-participants.course-information-sent'
                    : 'common.errors.generic.unknown-error-please-retry'
                )}
              </Alert>
            ) : null}

            <CourseInvites
              course={course}
              attendeesCount={courseParticipantsTotal ?? 0}
              onExportError={() =>
                setShowCourseInformationAlert({ success: false })
              }
            />
          </Grid>
          <TabContext value={selectedTab}>
            <TabMenu
              courseParticipantsTotal={courseParticipantsTotal}
              pendingTotal={pendingTotal}
              declinedTotal={declinedTotal}
              waitListTotal={waitlistTotal}
              isOpenCourse={isOpenCourse}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />

            <TabPanel value="0" sx={{ px: 0 }}>
              <AttendingTab
                course={course}
                onSendingCourseInformation={showErrorAlert}
              />
            </TabPanel>
            {!isOpenCourse ? (
              <>
                <TabPanel value="1" sx={{ px: 0 }}>
                  <InvitesTab
                    course={course}
                    inviteStatus={InviteStatus.PENDING}
                  />
                </TabPanel>
                <TabPanel value="2" sx={{ px: 0 }}>
                  <InvitesTab
                    course={course}
                    inviteStatus={InviteStatus.DECLINED}
                  />
                </TabPanel>
              </>
            ) : null}
            {isOpenCourse && acl.canSeeWaitingLists() ? (
              <TabPanel value="3" sx={{ px: 0 }}>
                <WaitlistTab course={course} />
              </TabPanel>
            ) : null}
          </TabContext>
        </>
      )}
    </Container>
  )
}
