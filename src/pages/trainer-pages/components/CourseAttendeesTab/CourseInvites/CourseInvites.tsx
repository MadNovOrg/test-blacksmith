import LoadingButton from '@mui/lab/LoadingButton'
import {
  Autocomplete,
  Button,
  FormHelperText,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { saveAs } from 'file-saver'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'
import { useQuery } from 'urql'
import * as XLSX from 'xlsx'
import * as yup from 'yup'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  ExportBlendedLearningCourseDataQuery,
  ExportBlendedLearningCourseDataQueryVariables,
} from '@app/generated/graphql'
import useCourseInvites from '@app/hooks/useCourseInvites'
import { EXPORT_BLENDED_LEARNING_ATTENDEES } from '@app/queries/blended-learning-attendees/blended-learning-attendees-data'
import { Course, CourseType, InviteStatus } from '@app/types'
import { courseStarted } from '@app/util'

type Props = {
  course: Course
  attendeesCount?: number
  onExportError?: () => void
}

const emailSchema = yup.string().email().required()

export const CourseInvites = ({
  course,
  attendeesCount = 0,
  onExportError,
}: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { acl, profile } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emails, setEmails] = useState<string[]>([])

  const [{ data, fetching, error: exportError }, reexecuteQuery] = useQuery<
    ExportBlendedLearningCourseDataQuery,
    ExportBlendedLearningCourseDataQueryVariables
  >({
    query: EXPORT_BLENDED_LEARNING_ATTENDEES,
    variables: { input: { courseId: course.id } },
    pause: true,
  })

  const invites = useCourseInvites(course?.id)
  const pendingInvites = invites.data.filter(
    i => i.status === InviteStatus.PENDING
  )
  const invitesLeft = course
    ? course.max_participants - pendingInvites.length - attendeesCount
    : 0

  const courseCancelled =
    course?.status === Course_Status_Enum.Cancelled ||
    course?.status === Course_Status_Enum.Declined

  const closeModal = useCallback(() => {
    setNewEmail('')
    setEmails([])
    setError('')
    setSaving(false)
    setShowModal(false)
  }, [])

  const onEmailsChange = (
    ev: React.SyntheticEvent<Element, Event>,
    value: (string | string[])[],
    reason: string
  ) => {
    setError('')

    if (reason === 'removeOption') {
      return setEmails(value as string[])
    }

    const [last] = value.slice(-1) as string[]
    const newEntries = last
      .split(/[,\s;]/)
      .map(e => e.toLowerCase().trim())
      .filter(Boolean)
    const allValid = yup.array(emailSchema).min(1).isValidSync(newEntries)
    if (!allValid) {
      ev.preventDefault()
      setNewEmail(last)
      return setError('INVALID_EMAILS')
    }

    if (emails.length + newEntries.length > invitesLeft) {
      ev.preventDefault()
      setNewEmail(last)
      return setError('LIMIT_REACHED')
    }

    setEmails([...new Set(emails.concat(newEntries))])
    setNewEmail('')
  }

  const onSubmit = useCallback(async () => {
    setError('')

    if (!emails.length && !newEmail) {
      return setError('EMAIL_REQUIRED')
    }

    const leftOvers = newEmail
      .split(',')
      .map(e => e.toLowerCase().trim())
      .filter(Boolean)

    if (!yup.array(emailSchema).isValidSync(leftOvers)) {
      return setError('INVALID_EMAILS')
    }

    if (emails.length + leftOvers.length > invitesLeft) {
      return setError('LIMIT_REACHED')
    }

    try {
      setSaving(true)
      await invites.send([...emails, ...leftOvers])
      closeModal()
    } catch (err) {
      setSaving(false)
      setError((err as Error).message)
    }
  }, [invites, emails, closeModal, newEmail, invitesLeft])

  const errorMessage = useMemo(() => {
    if (!error) {
      return null
    }

    const msg = t(`pages.course-participants.invite-error-${error}`)
    if (msg !== '') {
      return msg
    }

    return t('pages.course-participants.invite-error-UNKNOWN')
  }, [error, t])

  const courseHasStarted = course && courseStarted(course)
  const isOpenCourse = course && course.type === CourseType.OPEN

  const renderInput = useCallback(
    (params: TextFieldProps) => (
      <TextField
        {...params}
        variant="filled"
        placeholder={t('pages.course-participants.invite-input-placeholder')}
        sx={{
          '.MuiAutocomplete-inputRoot': {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
          '.MuiAutocomplete-tag': { ml: -1 },
          '.MuiAutocomplete-inputRoot .MuiAutocomplete-input': {
            width: 'auto',
            alignSelf: 'stretch',
            py: 1,
          },
        }}
      />
    ),
    [t]
  )

  const allowInvites =
    acl.canInviteAttendees(course.type) ||
    (course.type === CourseType.CLOSED &&
      course.bookingContact?.id === profile?.id)

  useUpdateEffect(() => {
    if (exportError?.message && onExportError) onExportError()
  }, [exportError?.message])

  useUpdateEffect(() => {
    if (exportError && onExportError) onExportError()

    const formatDateTime = (dateTime?: string | null) =>
      dateTime
        ? new Date(dateTime).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
        : ''

    if (data?.attendees) {
      const exportedData = data?.attendees

      const attendeesData = [
        Object.values(
          t('pages.blended-learning-attendees-cols', { returnObjects: true })
        ),
        ...exportedData.attendees.map(attendee => {
          return [
            attendee.userName,
            attendee.email,
            exportedData?.courseName,
            exportedData?.courseCode,
            formatDateTime(exportedData?.courseStartDate),
            formatDateTime(exportedData?.courseEndDate),
            attendee.blendedLearningStatus,
            attendee.blendedLearningPass,
            formatDateTime(attendee.blendedLearningStartDate),
            formatDateTime(attendee.blendedLearningEndDate),
            exportedData?.commissioningOrganisationName,
            exportedData?.leadTrainerName,
          ]
        }),
      ]

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(attendeesData)
      XLSX.utils.book_append_sheet(wb, ws, 'Attendees')

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      saveAs(new Blob([buffer]), 'attendees.xlsx')
    }
  }, [data, reexecuteQuery, t])

  const displayInviteTools =
    !courseHasStarted && !courseCancelled && allowInvites

  return (
    <>
      <Grid
        item
        container
        md={7}
        sm={12}
        alignItems="center"
        justifyContent="flex-end"
      >
        {displayInviteTools &&
          (isOpenCourse ? (
            <>
              <Typography variant="subtitle2" data-testid="seats-left">
                {t('pages.course-participants.seats-left', {
                  count: invitesLeft - emails.length,
                })}
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => {
                  navigate(
                    `/registration?course_id=${course.id}&quantity=1&internal=true`
                  )
                }}
                disabled={invitesLeft === 0}
                data-testid="add-registrants-btn"
              >
                {t('pages.course-participants.add-registrants-btn')}
              </Button>
            </>
          ) : (
            <>
              <Grid
                item
                md={3}
                sm={12}
                display="flex"
                justifyContent="space-around"
              >
                <Typography variant="subtitle2" data-testid="invites-left">
                  {t('pages.course-participants.invites-left', {
                    count: invitesLeft - emails.length,
                  })}
                </Typography>
              </Grid>
              <Grid item md={3} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowModal(true)}
                  disabled={invitesLeft === 0}
                  fullWidth={isMobile}
                  data-testid="course-invite-btn"
                >
                  {t('pages.course-participants.invite-btn')}
                </Button>
              </Grid>
            </>
          ))}
        {acl.canSeeExportProgressBtnOnBLCourse(course) &&
        attendeesCount > 0 &&
        course.go1Integration ? (
          <Grid
            item
            md={3}
            sm={12}
            sx={{ mt: { sm: 1, md: 0 }, ml: { sm: 0, md: 2 } }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={fetching}
              data-testid="progress-export"
              onClick={() => reexecuteQuery({ requestPolicy: 'network-only' })}
              fullWidth={isMobile}
            >
              {t('pages.course-details.tabs.attendees.progress-export')}
            </LoadingButton>
          </Grid>
        ) : null}
      </Grid>
      <Dialog
        open={showModal}
        onClose={closeModal}
        title={t('pages.course-participants.invite-modal-title')}
        maxWidth={600}
      >
        <Typography variant="body2">
          <Trans i18nKey="pages.course-participants.invite-modal-intro" />
        </Typography>

        <Typography fontWeight="bold" data-testid="modal-invites-left">
          {t('pages.course-participants.invites-left', {
            count: invitesLeft - emails.length,
          })}
        </Typography>

        <Grid container alignItems="flex-end" spacing={2} sx={{ my: 1 }}>
          <Grid item md={8} sm={12} sx={{ minWidth: 0 }}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              disableClearable
              disabled={saving}
              fullWidth
              inputValue={newEmail}
              onInputChange={(ev, value) => setNewEmail(value)}
              value={emails}
              onChange={onEmailsChange}
              renderInput={renderInput}
              data-testid="modal-invites-emails"
            />
          </Grid>
          <Grid item md={4} sm={12}>
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              onClick={onSubmit}
              loading={saving}
              disabled={emails.length > invitesLeft}
              fullWidth={isMobile}
              data-testid="modal-invites-send"
            >
              {t('pages.course-participants.invite-send-btn')}
            </LoadingButton>
          </Grid>
        </Grid>
        {errorMessage ? (
          <FormHelperText error>{errorMessage}</FormHelperText>
        ) : (
          <FormHelperText>
            {t('pages.course-participants.invite-input-hint')}
          </FormHelperText>
        )}
      </Dialog>
    </>
  )
}
