import LoadingButton from '@mui/lab/LoadingButton'
import {
  Autocomplete,
  Button,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { Dialog } from '@app/components/Dialog'
import { Course_Status_Enum } from '@app/generated/graphql'
import useCourseInvites from '@app/hooks/useCourseInvites'
import { Course, CourseType, InviteStatus } from '@app/types'
import { courseStarted } from '@app/util'

type Props = {
  course?: Course
}

const emailSchema = yup.string().email().required()

export const CourseInvites = ({ course }: Props) => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emails, setEmails] = useState<string[]>([])

  const invites = useCourseInvites(course?.id)
  const invitesNotDeclined = invites.data.filter(
    i => i.status !== InviteStatus.DECLINED
  )
  const invitesLeft = course
    ? course.max_participants - invitesNotDeclined.length
    : 0

  const courseCancelled = course?.status === Course_Status_Enum.Cancelled

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
    const newEntries = last.split(/[,\s;]/).map(e => e.toLowerCase().trim())
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

    setEmails(emails.concat(newEntries))
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
    params => (
      <TextField
        {...params}
        variant="standard"
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

  return (
    <>
      <Grid container item xs="auto" alignItems="center">
        {!courseHasStarted && !isOpenCourse && !courseCancelled && (
          <>
            <Typography variant="subtitle2" data-testid="invites-left">
              {t('pages.course-participants.invites-left', {
                count: invitesLeft - emails.length,
              })}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={() => setShowModal(true)}
              disabled={invitesLeft === 0}
              data-testid="course-invite-btn"
            >
              {t('pages.course-participants.invite-btn')}
            </Button>
          </>
        )}
      </Grid>

      <Dialog
        open={showModal}
        onClose={closeModal}
        title={t('pages.course-participants.invite-modal-title')}
        maxWidth={600}
      >
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          {t('pages.course-participants.invite-modal-intro')}
        </Typography>

        <Typography
          variant="body2"
          fontWeight="bold"
          data-testid="modal-invites-left"
        >
          {t('pages.course-participants.invites-left', {
            count: invitesLeft - emails.length,
          })}
        </Typography>

        <Grid
          container
          alignItems="flex-end"
          spacing={2}
          sx={{ my: 1, flexWrap: 'nowrap' }}
        >
          <Grid item xs sx={{ minWidth: 0 }}>
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
          <Grid item>
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              onClick={onSubmit}
              loading={saving}
              disabled={emails.length > invitesLeft}
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
