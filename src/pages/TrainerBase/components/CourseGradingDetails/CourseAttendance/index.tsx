import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, CircularProgress, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'

import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useFetcher } from '@app/hooks/use-fetcher'

import { CourseAttendanceList } from '../CourseAttendanceList'

import { LoadingStatus } from '@app/util'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/save-course-attendance'

export const CourseAttendance = () => {
  const { id: courseId } = useParams()
  const fetcher = useFetcher()
  const [attendanceSavingStatus, setAttendanceSavingStatus] = useState(
    LoadingStatus.IDLE
  )
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data: participantsData, status } = useCourseParticipants(
    courseId ?? ''
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
      name: `${participant.profile.givenName} ${participant.profile.familyName}`,
      id: participant.id,
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
    const notAttended: string[] = []

    for (const id in attendanceRef.current) {
      if (attendanceRef.current[id]) {
        attended.push(id)
      } else {
        notAttended.push(id)
      }
    }

    try {
      await fetcher<ResponseType, ParamsType>(MUTATION, {
        attended,
        notAttended,
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
          <Box mb={2}>
            <Typography variant="h5" fontWeight="500" mb={1}>
              {t('pages.course-attendance.title')}
            </Typography>
            <Typography>
              {t('pages.course-attendance.page-description-line1')}
            </Typography>
            <Typography fontWeight="500">
              {t('pages.course-attendance.page-description-line2')}
            </Typography>
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
            >
              {t('pages.course-attendance.next-page-button-text')}
            </LoadingButton>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
