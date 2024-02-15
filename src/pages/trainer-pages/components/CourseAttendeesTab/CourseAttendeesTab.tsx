import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import useCourseInvites from '@app/hooks/useCourseInvites'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { Course } from '@app/types'
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
  const { acl, profile } = useAuth()
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
    mutate: mutateParticipants,
  } = useCourseParticipants(courseId, {
    alwaysShowArchived: true,
    ...(acl.isBookingContact() && course.type === Course_Type_Enum.Open
      ? { where: { order: { bookingContactProfileId: { _eq: profile?.id } } } }
      : {}),
  })
  const { total: pendingTotal } = useCourseInvites({
    courseId,
    status: Course_Invite_Status_Enum.Pending,
  })
  const { total: declinedTotal } = useCourseInvites({
    courseId,
    status: Course_Invite_Status_Enum.Declined,
  })
  const { total: waitlistTotal } = useWaitlist({
    courseId: courseId,
    sort: { by: 'createdAt', dir: 'asc' },
  })

  const isOpenCourse = course?.type === Course_Type_Enum.Open

  const showErrorAlert = useCallback(() => {
    setShowCourseInformationAlert({ success: false })
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCourseInformationAlert(undefined)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [showCourseInformationAlert])

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
              {acl.isBookingContact() && course.type === Course_Type_Enum.Open
                ? t('pages.course-participants.number-attending', {
                    number: courseParticipantsTotal,
                  })
                : t('pages.course-participants.attending', {
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
              onExportError={showErrorAlert}
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
                onSendingCourseInformation={success =>
                  setShowCourseInformationAlert({ success })
                }
                updateAttendeesHandler={mutateParticipants}
              />
            </TabPanel>
            {!isOpenCourse
              ? [
                  Course_Invite_Status_Enum.Pending,
                  Course_Invite_Status_Enum.Declined,
                ].map((status, index) => (
                  <>
                    <TabPanel
                      key={status}
                      value={`${index + 1}`}
                      sx={{ px: 0 }}
                    >
                      <InvitesTab course={course} inviteStatus={status} />
                    </TabPanel>
                  </>
                ))
              : null}
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
