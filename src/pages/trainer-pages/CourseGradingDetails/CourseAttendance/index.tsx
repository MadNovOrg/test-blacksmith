import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { Course_Participant_Audit_Type_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/save-course-attendance'
import { CourseParticipant } from '@app/types'
import { LoadingStatus } from '@app/util'

import { CourseAttendanceList } from '../CourseAttendanceList'

const StyledList = styled('ol')(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  color: theme.palette.dimGrey.main,
}))

const StyledText = styled(Typography)(({ theme }) => ({
  display: 'inline',
  color: theme.palette.dimGrey.main,
}))

export const CourseAttendance = () => {
  const { id: courseId } = useParams()
  const fetcher = useFetcher()
  const [attendanceSavingStatus, setAttendanceSavingStatus] = useState(
    LoadingStatus.IDLE
  )
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data: participantsData, status } = useCourseParticipants(
    Number(courseId) ?? ''
  )

  const ATTENDANCE_KEY = `course-attendance-${courseId}`

  const participants = useMemo(() => {
    if (!participantsData) {
      return []
    }

    const rawStoredAttendance = localStorage.getItem(ATTENDANCE_KEY)

    const storedAttendance: Record<string, boolean> = JSON.parse(
      rawStoredAttendance ?? '{}'
    )

    return participantsData.map(participant => ({
      name: participant.profile.fullName,
      id: participant.id,
      avatar: participant.profile.avatar,
      attending:
        participant.attended ?? storedAttendance[participant.id] ?? true,
    }))
  }, [ATTENDANCE_KEY, participantsData])

  const attendanceRef = useRef<Record<string, boolean> | null>(null)

  useEffect(() => {
    const initialAttendance: Record<string, boolean> = {}
    participants.forEach(participant => {
      initialAttendance[participant.id] = participant.attending
    })

    attendanceRef.current = initialAttendance
  }, [participants])

  const handleAttendanceChange = (attendance: Record<string, boolean>) => {
    attendanceRef.current = attendance
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance))
  }

  const saveAttendance = async () => {
    setAttendanceSavingStatus(LoadingStatus.FETCHING)

    const attended: string[] = []
    const attendedAudit: ParamsType['attendedAudit'] = []
    const notAttended: string[] = []
    const notAttendedAudit: ParamsType['notAttendedAudit'] = []

    for (const id in attendanceRef.current) {
      const participant = participantsData?.find(
        p => p.id === id
      ) as CourseParticipant

      if (attendanceRef.current[id]) {
        attended.push(id)
        attendedAudit.push({
          type: Course_Participant_Audit_Type_Enum.Attended,
          profile_id: participant?.profile.id,
          course_id: Number(courseId),
        })
      } else {
        notAttended.push(id)
        notAttendedAudit.push({
          type: Course_Participant_Audit_Type_Enum.NotAttended,
          profile_id: participant?.profile.id,
          course_id: Number(courseId),
        })
      }
    }

    try {
      await fetcher<ResponseType, ParamsType>(MUTATION, {
        attended,
        attendedAudit,
        notAttended,
        notAttendedAudit,
      })

      setAttendanceSavingStatus(LoadingStatus.SUCCESS)
      localStorage.removeItem(ATTENDANCE_KEY)

      navigate('./modules')
    } catch (err) {
      setAttendanceSavingStatus(LoadingStatus.ERROR)
    }
  }

  return (
    <Box pb={5}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="participants-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}
      {participants.length ? (
        <>
          <Box mb={4}>
            <Typography variant="h5" fontWeight="500" mb={2}>
              {t('pages.course-attendance.title')}
            </Typography>
            <StyledText variant="body1">
              {t('pages.course-attendance.page-description-line1') + ' '}
            </StyledText>
            <StyledText variant="body1" fontWeight="600">
              {t('pages.course-attendance.page-description-line2') + ' '}
            </StyledText>
            <StyledText variant="body1">
              {t('pages.course-attendance.page-description-line3')}
            </StyledText>
            <StyledList>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.page-description-line4')}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.page-description-line5')}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.page-description-line6')}
                </StyledText>
              </li>
            </StyledList>
            <StyledText variant="body1" fontWeight="600">
              {t('pages.course-attendance.page-description-line7')}
            </StyledText>
          </Box>

          <CourseAttendanceList
            participants={participants}
            onChange={handleAttendanceChange}
          />
          <Box display="flex" justifyContent="right" mt={3}>
            <LoadingButton
              loading={attendanceSavingStatus === LoadingStatus.FETCHING}
              variant="contained"
              onClick={saveAttendance}
              sx={{ py: 1 }}
              endIcon={<ArrowForwardIcon />}
            >
              <Typography variant="body1" fontWeight={600}>
                {t('pages.course-attendance.next-page-button-text')}
              </Typography>
            </LoadingButton>
          </Box>
        </>
      ) : (
        <Alert severity="warning">
          {t('pages.course-attendance.no-participants-warning')}
        </Alert>
      )}
    </Box>
  )
}
