import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  styled,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {
  Course_Participant_Audit_Insert_Input,
  Course_Participant_Audit_Type_Enum,
  SaveCourseAttendanceMutation,
  SaveCourseAttendanceMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { MUTATION } from '@app/queries/courses/save-course-attendance'
import { CourseParticipant } from '@app/types'
import { LoadingStatus } from '@app/util'

import { CourseAttendanceList } from '../CourseAttendanceList'
import { useGradingDetails } from '../GradingDetailsProvider'
import { useSaveGradingDetails } from '../hooks/useSaveGradingDetails'

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
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { completeStep, steps } = useGradingDetails()

  const { data: participantsData, status } = useCourseParticipants(
    Number(courseId) ?? ''
  )

  const saveGradingDetails = useSaveGradingDetails()

  const ATTENDANCE_KEY = `course-attendance-${courseId}`

  const go1Integration = participantsData?.length
    ? participantsData[0].course.go1Integration
    : false

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
    const attendedAudit: Course_Participant_Audit_Insert_Input[] = []
    const notAttended: string[] = []
    const notAttendedAudit: Course_Participant_Audit_Insert_Input[] = []

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
          payload: {},
        })
      } else {
        notAttended.push(id)
        notAttendedAudit.push({
          type: Course_Participant_Audit_Type_Enum.NotAttended,
          profile_id: participant?.profile.id,
          course_id: Number(courseId),
          payload: {},
        })
      }
    }

    try {
      await Promise.all(
        [
          await fetcher<
            SaveCourseAttendanceMutation,
            SaveCourseAttendanceMutationVariables
          >(MUTATION, {
            attended,
            attendedAudit,
            notAttended,
            notAttendedAudit,
          }),
          steps.length === 1
            ? saveGradingDetails({ courseId: Number(courseId) })
            : null,
        ].filter(Boolean)
      )

      setAttendanceSavingStatus(LoadingStatus.SUCCESS)
      localStorage.removeItem(ATTENDANCE_KEY)

      completeStep('grading-clearance')
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
            <StyledText>
              <Trans i18nKey="pages.course-attendance.description" />
            </StyledText>
            <StyledList>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.completed-the-course')}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.valid-identification')}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.passed-the-quiz')}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t('pages.course-attendance.valid-pre-requisite')}
                </StyledText>
              </li>
              {go1Integration ? (
                <li>
                  <StyledText variant="body1">
                    {t('pages.course-attendance.blended-resource-completed')}
                  </StyledText>
                </li>
              ) : null}
            </StyledList>
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
              fullWidth={isMobile}
              endIcon={<ArrowForwardIcon />}
            >
              <Typography variant="body1" fontWeight={600}>
                {steps.length > 1
                  ? t('pages.course-attendance.confirm-grading')
                  : t('pages.modules-selection.save-button-text')}
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
